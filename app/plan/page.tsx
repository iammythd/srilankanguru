import type { Metadata } from 'next'
import PlannerWizard from '@/components/planner/PlannerWizard'

export const metadata: Metadata = {
  title: 'Plan My Trip',
  description: 'Eight steps to a personalized Sri Lanka itinerary built around your time, interests and pace.',
}

export default function PlanPage() {
  return (
    <div className="pt-32">
      <PlannerWizard />
    </div>
  )
}
