import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Compass, Map, Ticket } from 'lucide-react'
import { destinations, TOUR_CATEGORIES } from '@/data/destinations'
import DestinationCard from '@/components/DestinationCard'

const features = [
  {
    icon: Compass,
    title: 'Curated Destinations',
    text: 'Ten of Sri Lanka\u2019s most remarkable places, each with deep history and culture.',
  },
  {
    icon: Map,
    title: 'In-Depth Guides',
    text: 'Full stories, nearby hotels, and activities for every destination you love.',
  },
  {
    icon: Ticket,
    title: 'Plan Your Trip',
    text: 'Build a day-by-day itinerary and export it to PDF in seconds.',
  },
]

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const shown = useMemo(() => {
    if (!activeCategory) return destinations.slice(0, 3)
    return destinations.filter((d) => d.categories.includes(activeCategory))
  }, [activeCategory])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-guru-dark">
        <div
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'radial-gradient(60% 50% at 50% 0%, rgba(14,77,74,0.55) 0%, rgba(10,10,10,0) 70%)',
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 py-24 text-center sm:py-32">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-guru-sand/80">
            Island of Ancient Wonders
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl font-display text-5xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
            Where in Sri Lanka will you go?
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-guru-sand/85">
            From the Lion Rock of Sigiriya to the tea hills of Nuwara Eliya — explore
            destinations shaped by 2,500 years of history, then build an itinerary that
            fits your perfect trip.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/destinations"
              className="rounded-full bg-guru-prompt px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-[#9a4426] active:scale-95"
            >
              Explore Destinations
            </Link>
            <Link
              to="/itinerary"
              className="rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-all hover:bg-white/10 active:scale-95"
            >
              Build My Itinerary
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-8 sm:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-guru-sand bg-guru-sand/30 p-8">
              <f.icon className="h-8 w-8 text-guru-prompt" />
              <h3 className="mt-4 font-display text-xl font-semibold text-guru-text">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-guru-muted">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured destinations */}
      <section className="bg-guru-sand/40 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-guru-prompt">
                Hand-picked for you
              </p>
              <h2 className="mt-2 font-display text-4xl font-semibold tracking-tight text-guru-text">
                Featured Destinations
              </h2>
            </div>
            <Link
              to="/destinations"
              className="text-sm font-semibold text-guru-teal transition-colors hover:text-guru-prompt"
            >
              View all 10 destinations &rarr;
            </Link>
          </div>

          {/* Category filter bar */}
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveCategory(null)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === null
                  ? 'border-guru-teal bg-guru-teal text-white'
                  : 'border-guru-sand bg-white text-guru-text hover:bg-guru-sand'
              }`}
            >
              Featured
            </button>
            {TOUR_CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setActiveCategory(cat.slug)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  activeCategory === cat.slug
                    ? 'border-guru-teal bg-guru-teal text-white'
                    : 'border-guru-sand bg-white text-guru-text hover:bg-guru-sand'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {shown.length === 0 ? (
            <p className="mt-10 text-sm text-guru-muted">
              No destinations in this category yet — check back soon.
            </p>
          ) : (
            <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((d) => (
                <DestinationCard key={d.id} destination={d} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
