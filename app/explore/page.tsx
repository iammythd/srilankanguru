import type { Metadata } from 'next'
import { Suspense } from 'react'
import ExploreClient from '@/components/explore/ExploreClient'

export const metadata: Metadata = {
  title: 'Explore Destinations',
  description: 'Filter Sri Lanka by region, theme, activity, trip length and travel style.',
}

export default function ExplorePage() {
  return (
    <div className="pt-28">
      <Suspense fallback={<div className="mx-auto max-w-7xl px-6 py-24 text-muted">Loading destinations…</div>}>
        <ExploreClient />
      </Suspense>
    </div>
  )
}
