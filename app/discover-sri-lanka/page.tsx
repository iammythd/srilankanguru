import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import Link from 'next/link'
import Reveal from '@/components/discover/Reveal'
import FoodSlider from '@/components/discover/FoodSlider'

const HERO_IMG = 'https://commons.wikimedia.org/wiki/Special:FilePath/Nine%20Arches%20Bridge%20in%20Ella.jpg?width=1800'

function img(file: string, width = 1200) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`
}

export const metadata: Metadata = {
  title: 'Discover Sri Lanka | History, Food, Culture and Travel Guide',
  description:
    "Explore Sri Lanka's history, famous food, culture, landscapes, seasons and practical travel information with Sri Lankan Guru.",
  openGraph: {
    title: 'Discover Sri Lanka | History, Food, Culture and Travel Guide',
    description:
      "Explore Sri Lanka's history, famous food, culture, landscapes, seasons and practical travel information with Sri Lankan Guru.",
    type: 'website',
    images: [{ url: HERO_IMG, width: 1800, height: 1200, alt: 'The Nine Arches Bridge in the tea hills of Ella' }],
  },
}

/* ------------------------------ data ------------------------------ */

const FACTS: { label: string; value: string }[] = [
  { label: 'Official name', value: 'Democratic Socialist Republic of Sri Lanka' },
  { label: 'Location', value: 'Indian Ocean, off the southeastern tip of India' },
  { label: 'Commercial capital', value: 'Colombo' },
  { label: 'Administrative capital', value: 'Sri Jayawardenepura Kotte' },
  { label: 'Currency', value: 'Sri Lankan Rupee (LKR)' },
  { label: 'Languages', value: 'Sinhala and Tamil, with English widely used' },
  { label: 'Time zone', value: 'GMT+5:30 — no daylight saving' },
  { label: 'Independence', value: '4 February 1948' },
  { label: 'Climate', value: 'Tropical; two monsoons shape the seasons' },
  { label: 'Famous for', value: 'Ancient cities, tea, wildlife, beaches and hospitality' },
]

const TIMELINE: { period: string; title: string; text: string; image?: string; alt?: string }[] = [
  {
    period: 'c. 6th–4th century BC',
    title: 'Ancient beginnings',
    text: 'Early settlements flourish along rivers and coasts. At Mihintale, Buddhism is said to have arrived on the island — a moment still honoured by pilgrims today.',
    image: img('Mihintale Sri Lanka.jpg', 900),
    alt: 'The hilltop shrines of Mihintale',
  },
  {
    period: '377 BC – 1017 AD',
    title: 'Anuradhapura Kingdom',
    text: 'For over a millennium Anuradhapura is a capital of vast dagobas, monasteries and reservoirs. Its sacred bo tree draws pilgrims more than two thousand years on.',
    image: img('Ruwanwelisaya Stupa Anuradhapura.jpg', 900),
    alt: 'The white Ruwanwelisaya stupa at Anuradhapura',
  },
  {
    period: '1017 – 1236',
    title: 'Polonnaruwa Kingdom',
    text: 'The capital moves south, leaving behind the serene Buddha faces of Gal Viharaya and the great tank of Parakrama Samudra, still feeding farmland today.',
    image: img('Gal Viharaya, Ancient City of Polonnaruwa, Sri Lanka.jpg', 900),
    alt: 'Seated Buddha carved in granite at Gal Viharaya, Polonnaruwa',
  },
  {
    period: 'c. 477 – 495',
    title: 'Sigiriya',
    text: 'King Kashyapa raises his palace atop a 200-metre rock. The frescoes, mirror wall and lion staircase remain one of Asia’s most remarkable sights.',
    image: img('Sigiriya.jpg', 900),
    alt: 'The Sigiriya rock fortress rising above the water gardens',
  },
  {
    period: '1469 – 1815',
    title: 'Kingdom of Kandy',
    text: 'The last kingdom holds the hill country and the Sacred Tooth Relic. Kandyan art, dance and architecture shape the island’s identity to this day.',
    image: img('Sri Dalada Maligawa.jpg', 900),
    alt: 'The Sri Dalada Maligawa, Temple of the Sacred Tooth Relic, in Kandy',
  },
  {
    period: '1505 – 1948',
    title: 'Portuguese, Dutch and British',
    text: 'Three colonial powers leave forts, churches, railways and the tea industry. Walk the ramparts of Galle Fort or ride the highland line to taste that legacy.',
    image: img('Galle lighthouse A.jpg', 900),
    alt: 'The lighthouse inside Galle Fort',
  },
  {
    period: '4 February 1948',
    title: 'Independence',
    text: 'Sri Lanka steps into independence as a dominion, later becoming a republic. The island begins writing its own modern chapter.',
  },
  {
    period: 'Today',
    title: 'Modern Sri Lanka',
    text: 'A young nation of eight UNESCO World Heritage sites, thriving wildlife parks, surf breaks and a celebrated food scene — ready to be explored at your own pace.',
    image: img('Colombo, Sri Lanka.jpg', 900),
    alt: 'The Colombo skyline at dusk',
  },
]

const FOODS = [
  {
    name: 'Rice and Curry',
    description: 'The island’s daily ritual: a mound of rice ringed by small, vivid curries that change with region and season.',
    image: img('Sri Lankan Rice and Curry.jpg', 800),
  },
  {
    name: 'Hoppers',
    description: 'Crisp-edged rice-flour pancakes, best with an egg folded into the centre and a spoon of pol sambol.',
    image: img('Appam.jpg', 800),
  },
  {
    name: 'String Hoppers',
    description: 'Lace-fine rice noodles pressed into rounds, served with dhal and coconut milk curries for breakfast or dinner.',
    image: img('String hoppers with curries and sambol, Sri Lanka. (8316102519).jpg', 800),
  },
  {
    name: 'Kottu Roti',
    description: 'Chopped godhamba roti tossed on a hot griddle with vegetables, egg or meat — the island’s beloved street-food soundtrack.',
    image: img('Kottu.jpg', 800),
  },
  {
    name: 'Pol Sambol',
    description: 'Fresh coconut relish with chilli, lime and red onion. No Sri Lankan plate is complete without it.',
    image: img('Pol Sambol.jpg', 800),
  },
  {
    name: 'Dhal Curry',
    description: 'Slow-simmered red lentils mellowed with coconut milk, turmeric and tempered spices — comfort in a bowl.',
    image: img('Dhal-Sri Lanka (2).jpg', 800),
  },
  {
    name: 'Lamprais',
    description: 'A Dutch-Burgher legacy: rice and curries baked in banana leaf, every opening a small ceremony.',
    image: img('Lamprais (Sri Lankan cuisine).jpg', 800),
  },
  {
    name: 'Watalappam',
    description: 'Jaggery and coconut-milk custard scented with cardamom — a festive dessert shared across communities.',
    image: img('Watalappan-Sri Lanka.jpg', 800),
  },
  {
    name: 'Ceylon Tea',
    description: 'From highland estates to the cup: brisk, bright and endlessly varied by elevation. Take the factory tour, then drink it where it grows.',
    image: img('Ceylon Tea.jpg', 800),
  },
]

const SEASONS: { region: string; months: number[]; period: string; note: string }[] = [
  { region: 'South & West Coast', months: [12, 1, 2, 3], period: 'December – March', note: 'Sunniest days for Galle, Mirissa and the southern beaches.' },
  { region: 'Central Highlands', months: [1, 2, 3, 4], period: 'January – April', note: 'Clear mornings in Ella and Nuwara Eliya; expect variation year-round.' },
  { region: 'East Coast', months: [5, 6, 7, 8, 9], period: 'May – September', note: 'The dry season for Trincomalee and Arugam Bay’s surf.' },
  { region: 'Cultural Triangle', months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], period: 'Year-round', note: 'Visitable in any season; drier spells are more comfortable for exploring.' },
  { region: 'North', months: [2, 3, 4, 5, 6, 7, 8, 9], period: 'Drier periods', note: 'Jaffna is most comfortable outside the northeast rains; conditions vary.' },
  { region: 'Wildlife', months: [], period: 'Varies by park', note: 'Yala and Udawalawe differ through the year — timing follows the animals.' },
]
const MONTH_LETTERS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D']

const CULTURE_IMAGES = [
  { src: img('Esala Perahera.jpg', 800), alt: 'A procession of the Kandy Esala Perahera at night' },
  { src: img('Kandyan dancers.jpg', 800), alt: 'Traditional Kandyan dancers in ornate costume' },
  { src: img('Nallur Kandaswamy temple.jpg', 800), alt: 'The Nallur Kandaswamy temple in Jaffna' },
  { src: img('Dambulla cave temple.jpg', 800), alt: 'Buddha statues inside the Dambulla cave temple' },
]

const EXPERIENCES = [
  {
    title: 'Ancient Heritage',
    text: 'Cycle between stupas and stone Buddhas in the Cultural Triangle, where three ancient capitals sit within a day’s drive.',
    image: img('Ruwanwelisaya Stupa Anuradhapura.jpg', 800),
    alt: 'The Ruwanwelisaya stupa at Anuradhapura',
    href: '/destinations/anuradhapura',
    link: 'Explore Anuradhapura',
  },
  {
    title: 'Tea Country',
    text: 'Ride the hill-country railway past emerald estates, waterfalls and mist — then drink high-grown Ceylon where it is picked.',
    image: img('Tea plantations near Nuwara Eliya, Sri Lanka - panoramio.jpg', 800),
    alt: 'Tea fields rolling across the hills near Nuwara Eliya',
    href: '/destinations/nuwara-eliya',
    link: 'Explore Nuwara Eliya',
  },
  {
    title: 'Wildlife',
    text: 'Leopards in Yala, elephant gathering points near Udawalawe and birdlife everywhere — safaris here feel wonderfully raw.',
    image: img('Sri Lankan Leopard - Yala National Park.jpg', 800),
    alt: 'A Sri Lankan leopard resting in Yala National Park',
    href: '/destinations/yala',
    link: 'Explore Yala',
  },
  {
    title: 'Tropical Beaches',
    text: 'Whale-watching bays, palm-fringed coves and surf points — the coastline changes character with every monsoon.',
    image: img('Mirissa beach, Srilanka.jpg', 800),
    alt: 'The curved bay of Mirissa beach',
    href: '/destinations/mirissa',
    link: 'Explore Mirissa',
  },
  {
    title: 'Food and Local Life',
    text: 'Markets, griddles and spice gardens — the island’s story is told best at the table, from Colombo eateries to village kitchens.',
    image: img('Kottu.jpg', 800),
    alt: 'A pan of kottu roti being prepared',
    href: '/destinations/colombo',
    link: 'Explore Colombo',
  },
  {
    title: 'Adventure and Wellness',
    text: 'Surf Arugam Bay’s point break, hike to Ella’s viewpoints, then slow down with Ayurveda — the island balances thrill and calm.',
    image: img('Arugam Bay.jpg', 800),
    alt: 'The surf point at Arugam Bay',
    href: '/destinations/arugam-bay',
    link: 'Explore Arugam Bay',
  },
]

const PRACTICAL: { label: string; text: ReactNode }[] = [
  {
    label: 'Visa & entry',
    text: (
      <>
        Most travellers need an Electronic Travel Authorization (ETA) before arrival. Requirements change — verify the
        latest rules on the{' '}
        <a href="https://www.srilankaevisa.com/" target="_blank" rel="noopener noreferrer" className="text-ocean underline decoration-ocean/30 underline-offset-2 hover:decoration-terracotta">
          official ETA portal
        </a>{' '}
        or with your nearest Sri Lankan consulate before booking.
      </>
    ),
  },
  { label: 'Currency', text: 'The Sri Lankan Rupee (LKR). Cards are widely accepted in cities, but carry cash for markets, tuk-tuks and rural stops.' },
  { label: 'Languages', text: 'Sinhala and Tamil are official languages; English is widely spoken in hotels, shops and along the main travel routes.' },
  { label: 'Electricity', text: '230 V, 50 Hz. Sockets are a mix of Types D, G and M — a universal adapter saves hassle.' },
  { label: 'Transport', text: 'Trains (book the scenic hill-country seats early), private drivers for flexible routes, and tuk-tuks for short hops. Domestic flights connect Colombo with the far south and east.' },
  { label: 'Temple etiquette', text: 'Remove shoes and hats before entering temples and cover shoulders and knees. Never turn your back to a Buddha statue for photos.' },
  { label: 'Dress guidance', text: 'Light cottons suit the coast; add a layer for the cool hills. Modest dress is appreciated away from the beach, especially in religious sites.' },
  { label: 'Weather awareness', text: 'Two monsoons alternate between coasts — short tropical showers can happen anywhere. Check regional forecasts as you plan each leg.' },
  { label: 'Travel planning tips', text: 'Distances look small on the map but roads wind — two to three hours between regions is normal. Our planners shape routes around realistic drive times.' },
]

/* --------------------------- sections --------------------------- */

function SectionHeading({ kicker, title, lead, tone = 'light' }: { kicker: string; title: string; lead?: string; tone?: 'light' | 'dark' }) {
  const dark = tone === 'dark'
  return (
    <Reveal className="max-w-2xl">
      <p className="kicker">{kicker}</p>
      <h2 className={`display mt-3 text-4xl sm:text-5xl ${dark ? 'text-white' : 'text-ink'}`}>{title}</h2>
      {lead && <p className={`mt-5 leading-relaxed ${dark ? 'text-white/75' : 'text-muted'}`}>{lead}</p>}
    </Reveal>
  )
}

function MonthStrip({ months }: { months: number[] }) {
  return (
    <div className="flex gap-1.5" aria-hidden>
      {MONTH_LETTERS.map((m, i) => {
        const active = months.includes(i + 1)
        return (
          <span
            key={i}
            className={`flex h-6 w-5 items-center justify-center rounded-sm text-[9px] font-semibold ${
              active ? 'bg-tea text-white' : 'bg-cloud text-muted/60'
            }`}
          >
            {m}
          </span>
        )
      })}
    </div>
  )
}

export default function DiscoverSriLankaPage() {
  return (
    <main className="bg-cloud text-ink">
      {/* ---------- 1. Cinematic hero ---------- */}
      <header className="relative flex min-h-[88svh] items-end overflow-hidden bg-jungle">
        <img
          src={HERO_IMG}
          alt="The nine-arched railway bridge among tea hills in Ella"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full scale-[1.04] object-cover"
        />
        <div className="absolute inset-0 bg-[#0c2a24]/30 mix-blend-multiply" aria-hidden />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b1a15]/90 via-[#0b1a15]/30 to-[#0b1a15]/15" aria-hidden />
        <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 pt-40 sm:px-12 lg:px-24">
          <Reveal>
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-sand/70" aria-hidden />
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-sand/90">
                The Island of Serendipity
              </p>
            </div>
            <h1 className="display-hero mt-5 text-5xl text-white drop-shadow-[0_6px_30px_rgba(0,0,0,0.45)] sm:text-6xl lg:text-7xl">
              Sri Lanka, in Every Sense
            </h1>
            <p className="mt-6 max-w-xl leading-relaxed text-white/85">
              A small island with ancient kingdoms, sacred traditions, wild landscapes, fragrant kitchens and coastlines
              shaped by the Indian Ocean.
            </p>
            <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
              <Link
                href="/explore"
                className="rounded-full bg-terracotta px-8 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-editorial transition-transform hover:scale-[1.03] active:scale-95"
              >
                Explore Destinations
              </Link>
              <Link
                href="/plan"
                className="group inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.12em] text-white/90 transition-colors hover:text-sand"
              >
                Plan My Journey
                <span aria-hidden className="inline-block transition-transform group-hover:translate-x-1.5">&rarr;</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </header>

      {/* ---------- 2. At a glance ---------- */}
      <section aria-labelledby="glance" className="mx-auto max-w-7xl px-6 py-24 sm:px-12 lg:px-24">
        <SectionHeading
          kicker="At a Glance"
          title="A Small Island, Explained in Ten Lines"
          lead="Everything essential, laid out plainly — so the rest of this guide can tell the story."
        />
        <Reveal className="mt-12">
          <dl className="grid grid-cols-1 gap-x-14 border-t border-sand-dark/40 sm:grid-cols-2 lg:grid-cols-5">
            {FACTS.map((f) => (
              <div key={f.label} className="border-b border-sand-dark/40 py-6">
                <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-terracotta">{f.label}</dt>
                <dd className="mt-2 text-[15px] leading-snug text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </section>

      {/* ---------- 3. History ---------- */}
      <section aria-labelledby="history" className="bg-cloud py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-24">
          <SectionHeading
            kicker="History"
            title="A Story Written Over Centuries"
            lead="Kingdoms rose around reservoirs and rock fortresses; traders and colonists left forts and railways. Everything below can still be walked, climbed and photographed today."
          />
          <ol className="mt-16 space-y-0">
            {TIMELINE.map((t) => (
              <li key={t.title}>
                <Reveal>
                  <div className="grid items-center gap-8 border-t border-sand-dark/40 py-12 lg:grid-cols-[180px_1fr_360px]">
                    <p className="font-display text-xl text-terracotta">{t.period}</p>
                    <div className="max-w-xl">
                      <h3 className="display text-3xl text-ink">{t.title}</h3>
                      <p className="mt-3 leading-relaxed text-muted">{t.text}</p>
                    </div>
                    {t.image ? (
                      <div className="overflow-hidden rounded-xl shadow-card">
                        <img src={t.image} alt={t.alt} loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover" />
                      </div>
                    ) : (
                      <p className="hidden font-display text-7xl leading-none text-sand-dark/60 lg:block" aria-hidden>1948</p>
                    )}
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- 4. Food ---------- */}
      <section aria-labelledby="food" className="bg-jungle py-24 text-sand">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-24">
          <SectionHeading
            kicker="Cuisine"
            title="A Cuisine of Spice, Rice and Story"
            lead="Sri Lankan food is eaten with the hands, shared across tables and argued over with love. Slide through the essentials — then taste them on your journey."
            tone="dark"
          />
          <Reveal className="mt-14">
            <FoodSlider items={FOODS} />
          </Reveal>
          <Reveal className="mt-8">
            <Link
              href="/plan"
              className="inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.12em] text-sand transition-colors hover:text-white"
            >
              Taste it on your journey
              <span aria-hidden>&rarr;</span>
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- 5. Best time to visit ---------- */}
      <section aria-labelledby="seasons" className="mx-auto max-w-7xl px-6 py-24 sm:px-12 lg:px-24">
        <SectionHeading
          kicker="When to Go"
          title="When Should You Visit?"
          lead="Sri Lanka rewards travellers all year — the trick is matching the region to the month. Two monsoons take turns: the southwest (roughly May–September) and the northeast (roughly October–January). The calendar below shows the generally favourable months, not guarantees."
        />
        <Reveal className="mt-12">
          <div className="border-t border-sand-dark/40">
            {SEASONS.map((s) => (
              <div key={s.region} className="grid gap-4 border-b border-sand-dark/40 py-7 lg:grid-cols-[240px_1fr] lg:items-center">
                <div>
                  <h3 className="display text-2xl text-ink">{s.region}</h3>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-[0.16em] text-terracotta">{s.period}</p>
                </div>
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
                  <MonthStrip months={s.months} />
                  <p className="max-w-md text-sm leading-relaxed text-muted">{s.note}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-xs leading-relaxed text-muted">
            Weather can vary by region and short showers are possible outside the main rainy periods. Visitors should
            check current conditions before travelling.
          </p>
        </Reveal>
      </section>

      {/* ---------- 6. Culture ---------- */}
      <section aria-labelledby="culture" className="bg-cloud py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-6 sm:px-12 lg:grid-cols-2 lg:items-center lg:px-24">
          <Reveal>
            <SectionHeading
              kicker="Culture"
              title="A Living Culture"
              lead="Sri Lanka is shaped by many communities, languages, faiths and traditions — Buddhist and Hindu temples share skylines with churches and mosques, and festivals fill the calendar year-round."
            />
            <ul className="mt-8 space-y-4 text-[15px] leading-relaxed text-muted">
              <li className="border-b border-sand-dark/30 pb-4">Sacred cities and living temples — from Anuradhapura and Dambulla to Kandy’s Tooth Relic shrine.</li>
              <li className="border-b border-sand-dark/30 pb-4">Tamil heritage and vibrant Hindu temples, crowned by Jaffna’s Nallur Kandaswamy festival.</li>
              <li className="border-b border-sand-dark/30 pb-4">Islamic and Christian communities whose food, architecture and celebrations weave into daily life.</li>
              <li className="border-b border-sand-dark/30 pb-4">Kandyan drumming, masked dance and devils of folklore performed still, not preserved.</li>
              <li className="border-b border-sand-dark/30 pb-4">The Kandy Esala Perahera — torchlight, elephants and temple guardians each July or August.</li>
              <li className="border-b border-sand-dark/30 pb-4">Sinhala and Tamil New Year in April, when the whole island cooks, plays and starts anew together.</li>
              <li className="border-b border-sand-dark/30 pb-4">Handicrafts from wood, brass and lacquer — and the vivid sanni masks of the southern coast.</li>
              <li className="border-b border-sand-dark/30 pb-4">Ayurveda, the island’s ancient wellness tradition, practised in dedicated retreats.</li>
              <li>Village life: a cup of plain tea, an invitation to eat, and hospitality that travellers remember longest.</li>
            </ul>
          </Reveal>
          <Reveal className="grid grid-cols-2 gap-5">
            {CULTURE_IMAGES.map((im, i) => (
              <figure key={im.src} className={i % 2 === 1 ? 'mt-10' : ''}>
                <img
                  src={im.src}
                  alt={im.alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[3/4] w-full rounded-xl object-cover shadow-card"
                />
              </figure>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------- 7. Landscapes & experiences ---------- */}
      <section aria-labelledby="experiences" className="mx-auto max-w-7xl px-6 py-24 sm:px-12 lg:px-24">
        <SectionHeading
          kicker="Landscapes & Experiences"
          title="Six Ways Into the Island"
          lead="Every journey begins with one pull — start with any of these, and we shape the rest around it."
        />
        <div className="mt-14 grid gap-x-10 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {EXPERIENCES.map((e) => (
            <Reveal key={e.title}>
              <article>
                <Link href={e.href} className="group block overflow-hidden rounded-xl shadow-card">
                  <img
                    src={e.image}
                    alt={e.alt}
                    loading="lazy"
                    decoding="async"
                    className="aspect-[4/3] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </Link>
                <h3 className="display mt-5 text-2xl text-ink">{e.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{e.text}</p>
                <Link href={e.href} className="mt-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-ocean transition-colors hover:text-terracotta">
                  {e.link} <span aria-hidden>&rarr;</span>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------- 8. Practical information ---------- */}
      <section aria-labelledby="practical" className="bg-jungle py-24 text-sand">
        <div className="mx-auto max-w-7xl px-6 sm:px-12 lg:px-24">
          <SectionHeading
            kicker="Before You Fly"
            title="Practical Travel Information"
            lead="The unglamorous details, handled up front — so nothing gets between you and the island."
            tone="dark"
          />
          <Reveal className="mt-12">
            <dl className="grid grid-cols-1 gap-x-16 border-t border-white/15 md:grid-cols-2">
              {PRACTICAL.map((p) => (
                <div key={p.label} className="border-b border-white/15 py-6">
                  <dt className="text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-sand/70">{p.label}</dt>
                  <dd className="mt-2 max-w-lg text-[15px] leading-relaxed text-sand/90">{p.text}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ---------- 9. Final CTA ---------- */}
      <section aria-labelledby="cta" className="relative overflow-hidden py-28">
        <div
          className="absolute inset-0 bg-jungle"
          aria-hidden
        />
        <div
          className="absolute left-1/2 top-1/2 h-[70vh] w-[70vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(12,74,90,0.5)_0%,rgba(16,34,28,0)_65%)]"
          aria-hidden
        />
        <Reveal className="relative mx-auto max-w-3xl px-6 text-center sm:px-12">
          <p className="kicker">Sri Lankan Guru</p>
          <h2 className="display mt-3 text-4xl text-white sm:text-6xl">
            Now, Make It Your Sri Lanka
          </h2>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-white/75">
            Whether you dream of ancient cities, tea-covered mountains, wildlife safaris, tropical beaches or
            unforgettable food, Sri Lankan Guru can shape the experience around your time, interests and travel style.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/plan"
              className="rounded-full bg-terracotta px-9 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-editorial transition-transform hover:scale-[1.03] active:scale-95"
            >
              Build My Journey
            </Link>
            <Link
              href="/explore"
              className="rounded-full border border-white/60 px-9 py-4 text-sm font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-white/10"
            >
              Explore Destinations
            </Link>
          </div>
        </Reveal>
      </section>
    </main>
  )
}
