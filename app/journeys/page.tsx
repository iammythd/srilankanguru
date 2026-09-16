import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getSupabaseServerClient, getServerUser } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/config'
import type { ItineraryRecord } from '@/types'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'My Journeys' }

export default async function JourneysPage() {
  if (!isSupabaseConfigured()) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-40 text-center">
        <h1 className="display text-4xl text-ink">My Journeys needs a database</h1>
        <p className="mt-4 text-muted">
          Saved itineraries live in Supabase with row-level security. Set
          NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (see
          .env.example) to enable accounts and storage. Until then you can still
          plan and download drafts.
        </p>
        <Link href="/plan" className="mt-8 inline-block rounded-full bg-terracotta px-8 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white">
          Build My Journey
        </Link>
      </div>
    )
  }

  const user = await getServerUser()
  if (!user) redirect('/auth?next=/journeys')

  const supabase = await getSupabaseServerClient()
  const { data: records, error } = await supabase!
    .from('itineraries')
    .select('id, status, itinerary, updated_at')
    .order('updated_at', { ascending: false })

  const journeys = (records ?? []) as ItineraryRecord[]

  return (
    <div className="mx-auto max-w-6xl px-6 pb-28 pt-32">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="kicker">Dashboard</p>
          <h1 className="display mt-3 text-5xl text-ink">My Journeys</h1>
        </div>
        <Link
          href="/plan"
          className="rounded-full bg-terracotta px-6 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-transform hover:scale-[1.02]"
        >
          New journey
        </Link>
      </div>

      {error ? (
        <p className="mt-10 rounded-lg bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
          Could not load journeys: {error.message}. Run supabase/schema.sql to create the tables.
        </p>
      ) : journeys.length === 0 ? (
        <div className="mt-12 rounded-xl border-2 border-dashed border-sand-dark/40 p-16 text-center">
          <p className="display text-2xl text-ink">No journeys yet</p>
          <p className="mt-2 text-muted">Compose your first itinerary — it takes about two minutes.</p>
          <Link href="/plan" className="mt-6 inline-block rounded-full bg-jungle px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-sand">
            Build My Journey
          </Link>
        </div>
      ) : (
        <ul className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {journeys.map((record) => {
            const it = record.itinerary
            const stops = [...new Set(it.days.map((d) => d.location))]
            return (
              <li key={record.id} className="flex flex-col rounded-xl border border-sand-dark/30 bg-white p-6 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="display text-xl text-ink">{it.trip_title}</h2>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${record.status === 'completed' ? 'bg-tea/15 text-tea' : 'bg-sand/60 text-ocean'}`}>
                    {record.status}
                  </span>
                </div>
                <p className="mt-2 text-xs text-muted">
                  {it.start_date} → {it.end_date} · {it.days.length} days · updated {new Date(record.updated_at).toLocaleDateString()}
                </p>
                <p className="mt-3 line-clamp-2 text-sm text-muted">{stops.join(' → ')}</p>
                <div className="mt-auto flex flex-wrap gap-2 pt-5">
                  <Link href={`/journeys/${record.id}`} className="rounded-full bg-jungle px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-sand">
                    Open
                  </Link>
                  <a href={`/api/itinerary/pdf?id=${record.id}`} className="rounded-full border border-ocean/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-ocean hover:bg-ocean/5">
                    Download PDF
                  </a>
                  <Link href={`/journeys/${record.id}#email`} className="rounded-full border border-sand-dark/40 px-5 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted hover:bg-cloud">
                    Email
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
