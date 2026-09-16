'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import ItineraryView from '@/components/itinerary/ItineraryView'
import { loadCurrentDraft, saveCurrentDraft, clearCurrentDraft } from '@/lib/draftStore'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Itinerary } from '@/types'

/**
 * Draft itinerary view (anonymous or pre-save). Persists to sessionStorage;
 * "Save to My Journeys" persists server-side when authenticated.
 */
export default function ItineraryDraftPage() {
  const router = useRouter()
  const [itinerary, setItinerary] = useState<Itinerary | null>(null)
  const [ready, setReady] = useState(false)
  const [savedNote, setSavedNote] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setItinerary(loadCurrentDraft())
    setReady(true)
  }, [])

  async function handleSave() {
    if (!itinerary) return
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      router.push('/auth?next=/itinerary')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/itineraries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itinerary, status: 'saved' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Could not save your journey.')
      clearCurrentDraft()
      router.push(`/journeys/${data.id}`)
    } catch (e) {
      setSavedNote(e instanceof Error ? e.message : 'Save failed — try signing in first.')
      setSaving(false)
    }
  }

  function downloadPdf() {
    if (!itinerary) return
    fetch('/api/itinerary/pdf', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itinerary }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error('PDF generation failed.')
        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'sri-lankan-guru-itinerary.pdf'
        a.click()
        URL.revokeObjectURL(url)
      })
      .catch((e) => setSavedNote(e instanceof Error ? e.message : 'PDF failed.'))
  }

  if (!ready) return null

  if (!itinerary) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-40 text-center">
        <h1 className="display text-4xl text-ink">No journey in progress</h1>
        <p className="mt-4 text-muted">Build one in a few minutes with our planner.</p>
        <Link href="/plan" className="mt-8 inline-block rounded-full bg-terracotta px-8 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white">
          Build My Journey
        </Link>
      </div>
    )
  }

  return (
    <ItineraryView
      itinerary={itinerary}
      onChange={(next) => {
        setItinerary(next)
        saveCurrentDraft(next)
      }}
      onSave={handleSave}
      onDownloadPdf={downloadPdf}
      savedNote={saving ? 'Saving…' : savedNote}
    />
  )
}
