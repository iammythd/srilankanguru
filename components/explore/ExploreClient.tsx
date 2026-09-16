'use client'

import { useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { destinations } from '@/lib/destinations'
import { THEME_LABELS, REGIONS, type Theme } from '@/types'
import DestinationCard from '@/components/destinations/DestinationCard'

const allActivities = [...new Set(destinations.flatMap((d) => d.activities))].sort()

const TRIP_LENGTHS = [
  { id: 'any', label: 'Any length', test: () => true },
  { id: '1-2', label: '1–2 days', test: (max: number) => max <= 2 },
  { id: '3', label: '3+ days', test: (max: number) => max >= 3 },
] as const

const TRAVEL_STYLES = ['Luxury', 'Family', 'Adventure', 'Wellness', 'Photography'] as const

export default function ExploreClient() {
  const params = useSearchParams()
  const initialTheme = params.get('theme')

  const [theme, setTheme] = useState<Theme | null>(
    initialTheme && (THEME_LABELS as readonly string[]).includes(initialTheme)
      ? (initialTheme as Theme)
      : null,
  )
  const [region, setRegion] = useState<string>('all')
  const [activity, setActivity] = useState<string>('all')
  const [length, setLength] = useState<string>('any')
  const [style, setStyle] = useState<string>('all')

  const filtered = useMemo(() => {
    const lengthTest = TRIP_LENGTHS.find((l) => l.id === length)?.test ?? (() => true)
    return destinations.filter((d) => {
      if (theme && !d.themes.includes(theme)) return false
      if (region !== 'all' && d.region !== region) return false
      if (activity !== 'all' && !d.activities.includes(activity)) return false
      if (!lengthTest(d.durationDays.max)) return false
      if (style !== 'all' && !d.themes.includes(style as Theme)) return false
      return true
    })
  }, [theme, region, activity, length, style])

  const selectClass =
    'rounded-lg border border-sand-dark/40 bg-white px-4 py-2.5 text-sm text-ink shadow-sm focus:border-terracotta'

  return (
    <div className="mx-auto max-w-7xl px-6 pb-24">
      <p className="kicker">Explore the island</p>
      <h1 className="display mt-3 text-5xl text-ink sm:text-6xl">Destinations</h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
        Fifteen hand-curated regions, each with its own rhythm — filter by what moves you.
      </p>

      {/* Filter bar */}
      <div className="sticky top-20 z-30 mt-10 rounded-xl border border-sand-dark/30 bg-cloud/95 p-4 shadow-card backdrop-blur">
        <div className="flex flex-wrap items-center gap-3">
          <label className="sr-only" htmlFor="filter-region">Region</label>
          <select id="filter-region" className={selectClass} value={region} onChange={(e) => setRegion(e.target.value)}>
            <option value="all">All regions</option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          <label className="sr-only" htmlFor="filter-activity">Activity</label>
          <select id="filter-activity" className={selectClass} value={activity} onChange={(e) => setActivity(e.target.value)}>
            <option value="all">All activities</option>
            {allActivities.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>

          <label className="sr-only" htmlFor="filter-length">Trip length</label>
          <select id="filter-length" className={selectClass} value={length} onChange={(e) => setLength(e.target.value)}>
            {TRIP_LENGTHS.map((l) => (
              <option key={l.id} value={l.id}>{l.label}</option>
            ))}
          </select>

          <label className="sr-only" htmlFor="filter-style">Travel style</label>
          <select id="filter-style" className={selectClass} value={style} onChange={(e) => setStyle(e.target.value)}>
            <option value="all">All styles</option>
            {TRAVEL_STYLES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <span className="ml-auto text-sm text-muted">
            {filtered.length} destination{filtered.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Filter by theme">
          <button
            onClick={() => setTheme(null)}
            aria-pressed={theme === null}
            className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] transition-colors ${
              theme === null ? 'border-jungle bg-jungle text-sand' : 'border-sand-dark/40 bg-white text-ink hover:bg-sand/50'
            }`}
          >
            All themes
          </button>
          {THEME_LABELS.map((t) => (
            <button
              key={t}
              onClick={() => setTheme(theme === t ? null : t)}
              aria-pressed={theme === t}
              className={`rounded-full border px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] transition-colors ${
                theme === t ? 'border-jungle bg-jungle text-sand' : 'border-sand-dark/40 bg-white text-ink hover:bg-sand/50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <p className="mt-16 text-center text-muted">No destinations match those filters — try widening your search.</p>
      ) : (
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d) => (
            <DestinationCard key={d.slug} destination={d} />
          ))}
        </div>
      )}
    </div>
  )
}
