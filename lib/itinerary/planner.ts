import { destinations, getDestination } from '@/lib/destinations'
import { itinerarySchema, toItinerary, type PlanInputParsed } from '@/lib/itinerary/schema'
import type { Itinerary, ItineraryDay, ItineraryActivity } from '@/types'

/**
 * Rules-based itinerary composer.
 *
 * NOT a mock AI — this is a deterministic planner that builds itineraries
 * exclusively from the curated destination database. It is used when no
 * CLAUDE_API_KEY is configured, so the planning workflow is fully usable
 * without third-party credentials. Responses are clearly labelled
 * `generated_by: 'curated-planner'`.
 */

/** Geographic chain approximating a classic Sri Lanka route order. */
const ROUTE_ORDER: Record<string, number> = {
  negombo: 0,
  colombo: 1,
  anuradhapura: 2,
  polonnaruwa: 3,
  sigiriya: 4,
  kandy: 5,
  'nuwara-eliya': 6,
  ella: 7,
  udawalawe: 8,
  yala: 9,
  mirissa: 10,
  galle: 11,
  'arugam-bay': 12,
  trincomalee: 13,
  jaffna: 14,
}

const INTEREST_TO_THEME: Record<string, string> = {
  Culture: 'Culture & Heritage',
  Wildlife: 'Wildlife',
  Beaches: 'Beaches',
  Adventure: 'Adventure',
  Scenic: 'Scenic',
  Food: 'Food',
  Wellness: 'Wellness',
  Photography: 'Photography',
  Luxury: 'Luxury',
}

const BUDGET_RANGES: Record<string, { low: number; high: number }> = {
  Budget: { low: 45, high: 75 },
  'Mid-range': { low: 90, high: 160 },
  Premium: { low: 180, high: 320 },
  Luxury: { low: 380, high: 750 },
}

const PACE_MULTIPLIER: Record<string, number> = {
  Slow: 0.8,
  Balanced: 1.2,
  'Fast-paced': 1.8,
}

const TIME_SLOTS = ['Morning', 'Midday', 'Afternoon', 'Evening'] as const

function scoreDestination(interests: string[]) {
  return (slug: string) => {
    const dest = getDestination(slug)
    if (!dest) return 0
    let score = 0
    for (const interest of interests) {
      const theme = INTEREST_TO_THEME[interest]
      if (theme && dest.themes.includes(theme as (typeof dest.themes)[number])) score += 2
    }
    return score
  }
}

export function computeTripDays(tripStart: string, tripEnd: string): number {
  const start = new Date(tripStart + 'T00:00:00Z')
  const end = new Date(tripEnd + 'T00:00:00Z')
  const days = Math.round((end.getTime() - start.getTime()) / 86_400_000) + 1
  return Math.max(1, Math.min(21, days))
}

export function composeItinerary(plan: PlanInputParsed): Itinerary {
  const tripDays = computeTripDays(plan.tripStart, plan.tripEnd)

  // Select destinations: score by interest overlap, order by route geography.
  const scored = destinations
    .map((d) => ({ slug: d.slug, score: scoreDestination(plan.interests)(d.slug) }))
    .sort((a, b) => b.score - a.score || ROUTE_ORDER[a.slug] - ROUTE_ORDER[b.slug])

  // Drop zero-score destinations unless the trip is long enough to widen the net.
  const relevantPool =
    tripDays >= 10 ? scored.filter((s) => s.score > 0) : scored.filter((s) => s.score > 0).slice(0, Math.ceil(tripDays * 1.5))
  const pool = (relevantPool.length >= Math.ceil(tripDays * PACE_MULTIPLIER[plan.pace])
    ? relevantPool
    : scored
  )
    .slice()
    .sort((a, b) => ROUTE_ORDER[a.slug] - ROUTE_ORDER[b.slug])

  const perDay = Math.max(1, Math.min(3, Math.round(PACE_MULTIPLIER[plan.pace])))
  const stops: string[] = []
  let idx = 0
  while (stops.length < tripDays) {
    const slug = pool[idx % Math.max(1, pool.length)]?.slug ?? destinations[0].slug
    const dest = getDestination(slug)!
    // Longer stays for big-ticket destinations.
    const stay = Math.min(dest.durationDays.max, Math.max(dest.durationDays.min, perDay >= 2 ? 1 : 2))
    for (let s = 0; s < stay && stops.length < tripDays; s++) stops.push(slug)
    idx++
  }

  const days: ItineraryDay[] = stops.map((slug, i) => {
    const dest = getDestination(slug)!
    const dayNum = i + 1
    const arrival = i === 0 || stops[i - 1] !== slug
    const activities: ItineraryActivity[] = []

    if (arrival) {
      activities.push({
        time: 'Morning',
        title: `Travel to ${dest.name}`,
        description: `Transfer from ${i === 0 ? plan.startLocation : getDestination(stops[i - 1])!.name} to ${dest.name} with a scenic stop en route.`,
        duration_minutes: 180,
      })
    }

    const slots = TIME_SLOTS.slice(arrival ? 1 : 0)
    const picks = dest.activities.slice(0, Math.max(2, slots.length))
    picks.forEach((activity, j) => {
      activities.push({
        time: slots[j % slots.length] ?? 'Evening',
        title: activity,
        description: `Experience ${activity} in ${dest.name}, curated by Sri Lankan Guru for ${plan.travellerType.toLowerCase()} travellers${
          plan.specialRequirements.length ? ` with ${plan.specialRequirements.join(', ').toLowerCase()} in mind` : ''
        }.`,
        duration_minutes: 90 + (j % 2) * 60,
      })
    })

    return {
      day: dayNum,
      location: dest.name,
      theme: dest.themes.slice(0, 2).join(' & ') || 'Island Highlights',
      activities: activities.slice(0, 5),
    }
  })

  const range = BUDGET_RANGES[plan.budget]
  const topThemes = plan.interests.slice(0, 2).join(' and ').toLowerCase()
  const title = `${tripDays}-Day ${plan.interests[0] ?? 'Sri Lanka'} Journey${plan.interests[1] ? ` with ${plan.interests[1]}` : ''}`

  return toItinerary(
    itinerarySchema.parse({
      trip_title: title,
      summary: `A ${tripDays}-day ${plan.pace.toLowerCase()}-paced journey through Sri Lanka focused on ${topThemes}, travelling ${plan.travellerType.toLowerCase()} on a ${plan.budget.toLowerCase()} budget. Route: ${[...new Set(stops.map((s) => getDestination(s)!.name))].join(' → ')}.`,
      days,
      estimated_budget: {
        currency: 'USD',
        low: range.low * tripDays,
        high: range.high * tripDays,
      },
    }),
    plan,
    'curated-planner',
  )
}
