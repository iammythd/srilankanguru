import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { destinations, getDestination } from '@/lib/destinations'

export function generateStaticParams() {
  return destinations.map((d) => ({ slug: d.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const destination = getDestination(slug)
  if (!destination) return { title: 'Destination not found' }
  return { title: destination.name, description: destination.summary }
}

export default async function DestinationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const destination = getDestination(slug)
  if (!destination) notFound()

  const related = destinations
    .filter((d) => d.slug !== destination.slug && d.themes.some((t) => destination.themes.includes(t)))
    .slice(0, 3)

  return (
    <article>
      {/* Hero */}
      <header className="relative flex min-h-[62vh] items-end overflow-hidden bg-jungle">
        <img
          src={destination.image}
          alt={destination.name}
          className="absolute inset-0 h-full w-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-jungle via-jungle/30 to-transparent" />
        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-14">
          <Link href="/explore" className="text-sm font-medium text-sand/80 transition-colors hover:text-sand">
            ← All destinations
          </Link>
          <p className="kicker !text-sand mt-4">{destination.region}</p>
          <h1 className="display mt-2 text-6xl text-white sm:text-7xl">{destination.name}</h1>
          <p className="mt-3 max-w-xl text-base text-white/85">{destination.summary}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {destination.themes.map((t) => (
              <span key={t} className="rounded-full border border-white/30 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-white/90">
                {t}
              </span>
            ))}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr]">
          <div className="rule-terracotta">
            <h2 className="display text-3xl text-ink">About {destination.name}</h2>
            <p className="mt-6 text-base leading-relaxed text-muted">{destination.description}</p>

            <h3 className="display mt-10 text-2xl text-ink">Highlights</h3>
            <ul className="mt-4 space-y-2">
              {destination.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-base text-muted">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <aside className="h-fit rounded-xl border border-sand-dark/30 bg-white p-7 shadow-card">
            <p className="kicker">Plan with this stop</p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Recommended stay: {destination.durationDays.min === destination.durationDays.max
                ? `${destination.durationDays.min} day${destination.durationDays.min > 1 ? 's' : ''}`
                : `${destination.durationDays.min}–${destination.durationDays.max} days`}
            </p>
            <h3 className="display mt-5 text-xl text-ink">Things to do</h3>
            <ul className="mt-3 space-y-2">
              {destination.activities.map((a) => (
                <li key={a} className="text-sm text-muted">{a}</li>
              ))}
            </ul>
            <Link
              href="/plan"
              className="mt-7 block rounded-full bg-terracotta py-3.5 text-center text-sm font-semibold uppercase tracking-[0.14em] text-white transition-transform hover:scale-[1.02] active:scale-95"
            >
              Build My Journey
            </Link>
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="display text-3xl text-ink">You may also love</h2>
            <div className="mt-8 grid gap-8 sm:grid-cols-3">
              {related.map((d) => (
                <Link
                  key={d.slug}
                  href={`/destinations/${d.slug}`}
                  className="group overflow-hidden rounded-xl bg-white shadow-card transition-all hover:-translate-y-1 hover:shadow-editorial"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={d.image} alt={d.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta">{d.region}</p>
                    <h3 className="display mt-1 text-xl text-ink">{d.name}</h3>
                    <p className="mt-2 line-clamp-2 text-sm text-muted">{d.summary}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  )
}
