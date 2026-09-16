import type { Destination } from '@/types'

const W = (file: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1200`

/**
 * Curated Sri Lanka destination database.
 *
 * This module is the single factual source for destinations across the app:
 * the Explore page, the AI itinerary engine, and the rules-based planner all
 * read from here. Add new entries freely — no application code changes needed.
 */
export const destinations: Destination[] = [
  {
    slug: 'colombo',
    name: 'Colombo',
    region: 'West Coast',
    coords: [6.9271, 79.8612],
    summary: 'The island’s commercial capital — colonial arcades, temple drums and a fast-growing food scene.',
    description:
      'Colombo layers centuries of Portuguese, Dutch and British history over a working harbour city. Galle Face Green fills with kite flyers at dusk, the Pettah markets hum at dawn, and the gaslamp-lit arcades of the old Dutch Hospital now host some of the country’s best restaurants.',
    image: W('Colombo, Sri Lanka.jpg'),
    durationDays: { min: 1, max: 2 },
    themes: ['Culture & Heritage', 'Food', 'Luxury', 'Family', 'Photography'],
    activities: ['Galle Face Green sunset walk', 'Pettah market tour', 'Gangaramaya Temple', 'Dutch Hospital dining precinct', 'Colombo National Museum'],
    highlights: ['Galle Face Green', 'Gangaramaya Temple', 'Pettah Floating Market'],
  },
  {
    slug: 'negombo',
    name: 'Negombo',
    region: 'West Coast',
    coords: [7.2083, 79.8358],
    summary: 'A laid-back fishing town and lagoon just north of the airport — golden sand, catamarans and Dutch canals.',
    description:
      'Negombo’s beaches and the Dutch-built canal network make it an effortless first or last stop. Watch the morning fish auction at the lagoon, cruise past mangroves, and eat crab caught the same day.',
    image: W('Negombo Beach.jpg'),
    durationDays: { min: 1, max: 2 },
    themes: ['Beaches', 'Food', 'Family', 'Wellness'],
    activities: ['Lagoon boat safari', 'Fish market at dawn', 'Dutch canal cruise', 'Ayurvedic massage', 'Catamaran sailing'],
    highlights: ['Negombo Lagoon', 'Dutch Canal', 'St. Mary’s Church'],
  },
  {
    slug: 'sigiriya',
    name: 'Sigiriya',
    region: 'Cultural Triangle',
    coords: [7.957, 80.7603],
    summary: 'The Lion Rock — a 5th-century sky palace rising 200 metres above the cultural triangle.',
    description:
      'King Kashyapa’s fortress is Sri Lanka’s most iconic sight: frescoed maidens, the polished Mirror Wall, water gardens that still work after 1,500 years, and a summit palace with views to the horizon. Climb at dawn before the heat and the crowds.',
    image: W('Lion Rock - Sigiriya, Sri Lanka.jpg'),
    durationDays: { min: 1, max: 2 },
    themes: ['Culture & Heritage', 'Adventure', 'Photography', 'Scenic'],
    activities: ['Sunrise Lion Rock climb', 'Pidurangala Rock sunset hike', 'Village tuk-tuk safari', 'Minneriya elephant gathering (seasonal)'],
    highlights: ['Lion Rock summit', 'Frescoes & Mirror Wall', 'Water Gardens'],
  },
  {
    slug: 'kandy',
    name: 'Kandy',
    region: 'Hill Country',
    coords: [7.2906, 80.6337],
    summary: 'The last royal capital, wrapped around a sacred lake and home of the Temple of the Tooth.',
    description:
      'Kandy was the seat of Sinhalese kings for 300 years and remains the spiritual heart of the island. The Temple of the Sacred Tooth Relic draws pilgrims in white, the Kandy Lake loop is made for slow evenings, and the Perahera festival fills the streets every July or August.',
    image: W('Kandy Sri Lanka Temple of the tooth.jpg'),
    durationDays: { min: 1, max: 2 },
    themes: ['Culture & Heritage', 'Scenic', 'Food', 'Photography'],
    activities: ['Temple of the Tooth evening puja', 'Kandyan dance show', 'Royal Botanical Gardens Peradeniya', 'Kandy Lake stroll', 'Udawattekele forest hike'],
    highlights: ['Temple of the Tooth', 'Peradeniya Gardens', 'Kandy Lake'],
  },
  {
    slug: 'nuwara-eliya',
    name: 'Nuwara Eliya',
    region: 'Hill Country',
    coords: [6.9497, 80.7891],
    summary: '“Little England” at 1,868 metres — colonial cottages, cool air and the green cathedral of Ceylon’s tea country.',
    description:
      'The highest town in Sri Lanka keeps its British inheritance: the hill club, the 1910 post office, a racecourse at altitude. Around it, tea estates cascade in perfect lines and factory tours end with a tasting at source.',
    image: W('Tea plantations near Nuwara Eliya, Sri Lanka - panoramio.jpg'),
    durationDays: { min: 1, max: 2 },
    themes: ['Scenic', 'Wellness', 'Luxury', 'Family', 'Food'],
    activities: ['Tea factory tour & tasting', 'Horton Plains & World’s End dawn trek', 'Gregory Lake boating', 'Victoria Park gardens', 'Golf at 1,800 m'],
    highlights: ['Horton Plains', 'Pedro Tea Estate', 'Gregory Lake'],
  },
  {
    slug: 'ella',
    name: 'Ella',
    region: 'Hill Country',
    coords: [6.8667, 81.0466],
    summary: 'A mountain village of waterfalls, tea trails and the Nine Arch Bridge — Sri Lanka’s favourite view.',
    description:
      'Ella sits high in the Uva hills where the climate turns soft and the air smells of eucalyptus. Hike Little Adam’s Peak at sunrise, watch the blue train cross the Nine Arch Viaduct, and cool off under Ravana Falls.',
    image: W('Nine Arches Bridge in Ella.jpg'),
    durationDays: { min: 1, max: 2 },
    themes: ['Scenic', 'Adventure', 'Photography', 'Food'],
    activities: ['Little Adam’s Peak sunrise hike', 'Nine Arch Bridge train crossing', 'Ella Rock day hike', 'Ravana Falls', 'Cooking class with a local family'],
    highlights: ['Nine Arch Bridge', 'Little Adam’s Peak', 'Ella Rock'],
  },
  {
    slug: 'yala',
    name: 'Yala',
    region: 'South Coast',
    coords: [6.3728, 81.5016],
    summary: 'Leopard country — the world’s best odds of seeing the island’s apex predator in the wild.',
    description:
      'Yala’s Block I holds one of the highest leopard densities on Earth, alongside elephants, sloth bears, crocodiles and 200+ bird species. Dawn game drives in open jeeps end with breakfast on the beach; 2,000-year-old rock temples hide inside the park.',
    image: W('Sri Lankan Leopard - Yala National Park.jpg'),
    durationDays: { min: 1, max: 2 },
    themes: ['Wildlife', 'Adventure', 'Photography', 'Luxury'],
    activities: ['Dawn leopard safari', 'Full-day game drive', 'Sithulpawwa rock temple', 'Coastal lagoon birding'],
    highlights: ['Leopard sightings', 'Elephant herds', 'Sithulpawwa temple'],
  },
  {
    slug: 'udawalawe',
    name: 'Udawalawe',
    region: 'South Coast',
    coords: [6.4481, 80.8976],
    summary: 'Open grassland and reservoirs where elephant herds roam against a backdrop of blue mountains.',
    description:
      'Udawalawe is the most reliable place in Asia to see wild elephants in large family groups, all year round. The Elephant Transit Home releases orphaned calves back to the wild — a moving stop for families.',
    image: W('Udawalawe National Park.jpg'),
    durationDays: { min: 1, max: 2 },
    themes: ['Wildlife', 'Family', 'Adventure'],
    activities: ['Elephant safari at dawn', 'Elephant Transit Home feeding', 'Birdwatching on the reservoir'],
    highlights: ['Wild elephant herds', 'Elephant Transit Home', 'Udawalawe reservoir'],
  },
  {
    slug: 'galle',
    name: 'Galle',
    region: 'South Coast',
    coords: [6.0535, 80.221],
    summary: 'A 17th-century Dutch fort town on the ocean — ramparts, boutiques and the best sunsets on the coast.',
    description:
      'Galle Fort is a living walled town: Dutch churches, merchant houses turned galleries, and cafés in old warehouses. Walk the ramparts at golden hour when cricketers play on the greens below and the lighthouse catches the last light.',
    image: W('Galle lighthouse A.jpg'),
    durationDays: { min: 1, max: 2 },
    themes: ['Culture & Heritage', 'Beaches', 'Food', 'Luxury', 'Photography'],
    activities: ['Ramparts sunset walk', 'Fort boutique & gallery crawl', 'Maritime Museum', 'Stilt fishermen at Koggala', 'Whale watching from Mirissa (seasonal)'],
    highlights: ['Galle Fort ramparts', 'Galle Lighthouse', 'Dutch Reformed Church'],
  },
  {
    slug: 'mirissa',
    name: 'Mirissa',
    region: 'South Coast',
    coords: [5.9483, 80.4716],
    summary: 'A perfect crescent bay — blue whales offshore, surf waves in, and candlelit seafood on the sand.',
    description:
      'Mirissa’s deep offshore waters host blue whales nearly year-round, while the bay itself is made for long swims and beginner surf. Coconut Tree Hill frames the sunset; the fishing harbour starts the day.',
    image: W('Mirissa beach, Srilanka.jpg'),
    durationDays: { min: 1, max: 3 },
    themes: ['Beaches', 'Wildlife', 'Adventure', 'Food', 'Family'],
    activities: ['Blue whale & dolphin cruise', 'Surf lessons', 'Coconut Tree Hill sunset', 'Secret Beach snorkelling', 'Parrot Rock climb'],
    highlights: ['Blue whale watching', 'Coconut Tree Hill', 'Secret Beach'],
  },
  {
    slug: 'trincomalee',
    name: 'Trincomalee',
    region: 'East Coast',
    coords: [8.5874, 81.2152],
    summary: 'One of the world’s great natural harbours — powder-white sand, sperm whales and temples on the headland.',
    description:
      'Trincomalee’s deep-water bay has drawn traders for two millennia. Up the coast, Uppuveli and Nilaveli beaches run soft and quiet; Pigeon Island’s reef is the east coast’s best snorkelling, and Koneswaram Temple crowns the bluff at Swami Rock.',
    image: W('Trincomalee.jpg'),
    durationDays: { min: 2, max: 3 },
    themes: ['Beaches', 'Culture & Heritage', 'Wildlife', 'Adventure', 'Family'],
    activities: ['Pigeon Island snorkelling', 'Whale & dolphin watching', 'Koneswaram Temple', 'Nilaveli beach days', 'Fort Frederick walk'],
    highlights: ['Nilaveli Beach', 'Pigeon Island', 'Koneswaram Temple'],
  },
  {
    slug: 'arugam-bay',
    name: 'Arugam Bay',
    region: 'East Coast',
    coords: [6.8404, 81.834],
    summary: 'Sri Lanka’s surf capital — a right-hand point break, barefoot cafés and lagoon elephants.',
    description:
      'From May to September Arugam Bay catches the east-coast swell, and its main point break is ranked among the best in Asia. Off-season it returns to a sleepy fishing village; the lagoon behind hides elephants and crocodiles.',
    image: W('Arugam Bay.jpg'),
    durationDays: { min: 2, max: 4 },
    themes: ['Beaches', 'Adventure', 'Wellness', 'Photography'],
    activities: ['Surf main point & Whiskey Point', 'Lagoon safari', 'Yoga by the beach', 'Elephant Rock sunset', 'Muhudu Maha Viharaya ruins'],
    highlights: ['Main Point surf break', 'Lagoon safari', 'Elephant Rock'],
  },
  {
    slug: 'jaffna',
    name: 'Jaffna',
    region: 'North',
    coords: [9.6615, 80.0255],
    summary: 'Tamil culture at its most vivid — temples ablaze with colour, island hopping and a cuisine all its own.',
    description:
      'Jaffna rewards travellers who make the long journey north: Nallur Kandaswamy Temple’s gold facade, the reconstructed library, causeways out to island villages, and dishes — crab curry, palmyrah sweets — you won’t taste further south.',
    image: W('Nallur Kandaswamy temple.jpg'),
    durationDays: { min: 2, max: 3 },
    themes: ['Culture & Heritage', 'Food', 'Photography'],
    activities: ['Nallur Kandaswamy Temple', 'Jaffna Library & fort', 'Delft Island day trip', 'Nagadeepa & Nainativu islands', 'Jaffna market food walk'],
    highlights: ['Nallur Festival (Jul–Aug)', 'Delft Island', 'Jaffna cuisine'],
  },
  {
    slug: 'anuradhapura',
    name: 'Anuradhapura',
    region: 'Cultural Triangle',
    coords: [8.3114, 80.4037],
    summary: 'The first great capital — colossal white dagobas and the world’s oldest documented tree.',
    description:
      'For 1,300 years Anuradhapura was the island’s seat of power and faith. Pilgrims in white still circle Ruwanwelisaya, and the sacred Bodhi tree has been tended continuously since 288 BC. Cycle the vast sacred city at dawn.',
    image: W('Ruwanwelisaya Stupa Anuradhapura.jpg'),
    durationDays: { min: 1, max: 2 },
    themes: ['Culture & Heritage', 'Photography', 'Scenic'],
    activities: ['Sacred City cycle tour', 'Sri Maha Bodhi tree ceremony', 'Ruwanwelisaya at dusk', 'Isurumuniya rock temple', 'Mihintale sunrise climb'],
    highlights: ['Sri Maha Bodhi', 'Ruwanwelisaya', 'Jetavanaramaya'],
  },
  {
    slug: 'polonnaruwa',
    name: 'Polonnaruwa',
    region: 'Cultural Triangle',
    coords: [7.9403, 81.0188],
    summary: 'The medieval capital — rock-cut Gal Vihara Buddhas and a 12th-century planned city by a great lake.',
    description:
      'Polonnaruwa’s ruins are intimate and green, best explored by bicycle between the Royal Palace, the Sacred Quadrangle and the serene granite Buddhas of Gal Viharaya. Parakrama Samudra, the ancient reservoir, still waters the district.',
    image: W('Gal Viharaya, Ancient City of Polonnaruwa, Sri Lanka.jpg'),
    durationDays: { min: 1, max: 2 },
    themes: ['Culture & Heritage', 'Wildlife', 'Photography', 'Family'],
    activities: ['Ancient city cycle tour', 'Gal Viharara meditation', 'Parakrama Samudra sunrise', 'Minneriya & Kaudulla elephant safaris'],
    highlights: ['Gal Vihara Buddhas', 'Sacred Quadrangle', 'Parakrama Samudra'],
  },
]

export function getDestination(slug: string): Destination | undefined {
  return destinations.find((d) => d.slug === slug)
}

export function destinationsByTheme(theme: string): Destination[] {
  return destinations.filter((d) => d.themes.includes(theme as Destination['themes'][number]))
}
