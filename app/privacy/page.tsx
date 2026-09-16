import type { Metadata } from 'next'
import { COMPANY } from '@/lib/config'

export const metadata: Metadata = { title: 'Privacy' }

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-36">
      <h1 className="display rule-terracotta text-5xl text-ink">Privacy Policy</h1>
      <div className="mt-10 space-y-5 text-base leading-relaxed text-muted">
        <p>
          {COMPANY.name} ({COMPANY.legalName}) respects your privacy. We collect only the
          information needed to plan and deliver your journey: your account details, trip
          preferences, and itineraries you create.
        </p>
        <p>
          <strong className="text-ink">Authentication data</strong> is handled by Supabase Auth.
          Passwords are never visible to us. <strong className="text-ink">Itineraries</strong> are
          stored in our PostgreSQL database protected by row-level security — only you can read
          or modify your saved journeys.
        </p>
        <p>
          <strong className="text-ink">Itinerary generation</strong> sends your stated trip
          preferences (dates, interests, pace, budget) to our server, which may use a
          third-party AI provider solely to compose your itinerary. We do not send your
          account credentials or contact details to the provider.
        </p>
        <p>
          We never sell your data. To request deletion of your account or data, email{' '}
          <a className="text-ocean hover:text-terracotta" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
        </p>
      </div>
    </div>
  )
}
