import { MapPin } from 'lucide-react'

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-guru-prompt">
        About SrilankanGuru
      </p>
      <h1 className="mt-2 font-display text-5xl font-semibold tracking-tight text-guru-text">
        Built by locals who know the island.
      </h1>

      <div className="mt-8 space-y-6 text-lg leading-relaxed text-guru-muted">
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

      <div className="mt-12 flex items-center gap-4 rounded-2xl border border-guru-sand bg-guru-sand/30 p-6">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-guru-teal font-display text-xl font-semibold text-white">
          JJ
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-guru-text">
            Jayathu Jayawardana
          </p>
          <p className="text-sm text-guru-prompt">Managing Director</p>
        </div>
      </div>

      <div className="mt-12 flex items-center gap-2 text-sm text-guru-muted">
        <MapPin className="h-4 w-4 text-guru-prompt" />
        Based in Colombo, Sri Lanka
      </div>
    </div>
  )
}
