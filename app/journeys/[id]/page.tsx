import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { getSupabaseServerClient, getServerUser } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/config'
import SavedJourneyClient from '@/components/itinerary/SavedJourneyClient'
import type { ItineraryRecord } from '@/types'

export const dynamic = 'force-dynamic'

export default async function JourneyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-40 text-center">
        <h1 className="display text-4xl text-ink">Saved journeys need a database</h1>
        <p className="mt-4 text-muted">
          Configure Supabase (see .env.example) to store and revisit journeys. You can still
          plan and download draft itineraries without it.
        </p>
        <Link href="/plan" className="mt-8 inline-block rounded-full bg-terracotta px-8 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white">
          Build My Journey
        </Link>
      </div>
    )
  }

  const user = await getServerUser()
  if (!user) redirect(`/auth?next=/journeys/${id}`)

  const supabase = await getSupabaseServerClient()
  const { data } = await supabase!
    .from('itineraries')
    .select('id, status, itinerary, updated_at')
    .eq('id', id)
    .single()

  if (!data) notFound()
  const record = data as ItineraryRecord

  return <SavedJourneyClient id={record.id} initialItinerary={record.itinerary} />
}
