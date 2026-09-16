import { NextResponse } from 'next/server'
import { getSupabaseServerClient, getServerUser } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/config'
import { itinerarySchema } from '@/lib/itinerary/schema'
import type { ItineraryStatus } from '@/types'

export const runtime = 'nodejs'

/** Update a saved journey. RLS guarantees only the owner can modify it. */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 501 })
  }
  const user = await getServerUser()
  if (!user) return NextResponse.json({ error: 'Sign in to update journeys.' }, { status: 401 })

  const { id } = await params
  const body = await request.json().catch(() => null)
  const update: Record<string, unknown> = {}

  if (body?.itinerary !== undefined) {
    const parsed = itinerarySchema.safeParse(body.itinerary)
    if (!parsed.success) return NextResponse.json({ error: 'Invalid itinerary payload.' }, { status: 400 })
    update.itinerary = parsed.data
  }
  if (body?.status === 'draft' || body?.status === 'saved' || body?.status === 'completed') {
    update.status = body.status satisfies ItineraryStatus
  }
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Nothing to update.' }, { status: 400 })
  }

  const supabase = await getSupabaseServerClient()
  const { error } = await supabase!.from('itineraries').update(update).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

/** Delete a saved journey (owner only, enforced by RLS). */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 501 })
  }
  const user = await getServerUser()
  if (!user) return NextResponse.json({ error: 'Sign in first.' }, { status: 401 })

  const { id } = await params
  const supabase = await getSupabaseServerClient()
  const { error } = await supabase!.from('itineraries').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
