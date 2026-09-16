export const THEME_LABELS = [
  'Culture & Heritage',
  'Wildlife',
  'Beaches',
  'Scenic',
  'Adventure',
  'Food',
  'Wellness',
  'Photography',
  'Luxury',
  'Family',
] as const

export type Theme = (typeof THEME_LABELS)[number]

export const REGIONS = [
  'West Coast',
  'Cultural Triangle',
  'Hill Country',
  'South Coast',
  'East Coast',
  'North',
] as const

export type Region = (typeof REGIONS)[number]

export interface Destination {
  slug: string
  name: string
  region: Region
  /** [lat, lng] */
  coords: [number, number]
  summary: string
  description: string
  image: string
  /** recommended stay, in days */
  durationDays: { min: number; max: number }
  themes: Theme[]
  activities: string[]
  highlights: string[]
}

export const TRAVELLER_TYPES = ['Solo', 'Couple', 'Family', 'Friends', 'Group'] as const
export type TravellerType = (typeof TRAVELLER_TYPES)[number]

export const PACES = ['Slow', 'Balanced', 'Fast-paced'] as const
export type Pace = (typeof PACES)[number]

export const BUDGET_LEVELS = ['Budget', 'Mid-range', 'Premium', 'Luxury'] as const
export type BudgetLevel = (typeof BUDGET_LEVELS)[number]

export const PLANNER_INTERESTS = [
  'Culture',
  'Wildlife',
  'Beaches',
  'Adventure',
  'Scenic',
  'Food',
  'Wellness',
  'Photography',
  'Luxury',
] as const
export type PlannerInterest = (typeof PLANNER_INTERESTS)[number]

export const SPECIAL_REQUIREMENTS = [
  'Children',
  'Seniors',
  'Accessibility',
  'Vegetarian',
  'Honeymoon',
  'Surfing',
  'Diving',
  'Photography',
] as const
export type SpecialRequirement = (typeof SPECIAL_REQUIREMENTS)[number]

export interface PlanInput {
  tripStart: string
  tripEnd: string
  travellerType: TravellerType
  interests: PlannerInterest[]
  pace: Pace
  budget: BudgetLevel
  startLocation: string
  specialRequirements: SpecialRequirement[]
  notes?: string
}

export interface ItineraryActivity {
  time: string
  title: string
  description: string
  duration_minutes: number
}

export interface ItineraryDay {
  day: number
  location: string
  theme: string
  activities: ItineraryActivity[]
}

export interface Itinerary {
  trip_title: string
  summary: string
  start_date: string
  end_date: string
  traveller_type: string
  pace: string
  budget_level: string
  special_requirements: string[]
  days: ItineraryDay[]
  estimated_budget: {
    currency: string
    low: number
    high: number
  }
  generated_by: 'claude' | 'curated-planner'
  /** The planner input that produced this itinerary (kept for regeneration). */
  plan?: PlanInput
}

export type ItineraryStatus = 'draft' | 'saved' | 'completed'

export interface ItineraryRecord {
  id: string
  user_id: string | null
  status: ItineraryStatus
  itinerary: Itinerary
  created_at: string
  updated_at: string
}
