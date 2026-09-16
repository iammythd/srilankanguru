import { destinations } from '@/data/destinations'
import DestinationCard from '@/components/DestinationCard'

export default function Destinations() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-guru-prompt">
        Ten places to know
      </p>
      <h1 className="mt-2 font-display text-5xl font-semibold tracking-tight text-guru-text">
        Destinations
      </h1>
      <p className="mt-4 max-w-2xl text-lg leading-relaxed text-guru-muted">
        History, culture, wildlife, and coast — Sri Lanka packs a remarkable range of
        experiences into a small island. Explore each place below and open its full guide.
      </p>
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {destinations.map((d) => (
          <DestinationCard key={d.id} destination={d} />
        ))}
      </div>
    </div>
  )
}
