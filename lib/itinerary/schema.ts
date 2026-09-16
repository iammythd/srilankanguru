import { z } from 'zod'
import {
  TRAVELLER_TYPES,
  PACES,
  BUDGET_LEVELS,
  PLANNER_INTERESTS,
  SPECIAL_REQUIREMENTS,
  type Itinerary,
} from '@/types'

export const planInputSchema = z.object({
  tripStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'tripStart must be YYYY-MM-DD'),
  tripEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'tripEnd must be YYYY-MM-DD'),
  travellerType: z.enum(TRAVELLER_TYPES),
  interests: z.array(z.enum(PLANNER_INTERESTS)).min(1, 'Pick at least one interest'),
  pace: z.enum(PACES),
  budget: z.enum(BUDGET_LEVELS),
  startLocation: z.string().min(1).max(80),
  specialRequirements: z.array(z.enum(SPECIAL_REQUIREMENTS)).default([]),
  notes: z.string().max(1000).optional(),
})

export type PlanInputParsed = z.infer<typeof planInputSchema>

const activitySchema = z.object({
  time: z.string().min(1).max(40),
  title: z.string().min(1).max(140),
  description: z.string().min(1).max(600),
  duration_minutes: z.number().int().min(15).max(720),
})

const daySchema = z.object({
  day: z.number().int().min(1),
  location: z.string().min(1).max(80),
  theme: z.string().min(1).max(80),
  activities: z.array(activitySchema).min(1).max(8),
})

export const itinerarySchema = z.object({
  trip_title: z.string().min(1).max(140),
  summary: z.string().min(1).max(1200),
  days: z.array(daySchema).min(1).max(30),
  estimated_budget: z.object({
    currency: z.string().length(3),
    low: z.number().min(0),
    high: z.number().min(0),
  }),
})

/**
 * Full stored shape: the core itinerary plus the planner metadata attached
 * before persistence. Defaults make external payloads (drafts, API calls)
 * safe to render without missing-field crashes.
 */
export const storedItinerarySchema = itinerarySchema.extend({
  start_date: z.string().default(''),
  end_date: z.string().default(''),
  traveller_type: z.string().default(''),
  pace: z.string().default(''),
  budget_level: z.string().default(''),
  special_requirements: z.array(z.string()).default([]),
  generated_by: z.enum(['claude', 'curated-planner']).default('curated-planner'),
})

/**
 * Normalises any parsed itinerary (AI or planner) into the full stored shape.
 */
export function toItinerary(
  parsed: z.infer<typeof itinerarySchema>,
  plan: PlanInputParsed,
  generatedBy: Itinerary['generated_by'],
): Itinerary {
  return {
    trip_title: parsed.trip_title,
    summary: parsed.summary,
    start_date: plan.tripStart,
    end_date: plan.tripEnd,
    traveller_type: plan.travellerType,
    pace: plan.pace,
    budget_level: plan.budget,
    special_requirements: plan.specialRequirements,
    days: parsed.days,
    estimated_budget: parsed.estimated_budget,
    generated_by: generatedBy,
  }
}
