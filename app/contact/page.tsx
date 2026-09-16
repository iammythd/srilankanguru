import type { Metadata } from 'next'
import { COMPANY } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Reach Sri Lankan Guru in Malabe, Colombo — phones and email.',
}

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-36">
      <p className="kicker">Contact</p>
      <h1 className="display rule-terracotta mt-3 text-5xl text-ink sm:text-6xl">Talk to your Guru</h1>
      <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted">{COMPANY.description}</p>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-sand-dark/30 bg-white p-7 shadow-card">
          <p className="kicker">Visit</p>
          <address className="mt-4 space-y-1 text-base not-italic text-ink">
            <p className="font-semibold">{COMPANY.legalName}</p>
            {COMPANY.address.map((line) => (
              <p key={line} className="text-muted">{line}</p>
            ))}
          </address>
        </div>
        <div className="rounded-xl border border-sand-dark/30 bg-white p-7 shadow-card">
          <p className="kicker">Call or write</p>
          <div className="mt-4 space-y-2 text-base">
            {COMPANY.phones.map((phone) => (
              <p key={phone}>
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-ocean transition-colors hover:text-terracotta">
                  {phone}
                </a>
              </p>
            ))}
            <p>
              <a href={`mailto:${COMPANY.email}`} className="text-ocean transition-colors hover:text-terracotta">
                {COMPANY.email}
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
