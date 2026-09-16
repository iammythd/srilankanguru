'use client'

import { useRef } from 'react'

export type FoodItem = {
  name: string
  description: string
  image: string
}

/**
 * Horizontal scroll-snap slider for the food editorial. Native scrolling on
 * touch; arrow buttons on desktop. No heavy animation.
 */
export default function FoodSlider({ items }: { items: FoodItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null)

  function scrollByCard(dir: 1 | -1) {
    const track = trackRef.current
    if (!track) return
    const card = track.querySelector<HTMLElement>('[data-food-card]')
    const step = card ? card.offsetWidth + 24 : 360
    track.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Famous Sri Lankan dishes"
      >
        {items.map((item) => (
          <article
            key={item.name}
            data-food-card
            className="group w-[78vw] flex-none snap-start sm:w-[46vw] lg:w-[31%]"
          >
            <div className="overflow-hidden rounded-xl shadow-card">
              <img
                src={item.image}
                alt={item.name}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
            </div>
            <h3 className="display mt-4 text-2xl text-ink">{item.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{item.description}</p>
          </article>
        ))}
      </div>

      <div className="mt-2 flex gap-3">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Previous dishes"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sand-dark/50 text-ink transition-colors hover:bg-cloud"
        >
          &larr;
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Next dishes"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sand-dark/50 text-ink transition-colors hover:bg-cloud"
        >
          &rarr;
        </button>
      </div>
    </div>
  )
}
