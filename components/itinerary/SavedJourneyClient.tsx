'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import ItineraryView from '@/components/itinerary/ItineraryView'
import type { Itinerary } from '@/types'

/** Client shell for a saved journey: edits are kept locally until "Save changes". */
export default function SavedJourneyClient({
  id,
  initialItinerary,
}: {
  id: string
  initialItinerary: Itinerary
}) {
  const router = useRouter()
  const [itinerary, setItinerary] = useState(initialItinerary)
  const [savedNote, setSavedNote] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function save() {
    setSavedNote('Saving…')
    setError(null)
    try {
      const res = await fetch(`/api/itineraries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itinerary, status: 'saved' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Save failed.')
      setSavedNote(`Saved ${new Date().toLocaleTimeString()}`)
    } catch (e) {
      setSavedNote(null)
      setError(e instanceof Error ? e.message : 'Save failed.')
    }
  }

  async function email(email: string) {
    const res = await fetch('/api/itinerary/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, id }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error ?? 'Email failed.')
    setSavedNote(`Sent to ${email}`)
  }

  return (
    <ItineraryView
      itinerary={itinerary}
      onChange={setItinerary}
      onSave={save}
      onEmail={email}
      savedNote={savedNote}
    />
  )
}
