import { NextResponse } from 'next/server'
import { getSupabaseServerClient, getServerUser } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/config'
import { itinerarySchema } from '@/lib/itinerary/schema'
import type { ItineraryStatus } from '@/types'

export const runtime = 'nodejs'

/** Save an itinerary for the authenticated user (row-level security applies). */
export async function POST(request: Request) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Saving requires Supabase configuration. See .env.example.' },
      { status: 501 },
    )
  }
  const user = await getServerUser()
  if (!user) return NextResponse.json({ error: 'Sign in to save journeys.' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const parsed = itinerarySchema.safeParse(body?.itinerary)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid itinerary payload.' }, { status: 400 })
  }

  const supabase = await getSupabaseServerClient()
  const status: ItineraryStatus = body?.status === 'completed' ? 'completed' : 'saved'
  const { data, error } = await supabase!
    .from('itineraries')
    .insert({ user_id: user.id, status, itinerary: parsed.data })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data?.id })
}
