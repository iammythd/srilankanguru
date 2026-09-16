'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import type { Itinerary, ItineraryDay } from '@/types'

const RouteMap = dynamic(() => import('@/components/itinerary/RouteMap'), {
  ssr: false,
  loading: () => <div className="h-[380px] animate-pulse rounded-xl bg-sand/50" aria-label="Loading map" />,
})

interface Props {
  itinerary: Itinerary
  onChange?: (next: Itinerary) => void
  onSave?: () => Promise<void> | void
  onDownloadPdf?: () => void
  onEmail?: (email: string) => Promise<void> | void
  savedNote?: string | null
}

/**
 * Editorial itinerary timeline with full editing: edit a day, add/remove and
 * reorder activities, regenerate a day or the whole trip. All mutations flow
 * through onChange so the parent owns persistence (draft store or API).
 */
export default function ItineraryView({ itinerary, onChange, onSave, onDownloadPdf, onEmail, savedNote }: Props) {
  const [editing, setEditing] = useState(false)
  const [emailOpen, setEmailOpen] = useState(false)
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const stops = [...new Set(itinerary.days.map((d) => d.location))]
  const editable = Boolean(onChange)

  function mutate(mutator: (draft: Itinerary) => Itinerary) {
    if (onChange) onChange(mutator(structuredClone(itinerary)))
  }

  async function regenerateDay(dayIndex: number) {
    if (!itinerary.plan) return
    setBusy(`day-${dayIndex}`)
    setError(null)
    try {
      const res = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...itinerary.plan, regenerateDayIndex: dayIndex, baseItinerary: itinerary }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Could not regenerate that day.')
      mutate((draft) => {
        draft.days[dayIndex] = data.itinerary.days[0] ?? draft.days[dayIndex]
        return draft
      })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Regeneration failed.')
    } finally {
      setBusy(null)
    }
  }

  async function regenerateAll() {
    if (!itinerary.plan) return
    setBusy('all')
    setError(null)
    try {
      const res = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itinerary.plan),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Could not regenerate the itinerary.')
      onChange?.(data.itinerary)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Regeneration failed.')
    } finally {
      setBusy(null)
    }
  }

  async function submitEmail() {
    if (!onEmail || !email.trim()) return
    setBusy('email')
    setError(null)
    try {
      await onEmail(email.trim())
      setEmailOpen(false)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Email failed.')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-6 pb-28">
      {/* Header */}
      <header className="pt-32 pb-10">
        <p className="kicker">
          {itinerary.generated_by === 'claude' ? 'Composed by your Guru' : 'Composed from our curated routes'} · {itinerary.days.length} days
        </p>
        <h1 className="display mt-3 text-4xl text-ink sm:text-6xl">{itinerary.trip_title}</h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{itinerary.summary}</p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          <span><strong className="text-ink">{itinerary.start_date}</strong> → <strong className="text-ink">{itinerary.end_date}</strong></span>
          <span>· {itinerary.traveller_type}</span>
          <span>· {itinerary.pace} pace</span>
          <span>· {itinerary.budget_level}</span>
          <span>· Est. {itinerary.estimated_budget.currency} {itinerary.estimated_budget.low.toLocaleString()}–{itinerary.estimated_budget.high.toLocaleString()}</span>
        </div>

        {savedNote && <p className="mt-5 rounded-lg bg-tea/10 px-4 py-3 text-sm text-tea">{savedNote}</p>}
        {error && <p className="mt-5 rounded-lg bg-terracotta/10 px-4 py-3 text-sm text-terracotta">{error}</p>}

        {/* Actions */}
        <div className="mt-8 flex flex-wrap gap-3">
          {onDownloadPdf && (
            <button onClick={onDownloadPdf} disabled={busy !== null} className="rounded-full bg-ocean px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50">
              Download PDF
            </button>
          )}
          {onEmail && (
            <button onClick={() => setEmailOpen((v) => !v)} disabled={busy !== null} className="rounded-full border border-ocean/40 px-6 py-3 text-sm font-semibold text-ocean transition-colors hover:bg-ocean/5 disabled:opacity-50">
              Email My Itinerary
            </button>
          )}
          {editable && itinerary.plan && (
            <button onClick={regenerateAll} disabled={busy !== null} className="rounded-full border border-terracotta/40 px-6 py-3 text-sm font-semibold text-terracotta transition-colors hover:bg-terracotta/5 disabled:opacity-50">
              {busy === 'all' ? 'Recomposing…' : 'Regenerate trip'}
            </button>
          )}
          {onSave && (
            <button onClick={onSave} disabled={busy !== null} className="rounded-full bg-terracotta px-6 py-3 text-sm font-semibold text-white transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50">
              Save changes
            </button>
          )}
        </div>

        {emailOpen && onEmail && (
          <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-sand-dark/30 bg-white p-4 shadow-card">
            <label htmlFor="email-to" className="sr-only">Email address</label>
            <input
              id="email-to"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="min-w-56 flex-1 rounded-lg border border-sand-dark/40 px-4 py-2.5 text-sm"
            />
            <button onClick={submitEmail} disabled={busy !== null} className="rounded-full bg-ocean px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
              {busy === 'email' ? 'Sending…' : 'Send'}
            </button>
          </div>
        )}
      </header>

      {/* Route overview + map */}
      <section aria-label="Route overview" className="rounded-xl border border-sand-dark/30 bg-white p-6 shadow-card">
        <p className="kicker">Route overview</p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {stops.map((stop, i) => (
            <span key={stop} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden className="text-sand-dark">→</span>}
              <span className="rounded-full bg-cloud px-4 py-2 text-sm font-medium text-ink">{i + 1}. {stop}</span>
            </span>
          ))}
        </div>
        <div className="mt-6">
          <RouteMap stops={stops} />
        </div>
      </section>

      {/* Daily timeline */}
      <section aria-label="Daily itinerary" className="mt-10 space-y-8">
        {itinerary.days.map((day, dayIndex) => (
          <DayCard
            key={dayIndex}
            day={day}
            index={dayIndex}
            editing={editing}
            editable={editable}
            canRegenerate={Boolean(itinerary.plan)}
            regenerating={busy === `day-${dayIndex}`}
            onChange={(next) =>
              mutate((draft) => {
                draft.days[dayIndex] = next
                return draft
              })
            }
            onRegenerate={() => regenerateDay(dayIndex)}
          />
        ))}
      </section>

      {editable && (
        <div className="mt-10 flex items-center justify-between rounded-xl border border-sand-dark/30 bg-white p-5 shadow-card">
          <p className="text-sm text-muted">{editing ? 'Editing is on — change days and activities inline.' : 'Turn on editing to tailor every day.'}</p>
          <button
            onClick={() => setEditing((v) => !v)}
            aria-pressed={editing}
            className={`rounded-full px-6 py-2.5 text-sm font-semibold transition-colors ${editing ? 'bg-terracotta text-white' : 'border border-terracotta/40 text-terracotta hover:bg-terracotta/5'}`}
          >
            {editing ? 'Done editing' : 'Edit itinerary'}
          </button>
        </div>
      )}
    </div>
  )
}

