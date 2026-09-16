import type { Metadata } from 'next'
import { COMPANY } from '@/lib/config'

export const metadata: Metadata = { title: 'Terms' }

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-36">
      <h1 className="display rule-terracotta text-5xl text-ink">Terms of Service</h1>
      <div className="mt-10 space-y-5 text-base leading-relaxed text-muted">
        <p>
          By using this website and the services of {COMPANY.name} ({COMPANY.legalName}), you
          agree to these terms. Itineraries generated on this platform are proposals prepared
          with local expertise; availability, pricing and conditions are confirmed by our
          consultants before any booking is made.
        </p>
        <p>
          You are responsible for the accuracy of the trip information you provide and for
          holding valid travel documents. Outdoor and wildlife activities involve inherent
          risks; you participate at your own discretion and follow the guidance of licensed
          operators.
        </p>
        <p>
          Generated itineraries and downloadable documents are for your personal trip planning
          and may not be redistributed commercially. For cancellations and changes, contact us
          at{' '}
          <a className="text-ocean hover:text-terracotta" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>.
        </p>
      </div>
    </div>
  )
}
