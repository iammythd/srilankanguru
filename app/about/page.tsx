import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description: 'Sri Lankan Guru is a Destination Management Company based in Colombo, Sri Lanka.',
}

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 pb-24 pt-36">
      <p className="kicker">About us</p>
      <h1 className="display rule-terracotta mt-3 text-5xl text-ink sm:text-6xl">
        Built by locals who know the island.
      </h1>

      <div className="mt-10 space-y-6 text-base leading-relaxed text-muted">
        <p>
          Sri Lankan Guru is a Destination Management Company based in Colombo, Sri Lanka. We
          are one of the best facilitators of customized Sri Lankan tours in the country and
          renowned for its professional service.
        </p>
        <p>
          There are various pre-planned tours which you can select depending on your vacation
          period and places of interest. You are always welcome to select your preferred
          destinations and time to spend — we are here to guide you with the best local
          expertise. We will do our best to make you happy while you stay in Sri Lanka.
        </p>
        <p>
          We offer tours across City tours, Multi-day, Beach trips, and Day attractions, and
          most of our famous multi-day tours include the experience of Sri Lanka&rsquo;s
          cultural diversity, heritage, nature, adventure, and wildlife. You can also renew
          your soul with Ayurveda while you are in Sri Lanka — it&rsquo;s a &ldquo;Paradise
          Island&rdquo; you will never want to miss its amazing beaches.
        </p>
      </div>

      <figure className="mt-12 flex items-center gap-5 rounded-xl border border-sand-dark/30 bg-white p-7 shadow-card">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-jungle display text-xl text-sand">
          JJ
        </div>
        <figcaption>
          <p className="display text-xl text-ink">Jayathu Jayawardana</p>
          <p className="mt-0.5 text-sm text-terracotta">Managing Director, Sri Lankan Guru</p>
        </figcaption>
      </figure>

      <Link
        href="/plan"
        className="mt-12 inline-block rounded-full bg-terracotta px-8 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-transform hover:scale-[1.02] active:scale-95"
      >
        Build My Journey
      </Link>
    </div>
  )
}
