import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { jsPDF } from 'jspdf'
import { ArrowRight, CalendarPlus, Download, Plus, Trash2 } from 'lucide-react'
import { destinations, getDestination } from '@/data/destinations'
import {
  loadItinerary,
  saveItinerary,
  clearItinerary,
  type ItineraryDay,
} from '@/lib/itineraryStore'

let dayCounter = 1

function makeDay(title?: string): ItineraryDay {
  return { id: crypto.randomUUID(), title: title ?? `Day ${dayCounter++}`, destinationIds: [] }
}

export default function ItineraryBuilder() {
  const [days, setDays] = useState<ItineraryDay[]>(() => loadItinerary())
  const [draftTitle, setDraftTitle] = useState('')

  const update = (next: ItineraryDay[]) => {
    setDays(next)
    saveItinerary(next)
  }

  const addDay = () => {
    const next = [...days, makeDay(draftTitle.trim() || undefined)]
    if (draftTitle.trim()) setDraftTitle('')
    update(next)
  }

  const addToDay = (dayId: string, destinationId: string) => {
    update(
      days.map((d) =>
        d.id === dayId && !d.destinationIds.includes(destinationId)
          ? { ...d, destinationIds: [...d.destinationIds, destinationId] }
          : d,
      ),
    )
  }

  const removeFromDay = (dayId: string, destinationId: string) => {
    update(days.map((d) => (d.id === dayId ? { ...d, destinationIds: d.destinationIds.filter((id) => id !== destinationId) } : d)))
  }

  const removeDay = (dayId: string) => {
    update(days.filter((d) => d.id !== dayId))
  }

  const renameDay = (dayId: string, title: string) => {
    update(days.map((d) => (d.id === dayId ? { ...d, title } : d)))
  }

  const usedIds = useMemo(() => new Set(days.flatMap((d) => d.destinationIds)), [days])
  const available = destinations.filter((d) => !usedIds.has(d.id))

  const exportPdf = () => {
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 56
    let y = margin

    // Header
    doc.setFillColor(14, 77, 74)
    doc.rect(0, 0, pageWidth, 120, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(26)
    doc.text('SrilankanGuru — Itinerary', margin, 60)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(12)
    doc.text(
      `Planned for ${days.reduce((n, d) => n + d.destinationIds.length, 0)} destination(s) across ${days.length} day(s)`,
      margin,
      88,
    )
    y = 150

    if (days.length === 0) {
      doc.setTextColor(90, 90, 90)
      doc.setFontSize(14)
      doc.text('No days added yet. Add days and destinations to build your plan.', margin, y)
    }

    for (const day of days) {
      if (y > pageHeight - 160) {
        doc.addPage()
        y = margin
      }
      doc.setTextColor(14, 77, 74)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.text(day.title, margin, y)
      y += 8
      doc.setDrawColor(181, 80, 46)
      doc.setLineWidth(2)
      doc.line(margin, y, margin + 160, y)
      y += 26

      if (day.destinationIds.length === 0) {
        doc.setTextColor(130, 130, 130)
        doc.setFont('helvetica', 'italic')
        doc.setFontSize(11)
        doc.text('No destinations on this day yet.', margin, y)
        y += 24
      }

      for (const id of day.destinationIds) {
        const dest = getDestination(id)
        if (!dest) continue
        const lines = doc.splitTextToSize(dest.shortHistory, pageWidth - margin * 2)
        const blockHeight = 20 + lines.length * 15
        if (y + blockHeight > pageHeight - margin) {
          doc.addPage()
          y = margin
        }
        doc.setTextColor(30, 30, 30)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(13)
        doc.text(`${dest.name} — ${dest.region}`, margin, y)
        y += 4
        doc.setTextColor(107, 114, 128)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(10.5)
        doc.text(lines, margin, y + 14)
        y += blockHeight
      }
      y += 18
    }

    doc.save('srilankanguru-itinerary.pdf')
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-guru-prompt">
        Day-by-day planning
      </p>
      <h1 className="mt-2 font-display text-5xl font-semibold tracking-tight text-guru-text">
        Itinerary Builder
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-guru-muted">
        Add destinations to each day of your plan, then export a clean PDF to take with you.
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        {/* Days column */}
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 rounded-full border border-guru-sand bg-white px-4 py-2 shadow-sm">
              <input
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addDay()}
                placeholder="Day title (optional)"
                className="w-44 bg-transparent text-sm text-guru-text outline-none"
              />
            </div>
            <button
              onClick={addDay}
              className="inline-flex items-center gap-2 rounded-full bg-guru-teal px-5 py-2.5 text-sm font-semibold text-white transition-all hover:bg-guru-dark active:scale-95"
            >
              <CalendarPlus className="h-4 w-4" /> Add Day
            </button>
          </div>

          {days.length === 0 ? (
            <div className="mt-8 rounded-3xl border-2 border-dashed border-guru-sand bg-guru-sand/20 p-12 text-center">
              <p className="font-display text-xl font-semibold text-guru-text">No days yet</p>
              <p className="mt-2 text-sm text-guru-muted">
                Start by adding a day, then pick destinations from the list on the right.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-6">
              {days.map((day, index) => (
                <div key={day.id} className="rounded-2xl border border-guru-sand bg-white p-6 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-guru-sand font-display text-sm font-semibold text-guru-teal">
                        {index + 1}
                      </span>
                      <input
                        value={day.title}
                        onChange={(e) => renameDay(day.id, e.target.value)}
                        className="font-display text-xl font-semibold text-guru-text outline-none focus:border-b focus:border-guru-prompt"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium uppercase tracking-wide text-guru-muted">
                        {day.destinationIds.length} place{day.destinationIds.length === 1 ? '' : 's'}
                      </span>
                      <button
                        onClick={() => removeDay(day.id)}
                        aria-label={`Remove ${day.title}`}
                        className="rounded-full p-2 text-guru-muted transition-colors hover:bg-guru-sand hover:text-guru-prompt"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  {day.destinationIds.length === 0 ? (
                    <p className="mt-4 text-sm text-guru-muted">Nothing on this day yet.</p>
                  ) : (
                    <ul className="mt-4 space-y-2">
                      {day.destinationIds.map((id) => {
                        const dest = getDestination(id)
                        if (!dest) return null
                        return (
                          <li
                            key={id}
                            className="flex items-center justify-between gap-3 rounded-xl bg-guru-sand/40 px-4 py-3"
                          >
                            <div className="min-w-0">
                              <Link
                                to={`/destinations/${dest.slug}`}
                                className="font-semibold text-guru-text transition-colors hover:text-guru-teal"
                              >
                                {dest.name}
                              </Link>
                              <p className="truncate text-xs text-guru-muted">{dest.tagline}</p>
                            </div>
                            <button
                              onClick={() => removeFromDay(day.id, id)}
                              aria-label={`Remove ${dest.name} from ${day.title}`}
                              className="rounded-full p-1.5 text-guru-muted transition-colors hover:bg-white hover:text-guru-prompt"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          {days.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={exportPdf}
                className="inline-flex items-center gap-2 rounded-full bg-guru-prompt px-7 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-[#9a4426] active:scale-95"
              >
                <Download className="h-4 w-4" /> Export PDF
              </button>
              <button
                onClick={() => {
                  clearItinerary()
                  setDays([])
                }}
                className="text-sm font-medium text-guru-muted transition-colors hover:text-guru-prompt"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Available destinations */}
        <aside>
          <div className="sticky top-24 rounded-2xl border border-guru-sand bg-guru-sand/30 p-6">
            <h2 className="font-display text-xl font-semibold text-guru-text">Available Destinations</h2>
            <p className="mt-1 text-sm text-guru-muted">Click a place to add it to a day.</p>

            {available.length === 0 ? (
              <p className="mt-6 text-sm text-guru-muted">
                All destinations are already in your plan. Add another day to keep going.
              </p>
            ) : (
              <ul className="mt-5 space-y-3">
                {available.map((dest) => (
                  <li key={dest.id} className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      loading="lazy"
                      className="h-12 w-12 shrink-0 rounded-lg object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-guru-text">{dest.name}</p>
                      <p className="truncate text-xs text-guru-muted">{dest.region}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {days.map((day) => (
                        <button
                          key={day.id}
                          onClick={() => addToDay(day.id, dest.id)}
                          title={`Add to ${day.title}`}
                          aria-label={`Add ${dest.name} to ${day.title}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-guru-sand text-guru-teal transition-colors hover:border-guru-teal hover:bg-guru-teal hover:text-white"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <Link
              to="/destinations"
              className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-guru-teal transition-colors hover:text-guru-prompt"
            >
              Explore all destinations <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </aside>
      </div>
    </div>
  )
}
