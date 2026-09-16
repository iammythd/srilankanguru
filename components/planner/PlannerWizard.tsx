'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import {
  TRAVELLER_TYPES,
  PACES,
  BUDGET_LEVELS,
  PLANNER_INTERESTS,
  SPECIAL_REQUIREMENTS,
  type PlannerInterest,
  type SpecialRequirement,
} from '@/types'
import { saveCurrentDraft } from '@/lib/draftStore'

const STEP_TITLES = [
  'When are you travelling?',
  'Who is travelling?',
  'What moves you?',
  'How do you like to travel?',
  'What is your budget level?',
  'Where will you start?',
  'Anything special to consider?',
  'Ready for your journey',
]

const STEP_HINTS = [
  'Pick your dates — even approximate ones help us shape the route.',
  'This shapes room types, activity pacing and recommendations.',
  'Choose as many as you like — we will balance them across your days.',
  'Pace decides how many stops fit each day.',
  'Per-person comfort level for stays and experiences.',
  'Usually the airport (Colombo or Mattala) or your first hotel.',
  'We factor these into every day of the plan.',
  'Review your brief, then we will compose the itinerary.',
]

const OPTION_CLASS = (active: boolean) =>
  `rounded-xl border px-5 py-3 text-left text-sm font-medium transition-all ${
    active
      ? 'border-terracotta bg-terracotta/10 text-ink shadow-card'
      : 'border-sand-dark/40 bg-white text-muted hover:border-terracotta/50 hover:text-ink'
  }`

