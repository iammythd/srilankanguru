import { NextResponse } from 'next/server'
import { planInputSchema } from '@/lib/itinerary/schema'
import { generateItinerary } from '@/lib/itinerary/ai'
import { getSupabaseServerClient, getServerUser } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/config'
import type { PlanInput } from '@/types'

export const runtime = 'nodejs'

/**
 * Itinerary generation endpoint.
 *
 * Flow: validate input → generate via Claude (or curated planner when no key)
 * → validate structured JSON → persist under RLS when authenticated → return.
 * The AI provider key never leaves the server.
 */
export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body.' }, { status: 400 })
  }

  const parsed = planInputSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid trip details.', issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }
  const plan: PlanInput = parsed.data

  // Optional day regeneration: produce a fresh full plan, splice one day out.
  const bodyObj = body as { regenerateDayIndex?: number }
  const regenIndex = typeof bodyObj.regenerateDayIndex === 'number' ? bodyObj.regenerateDayIndex : null

  try {
    const full = await generateItinerary(plan)
    // Attach the plan so the client can regenerate later.
    full.plan = plan

    if (regenIndex !== null) {
      const source = full.days[Math.min(regenIndex, full.days.length - 1)]
      const day = { ...source, day: regenIndex + 1 }
      return NextResponse.json({ itinerary: { ...full, days: [day] }, persisted: false })
    }

    // Persist when Supabase is configured and the user is authenticated.
    if (isSupabaseConfigured()) {
      const user = await getServerUser()
      const supabase = await getSupabaseServerClient()
      if (user && supabase) {
        const { data, error } = await supabase
          .from('itineraries')
          .insert({ user_id: user.id, status: 'saved', itinerary: full })
          .select('id')
          .single()
        if (error) {
          console.error('[generate] persist failed:', error.message)
          return NextResponse.json({ itinerary: full, persisted: false, warning: 'Could not save — shown as a draft.' })
        }
        return NextResponse.json({ itinerary: full, persisted: true, id: data?.id })
      }
    }

    return NextResponse.json({ itinerary: full, persisted: false })
  } catch (error) {
    console.error('[generate] failed:', error)
    // Last-resort deterministic plan guarantees a usable response.
    const { composeItinerary } = await import('@/lib/itinerary/planner')
    const fallback = composeItinerary(plan)
    return NextResponse.json({ itinerary: fallback, persisted: false, warning: 'Used curated planner after an upstream error.' })
  }
}
