import Anthropic from '@anthropic-ai/sdk'
import { destinations } from '@/lib/destinations'
import { itinerarySchema, toItinerary, type PlanInputParsed } from '@/lib/itinerary/schema'
import { composeItinerary, computeTripDays } from '@/lib/itinerary/planner'
import type { Itinerary } from '@/types'
import { hasClaudeKey } from '@/lib/config'

/**
 * Claude-backed itinerary engine.
 *
 * The browser never talks to Anthropic directly — this module runs only on
 * the server inside route handlers. Claude receives the curated destination
 * database as its factual source and must not invent destinations. Output is
 * strictly validated with Zod; on any failure we fall back to the curated
 * planner so the user always receives a usable itinerary.
 */

function buildPrompt(plan: PlanInputParsed): { system: string; user: string } {
  const tripDays = computeTripDays(plan.tripStart, plan.tripEnd)
  const destinationFacts = destinations
    .map(
      (d) =>
        `- ${d.name} (${d.region}; stay ${d.durationDays.min}-${d.durationDays.max}d): ${d.summary} Themes: ${d.themes.join(', ')}. Activities: ${d.activities.join('; ')}.`,
    )
    .join('\n')

  const system = `You are the senior itinerary designer for Sri Lankan Guru, a Destination Management Company based in Colombo, Sri Lanka, specializing in customized Sri Lankan tours.

Rules:
1. Use ONLY the destination database provided in the user message. Never invent destinations, hotels, or facts not present in it.
2. When suggesting activities, classify each day's theme into one or more of these categories: Culture & Heritage, Wildlife, Beaches, Scenic, Adventure, Food, Wellness, Photography, Luxury, Family.
3. For multi-day itineraries, prioritise a mix reflecting Sri Lanka's cultural diversity, heritage, nature, adventure and wildlife.
4. If the traveller mentions relaxation or wellness, include at least one wellness or Ayurveda experience.
5. Respect the requested pace: Slow = at most 1 destination per day, Balanced = 1-2, Fast-paced = 2-3.
6. Order stops geographically to minimise backtracking, starting near ${plan.startLocation}.
7. Budget estimate: per-person total for ${plan.budget} level, in USD.
8. Respond with ONLY a JSON object matching this exact shape, no markdown fences:
{
  "trip_title": string,
  "summary": string,
  "days": [{ "day": number, "location": string, "theme": string, "activities": [{ "time": string, "title": string, "description": string, "duration_minutes": number }] }],
  "estimated_budget": { "currency": "USD", "low": number, "high": number }
}`

  const user = `Destination database (the ONLY allowed destinations):
${destinationFacts}

Build a ${tripDays}-day itinerary.
- Dates: ${plan.tripStart} to ${plan.tripEnd}
- Traveller type: ${plan.travellerType}
- Interests: ${plan.interests.join(', ')}
- Pace: ${plan.pace}
- Budget level: ${plan.budget}
- Starting location: ${plan.startLocation}
- Special requirements: ${plan.specialRequirements.length ? plan.specialRequirements.join(', ') : 'none'}
${plan.notes ? `- Additional notes from traveller: ${plan.notes}` : ''}`

  return { system, user }
}

export async function generateItinerary(plan: PlanInputParsed): Promise<Itinerary> {
  if (!hasClaudeKey()) {
    return composeItinerary(plan)
  }

  try {
    const anthropic = new Anthropic({ apiKey: process.env.CLAUDE_API_KEY })
    const { system, user } = buildPrompt(plan)
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      system,
      messages: [{ role: 'user', content: user }],
    })

    const text = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === 'text')
      .map((block) => block.text)
      .join('')

    const jsonText = text.replace(/^```(?:json)?\s*/m, '').replace(/\s*```$/m, '').trim()
    const parsed = itinerarySchema.parse(JSON.parse(jsonText))
    return toItinerary(parsed, plan, 'claude')
  } catch (error) {
    console.error('[ai] generation failed, falling back to curated planner:', error)
    return composeItinerary(plan)
  }
}
