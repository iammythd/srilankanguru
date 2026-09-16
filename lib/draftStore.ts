'use client'

import type { Itinerary } from '@/types'

/**
 * Client-side draft storage for the planning workflow.
 *
 * Anonymous users can build and refine itineraries in the browser; once
 * Supabase Auth is configured, drafts are persisted server-side under RLS
 * via the itineraries API. This is draft state only — never presented as
 * a saved, server-backed journey.
 */

const CURRENT_KEY = 'slg.currentItinerary'

export function saveCurrentDraft(itinerary: Itinerary) {
  try {
    sessionStorage.setItem(CURRENT_KEY, JSON.stringify(itinerary))
  } catch {
    // storage unavailable — keep in-memory only
  }
}

export function loadCurrentDraft(): Itinerary | null {
  try {
    const raw = sessionStorage.getItem(CURRENT_KEY)
    return raw ? (JSON.parse(raw) as Itinerary) : null
  } catch {
    return null
  }
}

export function clearCurrentDraft() {
  try {
    sessionStorage.removeItem(CURRENT_KEY)
  } catch {
    // noop
  }
}

export function updateDraft(mutator: (it: Itinerary) => Itinerary): Itinerary | null {
  const current = loadCurrentDraft()
  if (!current) return null
  const next = mutator(current)
  saveCurrentDraft(next)
  return next
}
