import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, BedDouble, CalendarDays, MapPin, Star } from 'lucide-react'
import { getDestination } from '@/data/destinations'

export default function DestinationDetail() {
  const { slug } = useParams()
  const destination = getDestination(slug)

  if (!destination) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-semibold text-guru-text">Destination not found</h1>
        <p className="mt-3 text-guru-muted">We couldn&rsquo;t find that place. Try another one.</p>
        <Link
          to="/destinations"
          className="mt-8 inline-block rounded-full bg-guru-teal px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-guru-dark"
        >
          Back to Destinations
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Hero image */}
      <section className="relative h-[46vh] min-h-[320px] overflow-hidden bg-guru-dark">
        <img
          src={destination.image}
          alt={destination.name}
          className="h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-6xl px-6 pb-10">
            <Link
              to="/destinations"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-white/85 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> All destinations
            </Link>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                <MapPin className="h-3.5 w-3.5" /> {destination.region}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                <CalendarDays className="h-3.5 w-3.5" /> Best: {destination.bestTime}
              </span>
            </div>
            <h1 className="mt-3 font-display text-5xl font-semibold tracking-tight text-white sm:text-6xl">
              {destination.name}
            </h1>
            <p className="mt-2 font-display text-xl text-guru-sand">{destination.tagline}</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-14">
        {/* History + culture */}
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-semibold text-guru-text">Full History</h2>
            <p className="mt-4 leading-relaxed text-guru-muted">{destination.fullHistory}</p>
          </div>
          <div>
            <h2 className="font-display text-3xl font-semibold text-guru-text">Culture</h2>
            <p className="mt-4 leading-relaxed text-guru-muted">{destination.cultureDetail}</p>
          </div>
        </div>

        {/* Hotels */}
        <section className="mt-16">
          <h2 className="flex items-center gap-2 font-display text-3xl font-semibold text-guru-text">
            <BedDouble className="h-7 w-7 text-guru-prompt" /> Nearby Hotels
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {destination.hotels.map((hotel) => (
              <div key={hotel.name} className="rounded-2xl border border-guru-sand bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-display text-lg font-semibold text-guru-text">{hotel.name}</h3>
                  <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-guru-sand px-2.5 py-1 text-xs font-semibold text-guru-teal">
                    <Star className="h-3 w-3 fill-guru-teal" /> {hotel.rating.toFixed(1)}
                  </span>
                </div>
                <p className="mt-1 text-xs font-medium uppercase tracking-wide text-guru-prompt">
                  {hotel.price} &middot; {hotel.distance}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-guru-muted">{hotel.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Activities */}
        <section className="mt-16">
          <h2 className="font-display text-3xl font-semibold text-guru-text">Nearby Activities</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destination.activities.map((activity) => (
              <div
                key={activity.name}
                className="flex flex-col rounded-2xl border border-guru-sand bg-guru-sand/30 p-6"
              >
                <span className="self-start rounded-full bg-guru-teal/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-guru-teal">
                  {activity.category}
                </span>
                <h3 className="mt-4 font-display text-lg font-semibold text-guru-text">
                  {activity.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-guru-muted">{activity.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mt-20 rounded-3xl bg-guru-dark px-8 py-12 text-center">
          <h2 className="font-display text-3xl font-semibold text-white">
            Ready to visit {destination.name}?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-guru-sand/85">
            Add this destination to your day-by-day plan and export a polished PDF itinerary.
          </p>
          <Link
            to="/itinerary"
            className="mt-8 inline-block rounded-full bg-guru-prompt px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-[#9a4426] active:scale-95"
          >
            Add to My Itinerary
          </Link>
        </section>
      </div>
    </div>
  )
}