export default function PlannerWizard() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [tripStart, setTripStart] = useState('')
  const [tripEnd, setTripEnd] = useState('')
  const [travellerType, setTravellerType] = useState<string>('Couple')
  const [interests, setInterests] = useState<PlannerInterest[]>([])
  const [pace, setPace] = useState<string>('Balanced')
  const [budget, setBudget] = useState<string>('Mid-range')
  const [startLocation, setStartLocation] = useState('Bandaranaike International Airport (Colombo)')
  const [specialRequirements, setSpecialRequirements] = useState<SpecialRequirement[]>([])
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canAdvance = [
    Boolean(tripStart && tripEnd && tripStart <= tripEnd),
    true,
    interests.length > 0,
    true,
    true,
    startLocation.trim().length > 1,
    true,
    true,
  ][step]

  const toggleInterest = (i: PlannerInterest) =>
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]))
  const toggleSpecial = (s: SpecialRequirement) =>
    setSpecialRequirements((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))

  async function submit() {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/itinerary/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripStart,
          tripEnd,
          travellerType,
          interests,
          pace,
          budget,
          startLocation,
          specialRequirements,
          notes: notes.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Itinerary generation failed. Please try again.')
      if (data.persisted && data.id) {
        router.push(`/journeys/${data.id}`)
      } else {
        saveCurrentDraft(data.itinerary)
        router.push('/itinerary')
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 pb-28">
      {/* Progress */}
      <ol className="flex items-center gap-1.5" aria-label="Planning progress">
        {STEP_TITLES.map((_, i) => (
          <li key={i} className="flex-1" aria-current={i === step ? 'step' : undefined}>
            <div className={`h-1 rounded-full transition-colors ${i <= step ? 'bg-terracotta' : 'bg-sand-dark/40'}`} />
          </li>
        ))}
      </ol>
      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted">
        Step {step + 1} of {STEP_TITLES.length}
      </p>

      <h1 className="display mt-4 text-4xl text-ink sm:text-5xl">{STEP_TITLES[step]}</h1>
      <p className="mt-3 text-base text-muted">{STEP_HINTS[step]}</p>

      <div className="mt-10 min-h-[240px]">
        {step === 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="trip-start" className="mb-2 block text-sm font-semibold text-ink">Arrival</label>
              <input
                id="trip-start"
                type="date"
                value={tripStart}
                min={new Date().toISOString().slice(0, 10)}
                onChange={(e) => setTripStart(e.target.value)}
                className="w-full rounded-lg border border-sand-dark/40 bg-white px-4 py-3 text-sm"
              />
            </div>
            <div>
              <label htmlFor="trip-end" className="mb-2 block text-sm font-semibold text-ink">Departure</label>
              <input
                id="trip-end"
                type="date"
                value={tripEnd}
                min={tripStart || new Date().toISOString().slice(0, 10)}
                onChange={(e) => setTripEnd(e.target.value)}
                className="w-full rounded-lg border border-sand-dark/40 bg-white px-4 py-3 text-sm"
              />
            </div>
            {tripStart && tripEnd && tripStart > tripEnd && (
              <p className="text-sm text-terracotta sm:col-span-2">Departure must be on or after arrival.</p>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {TRAVELLER_TYPES.map((t) => (
              <button key={t} onClick={() => setTravellerType(t)} aria-pressed={travellerType === t} className={OPTION_CLASS(travellerType === t)}>
                {t}
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-wrap gap-3">
            {PLANNER_INTERESTS.map((i) => (
              <button key={i} onClick={() => toggleInterest(i)} aria-pressed={interests.includes(i)} className={OPTION_CLASS(interests.includes(i))}>
                {i}
              </button>
            ))}
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-3 sm:grid-cols-3">
            {PACES.map((p) => (
              <button key={p} onClick={() => setPace(p)} aria-pressed={pace === p} className={OPTION_CLASS(pace === p)}>
                {p}
              </button>
            ))}
          </div>
        )}

        {step === 4 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {BUDGET_LEVELS.map((b) => (
              <button key={b} onClick={() => setBudget(b)} aria-pressed={budget === b} className={OPTION_CLASS(budget === b)}>
                {b}
              </button>
            ))}
          </div>
        )}

        {step === 5 && (
          <div>
            <label htmlFor="start-location" className="mb-2 block text-sm font-semibold text-ink">Starting location</label>
            <input
              id="start-location"
              type="text"
              value={startLocation}
              onChange={(e) => setStartLocation(e.target.value)}
              placeholder="e.g. Colombo Airport, Negombo hotel…"
              className="w-full rounded-lg border border-sand-dark/40 bg-white px-4 py-3 text-sm"
            />
          </div>
        )}

        {step === 6 && (
          <div>
            <div className="flex flex-wrap gap-3">
              {SPECIAL_REQUIREMENTS.map((s) => (
                <button key={s} onClick={() => toggleSpecial(s)} aria-pressed={specialRequirements.includes(s)} className={OPTION_CLASS(specialRequirements.includes(s))}>
                  {s}
                </button>
              ))}
            </div>
            <label htmlFor="notes" className="mt-6 mb-2 block text-sm font-semibold text-ink">
              Anything else? <span className="font-normal text-muted">(optional)</span>
            </label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              maxLength={1000}
              placeholder="Ayurveda retreat, photography mornings, celebrating an anniversary…"
              className="w-full rounded-lg border border-sand-dark/40 bg-white px-4 py-3 text-sm"
            />
          </div>
        )}

        {step === 7 && (
          <div className="rounded-xl border border-sand-dark/30 bg-white p-7 shadow-card">
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="font-semibold text-ink">Dates</dt><dd className="text-muted">{tripStart} → {tripEnd}</dd></div>
              <div><dt className="font-semibold text-ink">Travellers</dt><dd className="text-muted">{travellerType}</dd></div>
              <div><dt className="font-semibold text-ink">Interests</dt><dd className="text-muted">{interests.join(', ')}</dd></div>
              <div><dt className="font-semibold text-ink">Pace · Budget</dt><dd className="text-muted">{pace} · {budget}</dd></div>
              <div className="sm:col-span-2"><dt className="font-semibold text-ink">Start</dt><dd className="text-muted">{startLocation}</dd></div>
              {specialRequirements.length > 0 && (
                <div className="sm:col-span-2"><dt className="font-semibold text-ink">Requirements</dt><dd className="text-muted">{specialRequirements.join(', ')}</dd></div>
              )}
              {notes.trim() && (
                <div className="sm:col-span-2"><dt className="font-semibold text-ink">Notes</dt><dd className="text-muted">{notes}</dd></div>
              )}
            </dl>
          </div>
        )}
      </div>

      {error && <p className="mt-6 rounded-lg bg-terracotta/10 px-4 py-3 text-sm text-terracotta">{error}</p>}

      <div className="mt-10 flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0 || submitting}
          className="text-sm font-semibold uppercase tracking-[0.14em] text-muted transition-colors hover:text-ink disabled:opacity-30"
        >
          ← Back
        </button>
        {step < STEP_TITLES.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canAdvance}
            className="rounded-full bg-jungle px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-sand transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-40"
          >
            Continue
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={submitting}
            className="rounded-full bg-terracotta px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-editorial transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-50"
          >
            {submitting ? 'Composing your journey…' : 'Create My Journey'}
          </button>
        )}
      </div>
    </div>
  )
}
