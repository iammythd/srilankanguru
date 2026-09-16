export interface ItineraryDay {
  id: string
  title: string
  destinationIds: string[]
}

const STORAGE_KEY = 'srilankanguru-itinerary'

export function loadItinerary(): ItineraryDay[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed as ItineraryDay[]
  } catch {
    return []
  }
}

export function saveItinerary(days: ItineraryDay[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(days))
}

export function clearItinerary() {
  localStorage.removeItem(STORAGE_KEY)
}

export function addDestinationToItinerary(destinationId: string) {
  const days = loadItinerary()
  if (days.length === 0) {
    saveItinerary([{ id: crypto.randomUUID(), title: 'Day 1', destinationIds: [destinationId] }])
    return
  }
  // Append to the last day if it doesn't already contain this destination.
  const last = days[days.length - 1]
  if (!last.destinationIds.includes(destinationId)) {
    last.destinationIds = [...last.destinationIds, destinationId]
    saveItinerary(days)
  }
}
