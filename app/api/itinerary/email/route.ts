import { NextResponse } from 'next/server'
import { sendItineraryEmail } from '@/lib/email/sender'
import { getSupabaseServerClient, getServerUser } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/config'
import type { Itinerary } from '@/types'

export const runtime = 'nodejs'

/**
 * "Email My Itinerary" endpoint. Uses the server-side email adapter;
 * returns 501 with a clear message when EMAIL_API_KEY is not configured.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const to: string | undefined = body?.email
  if (!to || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(to)) {
    return NextResponse.json({ error: 'Provide a valid email address.' }, { status: 400 })
  }

  let itinerary: Itinerary | null = body?.itinerary ?? null
  let journeyId: string | undefined = undefined

  if (body?.id) {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ error: 'Supabase is not configured.' }, { status: 501 })
    }
    const user = await getServerUser()
    if (!user) return NextResponse.json({ error: 'Sign in to email saved journeys.' }, { status: 401 })
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase!
      .from('itineraries')
      .select('id, itinerary')
      .eq('id', body.id)
      .single()
    if (error || !data) return NextResponse.json({ error: 'Journey not found.' }, { status: 404 })
    itinerary = (data as { itinerary: Itinerary }).itinerary
    journeyId = (data as { id: string }).id
  }

  if (!itinerary) return NextResponse.json({ error: 'Nothing to send.' }, { status: 400 })

  const origin = new URL(request.url).origin
  const itineraryUrl = journeyId ? `${origin}/journeys/${journeyId}` : `${origin}/itinerary`
  const pdfUrl = journeyId ? `${origin}/api/itinerary/pdf?id=${journeyId}` : undefined

  try {
    await sendItineraryEmail({ to, itinerary, itineraryUrl, pdfUrl })
    return NextResponse.json({ ok: true })
  } catch (error) {
    const statusCode = (error as { statusCode?: number }).statusCode ?? 500
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Email delivery failed.' },
      { status: statusCode },
    )
  }
}