function DayCard({
  day,
  index,
  editing,
  editable,
  canRegenerate,
  regenerating,
  onChange,
  onRegenerate,
}: {
  day: ItineraryDay
  index: number
  editing: boolean
  editable: boolean
  canRegenerate: boolean
  regenerating: boolean
  onChange: (next: ItineraryDay) => void
  onRegenerate: () => void
}) {
  const [adding, setAdding] = useState(false)
  const [newTime, setNewTime] = useState('Morning')
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')

  function moveActivity(i: number, dir: -1 | 1) {
    const j = i + dir
    if (j < 0 || j >= day.activities.length) return
    const acts = [...day.activities]
    ;[acts[i], acts[j]] = [acts[j], acts[i]]
    onChange({ ...day, activities: acts })
  }

  function removeActivity(i: number) {
    onChange({ ...day, activities: day.activities.filter((_, k) => k !== i) })
  }

  function addActivity() {
    if (!newTitle.trim()) return
    onChange({
      ...day,
      activities: [
        ...day.activities,
        { time: newTime, title: newTitle.trim(), description: newDesc.trim() || newTitle.trim(), duration_minutes: 90 },
      ],
    })
    setNewTitle('')
    setNewDesc('')
    setAdding(false)
  }

  return (
    <article className="overflow-hidden rounded-xl border border-sand-dark/30 bg-white shadow-card">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-sand-dark/20 bg-cloud/60 px-7 py-5">
        <div className="flex items-center gap-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-jungle display text-lg text-sand">{day.day}</span>
          {editing ? (
            <input
              aria-label={`Day ${day.day} location`}
              value={day.location}
              onChange={(e) => onChange({ ...day, location: e.target.value })}
              className="display border-b border-sand-dark/50 bg-transparent text-2xl text-ink outline-none"
            />
          ) : (
            <div>
              <h2 className="display text-2xl text-ink">{day.location}</h2>
              <p className="text-xs uppercase tracking-[0.14em] text-terracotta">{day.theme}</p>
            </div>
          )}
        </div>
        {editable && canRegenerate && (
          <button
            onClick={onRegenerate}
            disabled={regenerating}
            className="text-xs font-semibold uppercase tracking-[0.12em] text-ocean transition-colors hover:text-terracotta disabled:opacity-40"
          >
            {regenerating ? 'Recomposing…' : '↻ Regenerate day'}
          </button>
        )}
      </header>

      <ol className="divide-y divide-sand-dark/15">
        {day.activities.map((activity, i) => (
          <li key={`${i}-${activity.title}`} className="flex items-start gap-5 px-7 py-5">
            <span className="w-20 shrink-0 pt-0.5 text-xs font-semibold uppercase tracking-[0.1em] text-ocean">{activity.time}</span>
            <div className="min-w-0 flex-1">
              {editing ? (
                <>
                  <input
                    aria-label={`Activity ${i + 1} title`}
                    value={activity.title}
                    onChange={(e) => {
                      const acts = [...day.activities]
                      acts[i] = { ...acts[i], title: e.target.value }
                      onChange({ ...day, activities: acts })
                    }}
                    className="w-full border-b border-sand-dark/40 bg-transparent text-base font-semibold text-ink outline-none"
                  />
                  <textarea
                    aria-label={`Activity ${i + 1} description`}
                    value={activity.description}
                    rows={2}
                    onChange={(e) => {
                      const acts = [...day.activities]
                      acts[i] = { ...acts[i], description: e.target.value }
                      onChange({ ...day, activities: acts })
                    }}
                    className="mt-2 w-full rounded-lg border border-sand-dark/30 bg-cloud/50 p-2 text-sm text-muted outline-none"
                  />
                </>
              ) : (
                <>
                  <h3 className="text-base font-semibold text-ink">{activity.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{activity.description}</p>
                  <p className="mt-2 text-xs text-tea">≈ {activity.duration_minutes} min</p>
                </>
              )}
            </div>
            {editing && (
              <div className="flex shrink-0 items-center gap-1">
                <button onClick={() => moveActivity(i, -1)} disabled={i === 0} aria-label={`Move ${activity.title} up`} className="rounded p-1.5 text-muted hover:bg-cloud disabled:opacity-25">↑</button>
                <button onClick={() => moveActivity(i, 1)} disabled={i === day.activities.length - 1} aria-label={`Move ${activity.title} down`} className="rounded p-1.5 text-muted hover:bg-cloud disabled:opacity-25">↓</button>
                <button onClick={() => removeActivity(i)} aria-label={`Remove ${activity.title}`} className="rounded p-1.5 text-terracotta hover:bg-terracotta/10">✕</button>
              </div>
            )}
          </li>
        ))}
      </ol>

      {editing && (
        <div className="border-t border-sand-dark/20 px-7 py-4">
          {adding ? (
            <div className="grid gap-3 sm:grid-cols-[110px_1fr_1fr_auto]">
              <label className="sr-only" htmlFor={`time-${index}`}>Time</label>
              <select id={`time-${index}`} value={newTime} onChange={(e) => setNewTime(e.target.value)} className="rounded-lg border border-sand-dark/40 px-3 py-2 text-sm">
                {['Morning', 'Midday', 'Afternoon', 'Evening'].map((t) => <option key={t}>{t}</option>)}
              </select>
              <label className="sr-only" htmlFor={`title-${index}`}>Activity title</label>
              <input id={`title-${index}`} value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Activity title" className="rounded-lg border border-sand-dark/40 px-3 py-2 text-sm" />
              <label className="sr-only" htmlFor={`desc-${index}`}>Description</label>
              <input id={`desc-${index}`} value={newDesc} onChange={(e) => setNewDesc(e.target.value)} placeholder="Short description" className="rounded-lg border border-sand-dark/40 px-3 py-2 text-sm" />
              <div className="flex gap-2">
                <button onClick={addActivity} className="rounded-full bg-jungle px-4 py-2 text-xs font-semibold uppercase tracking-wide text-sand">Add</button>
                <button onClick={() => setAdding(false)} className="rounded-full border border-sand-dark/40 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted">Cancel</button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAdding(true)} className="text-sm font-semibold text-ocean transition-colors hover:text-terracotta">+ Add activity</button>
          )}
        </div>
      )}
    </article>
  )
}
