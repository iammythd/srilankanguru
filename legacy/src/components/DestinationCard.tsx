import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import type { Destination } from '@/data/destinations'

export default function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link
      to={`/destinations/${destination.slug}`}
      className="group overflow-hidden rounded-2xl border border-guru-sand bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-guru-sand">
        <img
          src={destination.image}
          alt={destination.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-guru-text shadow-sm">
          <MapPin className="h-3 w-3 text-guru-prompt" />
          {destination.region}
        </span>
      </div>
      <div className="p-5">
        <h3 className="font-display text-xl font-semibold text-guru-text">{destination.name}</h3>
        <p className="mt-1 text-sm font-medium text-guru-prompt">{destination.tagline}</p>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-guru-muted">
          {destination.shortHistory}
        </p>
        <span className="mt-4 inline-block text-sm font-semibold text-guru-teal transition-colors group-hover:text-guru-prompt">
          Explore this destination &rarr;
        </span>
      </div>
    </Link>
  )
}
