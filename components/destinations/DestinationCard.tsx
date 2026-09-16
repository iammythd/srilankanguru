import Link from 'next/link'
import type { Destination } from '@/types'

export default function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <article className="group relative overflow-hidden rounded-xl bg-white shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-editorial">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={destination.image}
          alt={destination.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-jungle/70 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-sand">
            {destination.region}
          </p>
          <h3 className="display mt-1 text-2xl text-white">{destination.name}</h3>
        </div>
      </div>
      <div className="p-5">
        <p className="text-sm leading-relaxed text-muted">{destination.summary}</p>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {destination.themes.slice(0, 3).map((theme) => (
            <span
              key={theme}
              className="rounded-full border border-sand-dark/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-ocean"
            >
              {theme}
            </span>
          ))}
        </div>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs text-muted">
            {destination.durationDays.min === destination.durationDays.max
              ? `${destination.durationDays.min} day${destination.durationDays.min > 1 ? 's' : ''} recommended`
              : `${destination.durationDays.min}–${destination.durationDays.max} days recommended`}
          </span>
          <Link
            href={`/destinations/${destination.slug}`}
            className="text-sm font-semibold text-terracotta transition-colors hover:text-ocean"
          >
            Explore →
          </Link>
        </div>
      </div>
    </article>
  )
}
