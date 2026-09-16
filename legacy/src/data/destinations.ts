export interface Hotel {
  name: string
  distance: string
  price: string
  rating: number
  description: string
}

export interface Activity {
  name: string
  category: string
  description: string
}

export interface TourCategory {
  slug: string
  label: string
  description: string
}

export const TOUR_CATEGORIES: TourCategory[] = [
  {
    slug: 'city-tours',
    label: 'City Tours',
    description: "Guided exploration of Sri Lanka's cities and urban heritage sites.",
  },
  {
    slug: 'multi-day',
    label: 'Multi-Day',
    description: 'Extended itineraries covering culture, heritage, nature, adventure and wildlife.',
  },
  {
    slug: 'beach-trips',
    label: 'Beach Trips',
    description: "Coastal getaways along Sri Lanka's beaches.",
  },
  {
    slug: 'day-attractions',
    label: 'Day Attractions',
    description: 'Single-day excursions to nearby points of interest.',
  },
  {
    slug: 'ayurveda-wellness',
    label: 'Ayurveda & Wellness',
    description: 'Traditional Ayurvedic wellness retreats and treatments.',
  },
]

export interface Destination {
  id: string
  slug: string
  name: string
  region: string
  tagline: string
  image: string
  shortHistory: string
  culture: string
  fullHistory: string
  cultureDetail: string
  bestTime: string
  categories: string[]
  hotels: Hotel[]
  activities: Activity[]
}

const W = (file: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1400`

export const destinations: Destination[] = [
  {
    id: 'sigiriya',
    slug: 'sigiriya',
    name: 'Sigiriya',
    region: 'Central Province',
    tagline: 'The Lion Rock fortress of a fugitive king',
    image: W('Lion Rock - Sigiriya, Sri Lanka.jpg'),
    shortHistory:
      'Sigiriya is a 200-metre-high ancient rock fortress built by King Kashyapa I in the 5th century, crowned with a palace complex and famous for its frescoes.',
    culture:
      'The rock fortress blends urban planning, art, and engineering — mirrored walls, garden waterworks, and the famed "Heavenly Maidens" frescoes.',
    fullHistory:
      'In 477 AD, King Kashyapa I seized the throne from his father King Dhatusena and built an impregnable palace atop a towering granite monolith as a refuge from his vengeful half-brother Moggallana. The summit once held a magnificent citadel, while the western face was adorned with hundreds of frescoes of celestial maidens. Following Kashyapa\u2019s defeat in 495 AD, the complex became a Buddhist monastery for over 700 years before being abandoned. Rediscovered by British explorer Jonathan Forbes in 1831, Sigiriya is now a UNESCO World Heritage Site and one of the finest examples of ancient urban planning.',
    cultureDetail:
      'Sigiriya is a masterpiece of ancient Sri Lankan engineering. Its water gardens used hydraulic technology that still functions today, while the Mirror Wall — polished to a shine with a mix of lime, egg white, and wild bee honey — carries 8th-century graffiti poems from pilgrims. The 1,400-year-old frescoes of the "Heavenly Maidens" are among the oldest surviving paintings in Sri Lanka and a rare example of secular art from the era.',
    bestTime: 'January – April (dry season, best light)',
    categories: ['multi-day', 'day-attractions'],
    hotels: [
      {
        name: 'Sigiriya Village Hotel',
        distance: '3.5 km from the rock',
        price: '$$ (US$90–140)',
        rating: 4.3,
        description: 'Boutique hotel surrounded by paddy fields with views of Sigiriya and Pidurangala.',
      },
      {
        name: 'Jetwing Lake',
        distance: '6 km from the rock',
        price: '$$$ (US$150–240)',
        rating: 4.6,
        description: 'Modern luxury resort overlooking Kandalama Lake, minutes from the fortress.',
      },
      {
        name: 'Pinthaliya Resort & Spa',
        distance: '4 km from the rock',
        price: '$$$ (US$130–200)',
        rating: 4.5,
        description: 'Tranquil hilltop resort with a signature infinity pool and spa.',
      },
    ],
    activities: [
      {
        name: 'Climb the Lion Rock',
        category: 'Heritage',
        description: 'Ascend 1,200 steps past the frescoes and mirror wall to the summit citadel.',
      },
      {
        name: 'Sunset at Pidurangala Rock',
        category: 'Viewpoint',
        description: 'A short hike to a neighbouring rock for the classic golden-hour view of Sigiriya.',
      },
      {
        name: 'Village safari & cooking class',
        category: 'Experience',
        description: 'Bullock-cart ride through rice paddies and a hands-on Sri Lankan cooking lesson.',
      },
    ],
  },
  {
    id: 'kandy',
    slug: 'kandy',
    name: 'Kandy',
    region: 'Central Province',
    tagline: 'The last royal capital and the Temple of the Tooth',
    image: W('Kandy Sri Lanka Temple of the tooth.jpg'),
    shortHistory:
      'Kandy was the final stronghold of the Sinhalese monarchy, surviving 300 years of colonial rule before falling to the British in 1815.',
    culture:
      'The city revolves around the Sacred Temple of the Tooth, home to a relic of the Buddha and the heart of the annual Esala Perahera festival.',
    fullHistory:
      'Founded in the 14th century, Kandy served as the capital of the Kingdom of Kandy — the last independent Sinhalese kingdom — for over 300 years. Its mountainous terrain and fierce resistance kept Portuguese, Dutch, and British forces at bay until 1815, when the Kandyan Convention ceded the kingdom to the British. The city\u2019s soul is the Sri Dalada Maligawa (Temple of the Sacred Tooth Relic), which houses what is believed to be a tooth of the Buddha, brought to Sri Lanka in the 4th century. Today Kandy remains a UNESCO World Heritage Site and the spiritual heart of Buddhism in the island.',
    cultureDetail:
      'The Kandy Esala Perahera, held each July or August, is one of the grandest Buddhist processions in the world — fire dancers, whip crackers, drummers, and dozens of caparisoned elephants parading through the streets for ten nights. Around the lake lies a living culture of Kandyan dance, traditional silverware, and Buddhist observance that draws pilgrims from across Asia.',
    bestTime: 'July – August (Perahera festival) or December – April',
    categories: ['city-tours', 'multi-day'],
    hotels: [
      {
        name: 'Earl\u2019s Regency Hotel',
        distance: '4 km from the Temple',
        price: '$$$ (US$140–220)',
        rating: 4.4,
        description: 'Colonial-style resort in a tropical garden overlooking the Mahaweli River.',
      },
      {
        name: 'Kandy City Hotel',
        distance: '700 m from the Temple',
        price: '$$ (US$60–110)',
        rating: 4.1,
        description: 'Convenient mid-range stay in the heart of the city centre.',
      },
      {
        name: 'The Golden Crown Hotel',
        distance: '2.5 km from the Temple',
        price: '$$ (US$80–130)',
        rating: 4.2,
        description: 'Comfortable hotel with a rooftop pool and hill views.',
      },
    ],
    activities: [
      {
        name: 'Visit the Temple of the Tooth',
        category: 'Heritage',
        description: 'Join the evening puja to witness the sacred relic ceremony and offering.',
      },
      {
        name: 'Kandyan dance performance',
        category: 'Culture',
        description: 'Watch traditional ves dancers and drummers at the Kandy Lake Club.',
      },
      {
        name: 'Boat ride on Kandy Lake',
        category: 'Leisure',
        description: 'A relaxing paddle around the scenic lake built by the last king.',
      },
    ],
  },
  {
    id: 'galle',
    slug: 'galle',
    name: 'Galle',
    region: 'Southern Province',
    tagline: 'A 17th-century Dutch fort on the Indian Ocean',
    image: W('Galle lighthouse A.jpg'),
    shortHistory:
      'Galle Fort, built by the Portuguese in 1588 and fortified by the Dutch in the 1600s, is the best-preserved colonial city in South Asia.',
    culture:
      'Within the ramparts, Dutch-era buildings, boutique galleries, and cafés create a laid-back fusion of European and South Asian life.',
    fullHistory:
      'Galle was Sri Lanka\u2019s principal port long before the Europeans arrived — Arab, Greek, and Chinese traders had called here for centuries, and the name is thought to derive from the Sinhala word for "cattle station". The Portuguese arrived in 1588 and raised a small fort; the Dutch captured it in 1640 and transformed it into an imposing star-shaped bastion with walls that withstood tsunamis and sieges. The British took over in 1796 and ruled until independence in 1948, adding the iconic lighthouse in 1938. The entire fort — a living town of about 4,000 people inside its walls — is a UNESCO World Heritage Site.',
    cultureDetail:
      'Galle Fort is one of the few places in the world where an entire colonial town is still inhabited. Its narrow lanes are lined with Dutch Reformed Church, old merchant houses, and the 400-year-old ramparts facing the sea. A thriving community of artists, jewellery designers, and café owners has turned the fort into Sri Lanka\u2019s creative hub, while the harbour still bustles with fishing boats and the famous stilt fishermen at nearby Koggala.',
    bestTime: 'December – April (sunny) or November (shoulder)',
    categories: ['city-tours', 'day-attractions'],
    hotels: [
      {
        name: 'Amangalla',
        distance: 'Inside the fort',
        price: '$$$$ (US$450+)',
        rating: 4.8,
        description: 'A restored 1684 Dutch villa offering unmatched heritage luxury.',
      },
      {
        name: 'The Fort Printers',
        distance: 'Inside the fort',
        price: '$$$ (US$180–260)',
        rating: 4.6,
        description: 'Charming boutique hotel set in a former printing press.',
      },
      {
        name: 'Fort Bazaar',
        distance: 'Inside the fort',
        price: '$$$ (US$160–240)',
        rating: 4.5,
        description: 'Modern boutique hotel by Galle Fort Hotel, steps from the ramparts.',
      },
    ],
    activities: [
      {
        name: 'Walk the ramparts at sunset',
        category: 'Leisure',
        description: 'Stroll the sea-facing walls for ocean views, cricket games, and golden light.',
      },
      {
        name: 'Explore Dutch-era museums',
        category: 'Culture',
        description: 'Visit the Maritime Museum and the National Museum inside the fort.',
      },
      {
        name: 'Stilt fishermen at Koggala',
        category: 'Experience',
        description: 'Drive south to see and photograph the iconic stilt fishermen.',
      },
    ],
  },
  {
    id: 'ella',
    slug: 'ella',
    name: 'Ella',
    region: 'Uva Province',
    tagline: 'Tea-country hiking and the famous Nine Arch Bridge',
    image: W('Nine Arches Bridge in Ella.jpg'),
    shortHistory:
      'A former British hill-station, Ella grew up around coffee and tea estates on the colonial railway line through the misty hills.',
    culture:
      'Travellers come for hiking, train rides over the Nine Arch Bridge, and the relaxed café culture of this mountain village.',
    fullHistory:
      'Ella began as a small trading village high in the Uva highlands, transformed in the 19th century when British planters cleared the forest for coffee, then tea, estates. The construction of the colonial railway in the 1920s linked the hills to Colombo, and the famous Nine Arch Bridge — locally called the "Bridge in the Sky" — was built in 1921 during World War I using only stone, brick, and cement, without a single piece of steel. Today Ella has become Sri Lanka\u2019s most beloved backpacker town, a base for waterfall hikes, tea-tasting, and dramatic mountain sunrises.',
    cultureDetail:
      'Ella sits at 1,041 metres amid emerald tea estates still worked by Tamil estate communities, whose line houses, temples, and festivals shape the local rhythm. The village thrives on its trail culture — from Little Adam\u2019s Peak to Ella Rock — and on the famous "train in the clouds" journey from Kandy to Ella, one of the most scenic rail routes on earth. Its guesthouses and cafés give it a warm, international vibe.',
    bestTime: 'March – September (drier hills)',
    categories: ['multi-day', 'day-attractions'],
    hotels: [
      {
        name: '98 Acres Resort & Spa',
        distance: '2 km from the village',
        price: '$$$ (US$220–350)',
        rating: 4.7,
        description: 'Luxury eco-resort perched over the tea fields with dramatic views.',
      },
      {
        name: 'Ella Secret',
        distance: '1.5 km from the village',
        price: '$$ (US$70–120)',
        rating: 4.5,
        description: 'Boutique jungle villas with a pool and views of Ella Rock.',
      },
      {
        name: 'Heaven\u2019s Edge',
        distance: 'In the village centre',
        price: '$ (US$30–60)',
        rating: 4.2,
        description: 'Budget guesthouse with legendary mountain-view balcony.',
      },
    ],
    activities: [
      {
        name: 'Hike Little Adam\u2019s Peak',
        category: 'Hiking',
        description: 'An easy 45-minute climb to sweeping views of the valley.',
      },
      {
        name: 'Nine Arch Bridge train spotting',
        category: 'Railway',
        description: 'Watch the blue train cross the iconic viaduct through the jungle.',
      },
      {
        name: 'Tea estate tour at Halpewatte',
        category: 'Culture',
        description: 'Walk a working tea factory and taste Ceylon tea at source.',
      },
    ],
  },
  {
    id: 'yala',
    slug: 'yala',
    name: 'Yala National Park',
    region: 'Southern & Uva Provinces',
    tagline: 'Leopard country on Sri Lanka\u2019s southeast coast',
    image: W('Sri Lankan Leopard - Yala National Park.jpg'),
    shortHistory:
      'Established in 1938, Yala is Sri Lanka\u2019s most visited national park and home to one of the highest leopard densities on Earth.',
    culture:
      'Beyond wildlife, Yala\u2019s landscape hides ancient Buddhist shrines, Sithulpawwa rock temples, and sacred pilgrim trails.',
    fullHistory:
      'Yala was declared a wildlife sanctuary in 1900 and a national park in 1938, protecting 979 square kilometres of scrubland, monsoon forest, and coastal lagoons. The region was once home to ancient kingdoms — the lost city of Magul Maha Viharaya and the rock-temple complex of Sithulpawwa predate the park. Today Yala\u2019s Block I is world-famous for the Sri Lankan leopard, which is sighted here more reliably than almost anywhere else on the planet, alongside elephants, sloth bears, crocodiles, and over 200 bird species.',
    cultureDetail:
      'The park is a pilgrimage of another kind — Sithulpawwa, a 2,000-year-old rock temple inside the reserve, was once home to 12,000 monks. Fishing communities on the coast practice a traditional seasonal life governed by the monsoon, and local villages host elephant-corridor conservation programmes. The combination of safari culture and ancient sacred sites gives Yala a uniquely layered character.',
    bestTime: 'February – June (dry season, best leopard viewing)',
    categories: ['multi-day'],
    hotels: [
      {
        name: 'Wild Coast Tented Lodge',
        distance: 'At the park edge',
        price: '$$$$ (US$500+)',
        rating: 4.8,
        description: 'Iconic luxury tented camp on the beach beside the park.',
      },
      {
        name: 'Jetwing Yala',
        distance: '2 km from the park gate',
        price: '$$$ (US$220–340)',
        rating: 4.5,
        description: 'Eco-lodge with infinity pool and guided safari desk.',
      },
      {
        name: 'Cinnamon Wild Yala',
        distance: '1 km from the park gate',
        price: '$$$ (US$180–280)',
        rating: 4.4,
        description: 'Chalet-style resort with wildlife-themed rooms and pool.',
      },
    ],
    activities: [
      {
        name: 'Morning leopard safari',
        category: 'Safari',
        description: 'Guided 4x4 game drive through Block I, best for leopard sightings.',
      },
      {
        name: 'Visit Sithulpawwa rock temple',
        category: 'Culture',
        description: 'A short detour to the ancient monastery carved into the rock.',
      },
      {
        name: 'Coastal lagoon birding',
        category: 'Nature',
        description: 'Spot painted storks, pelicans, and crocodiles in the park\u2019s lagoons.',
      },
    ],
  },
  {
    id: 'mirissa',
    slug: 'mirissa',
    name: 'Mirissa',
    region: 'Southern Province',
    tagline: 'Whale watching and palm-fringed beaches',
    image: W('Mirissa beach, Srilanka.jpg'),
    shortHistory:
      'Once a quiet fishing village, Mirissa grew into Sri Lanka\u2019s premier beach town and whale-watching base.',
    culture:
      'Life revolves around the harbour — fishermen still launch traditional outrigger boats at dawn, while beach bars and surfers take over by day.',
    fullHistory:
      'For generations, Mirissa was a modest southern fishing village whose residents lived off the sea. In the early 2000s, travellers "discovered" its curved golden bay, and it rapidly became the country\u2019s favourite beach escape. Its real fame came when scientists realised the deep waters just offshore are a year-round home to blue whales — the largest animals ever to have lived. Today Mirissa blends authentic fishing culture with a relaxed surf-and-sun scene, while Cocos (Gama) and the rock-islet of Parrot Rock remain unmissable landmarks.',
    cultureDetail:
      'The harbour remains the beating heart of Mirissa: at dawn, crowds gather to watch fishermen sort the night\u2019s catch and to board whale-watching boats. Buddhist shrines perch on the headlands, and the village celebrates its own perahera festivals. In the evenings, the beach morphs into a string of candlelit seafood grills — a tradition of kottu and fresh crab that defines southern coastal dining.',
    bestTime: 'November – April (calm seas & whale season)',
    categories: ['beach-trips'],
    hotels: [
      {
        name: 'Weligama Bay Marriott',
        distance: '8 km north',
        price: '$$$$ (US$300–500)',
        rating: 4.7,
        description: 'Beachfront resort with multiple pools and watersports.',
      },
      {
        name: 'Mandara Resort Mirissa',
        distance: 'On the beach',
        price: '$$ (US$90–150)',
        rating: 4.3,
        description: 'Garden resort steps from Mirissa\u2019s main beach.',
      },
      {
        name: 'Surf Hostel Mirissa',
        distance: '300 m from the beach',
        price: '$ (US$15–35)',
        rating: 4.4,
        description: 'Social backpacker favourite with board hire and lessons.',
      },
    ],
    activities: [
      {
        name: 'Blue whale watching',
        category: 'Wildlife',
        description: 'Morning boat trips to spot blue whales, sperm whales, and dolphins.',
      },
      {
        name: 'Surf at Coconut Tree Hill',
        category: 'Surfing',
        description: 'Rent a board and ride gentle waves at the famous palm-lined point.',
      },
      {
        name: 'Sunset at Parrot Rock',
        category: 'Viewpoint',
        description: 'Climb the tidal rock islet for panoramic ocean views at golden hour.',
      },
    ],
  },
  {
    id: 'polonnaruwa',
    slug: 'polonnaruwa',
    name: 'Polonnaruwa',
    region: 'North Central Province',
    tagline: 'The medieval capital of kings and colossal Buddhas',
    image: W('Gal Viharaya, Ancient City of Polonnaruwa, Sri Lanka.jpg'),
    shortHistory:
      'Polonnaruwa was Sri Lanka\u2019s second royal capital (11th–13th century), a planned city of palaces, shrines, and giant stone Buddhas.',
    culture:
      'Its Gal Viharaya rock carvings and ancient stupas remain active pilgrimage sites, connecting modern Buddhists to the medieval kingdom.',
    fullHistory:
      'After the fall of Anuradhapura in 993 AD, Polonnaruwa became the island\u2019s capital under the Chola invaders, then blossomed under Sinhalese kings such as Vijayabahu I and the great Parakramabahu I (1153–1186). Parakramabahu built vast irrigation works — including the giant Parakrama Samudra "Sea of Parakrama" reservoir — that turned the dry zone into a breadbasket. The city was abandoned in the late 13th century after repeated invasions and the shift of power to the southwest. Its ruins, preserved under forest for 700 years, now form a UNESCO World Heritage Site and one of the best-preserved planned cities in South Asia.',
    cultureDetail:
      'The heart of Polonnaruwa is Gal Viharaya, four colossal Buddha images — including a serene 14-metre reclining Buddha — carved directly into a single granite cliff in the 12th century. The city also holds the Sacred Quadrangle with its Vatadage, the Royal Palace of Parakramabahu, and the beautiful Rankoth Vehera stupa. Monks and pilgrims still visit these shrines, keeping a 900-year-old tradition of veneration alive.',
    bestTime: 'June – September (dry, cooler months)',
    categories: ['multi-day', 'day-attractions'],
    hotels: [
      {
        name: 'The Lake Hotel',
        distance: 'At Parakrama Samudra',
        price: '$$ (US$70–120)',
        rating: 4.2,
        description: 'Quiet lakefront hotel with sunrise views over the ancient reservoir.',
      },
      {
        name: 'Giritale Hotel',
        distance: '8 km east',
        price: '$$ (US$60–100)',
        rating: 4.0,
        description: 'Comfortable base near the ruins with a pool and garden.',
      },
      {
        name: 'Deer Park Hotel',
        distance: '5 km from the ruins',
        price: '$$$ (US$140–220)',
        rating: 4.5,
        description: 'Luxury eco-hotel on the edge of the ancient city.',
      },
    ],
    activities: [
      {
        name: 'Cycle the ancient city',
        category: 'Heritage',
        description: 'Rent a bike and tour the vast archaeological park at your own pace.',
      },
      {
        name: 'Meditate at Gal Viharaya',
        category: 'Culture',
        description: 'Sit quietly before the great rock-cut Buddhas at dawn.',
      },
      {
        name: 'Watch sunrise over Parakrama Samudra',
        category: 'Nature',
        description: 'A peaceful morning by the 12th-century sea of Parakrama.',
      },
    ],
  },
  {
    id: 'anuradhapura',
    slug: 'anuradhapura',
    name: 'Anuradhapura',
    region: 'North Central Province',
    tagline: 'The sacred first capital and the world\u2019s oldest tree',
    image: W('Ruwanwelisaya Stupa Anuradhapura.jpg'),
    shortHistory:
      'Founded in the 4th century BC, Anuradhapura was Sri Lanka\u2019s first great capital, reigning for 1,400 years of Buddhist civilisation.',
    culture:
      'Pilgrims in white still circle the great dagobas, and the sacred Bodhi tree planted in 288 BC is the oldest documented tree on Earth.',
    fullHistory:
      'Anuradhapura was established around 380 BC and grew into one of the ancient world\u2019s greatest cities, its kings ruling for over 1,300 years. It became the cradle of Sinhalese Buddhist civilisation after the arrival of Buddhism in 247 BC, when the sapling of the Bodhi tree under which the Buddha attained enlightenment was brought from India and planted here — where it still grows today. The city was planned around colossal stupas, monastic complexes, and vast artificial reservoirs called tanks. Repeated South Indian invasions led to its abandonment in the 10th century, and the jungle reclaimed it for a millennium. Today its 40-square-kilometre sacred zone is a UNESCO World Heritage Site and a living pilgrimage centre.',
    cultureDetail:
      'The towering Ruwanwelisaya stupa — one of the largest brick monuments in the world — and the Jetavanaramaya mark the city\u2019s skyline. Every full-moon poya day, thousands of pilgrims in white walk barefoot around the dagobas, carrying lotus flowers. The Sri Maha Bodhi tree has been guarded continuously by monks for more than 2,300 years, an unbroken thread of Buddhist devotion.',
    bestTime: 'June – September (cooler dry season)',
    categories: ['multi-day', 'day-attractions'],
    hotels: [
      {
        name: 'Ulagalla Resort',
        distance: '15 km from the city',
        price: '$$$$ (US$350–550)',
        rating: 4.8,
        description: 'Luxury eco-villa resort with private plunge pools.',
      },
      {
        name: 'London Palace Hotel',
        distance: 'In the city centre',
        price: '$ (US$25–50)',
        rating: 4.0,
        description: 'Budget-friendly base close to the sacred city.',
      },
      {
        name: 'The Lakeside',
        distance: '3 km from the ruins',
        price: '$$ (US$60–100)',
        rating: 4.1,
        description: 'Relaxed guesthouse with garden views over a tank.',
      },
    ],
    activities: [
      {
        name: 'Visit the sacred Bodhi tree',
        category: 'Pilgrimage',
        description: 'Pay respects at the world\u2019s oldest documented tree.',
      },
      {
        name: 'Sunset at Ruwanwelisaya',
        category: 'Heritage',
        description: 'See the great white stupa glow gold as pilgrims gather at dusk.',
      },
      {
        name: 'Explore Isurumuniya rock temple',
        category: 'Culture',
        description: 'Ancient carvings and a cave monastery by the Tissa Wewa tank.',
      },
    ],
  },
  {
    id: 'nuwara-eliya',
    slug: 'nuwara-eliya',
    name: 'Nuwara Eliya',
    region: 'Central Province',
    tagline: 'Little England in the heart of Ceylon tea country',
    image: W('Tea plantations near Nuwara Eliya, Sri Lanka - panoramio.jpg'),
    shortHistory:
      'Founded by British planters in the 1820s, this hill station at 1,868 metres became "Little England" amid the tea estates.',
    culture:
      'Georgian-style houses, golf courses, and rose gardens meet Tamil tea-plucking heritage in this cool highland town.',
    fullHistory:
      'Nuwara Eliya — meaning "City of Light" — was discovered as a retreat by British colonists in 1819 and developed through the 19th century as a hill station to escape the coastal heat. When coffee blight struck in the 1870s, planters switched to tea, and the surrounding hills were carpeted with estates that made Ceylon tea world-famous. The British laid out the town with mock-Tudor bungalows, a golf course, a racecourse, and a grand post office, earning the nickname "Little England". After independence, the town remained the heart of Sri Lanka\u2019s tea industry, home to the Tamil Tamil plantation community whose culture now defines the region.',
    cultureDetail:
      'The town\u2019s colonial architecture survives in the hill-club, the 1910 post office, and manicured Victoria Park. Surrounding estates like Pedro and Bluefield offer factory tours where visitors watch tea leaves wither, roll, and oxidise before tasting. The Tamil estate communities celebrate festivals like Thai Pongal, and their brightly dressed tea pluckers — baskets on their backs — remain the enduring image of the highlands.',
    bestTime: 'March – May (warmest, clearest)',
    categories: ['multi-day', 'ayurveda-wellness'],
    hotels: [
      {
        name: 'Grand Hotel Nuwara Eliya',
        distance: 'In the town centre',
        price: '$$$ (US$140–240)',
        rating: 4.3,
        description: 'Historic 19th-century colonial manor with manicured gardens.',
      },
      {
        name: 'Heritance Tea Factory',
        distance: '12 km from town',
        price: '$$$ (US$200–320)',
        rating: 4.6,
        description: 'A converted 1930s tea factory perched amid the estates.',
      },
      {
        name: 'Jetwing Warwick Gardens',
        distance: '9 km from town',
        price: '$$$ (US$160–260)',
        rating: 4.5,
        description: 'Elegant boutique hotel set in its own tea estate.',
      },
    ],
    activities: [
      {
        name: 'Tea factory tour & tasting',
        category: 'Culture',
        description: 'Watch the full tea-making process at a working factory.',
      },
      {
        name: 'Hike to Horton Plains',
        category: 'Hiking',
        description: 'Dawn trek to World\u2019s End precipice, a 900-metre sheer drop.',
      },
      {
        name: 'Golf at Nuwara Eliya Club',
        category: 'Leisure',
        description: 'Play one of the oldest golf courses in Asia at 1,800 m.',
      },
    ],
  },
  {
    id: 'dambulla',
    slug: 'dambulla',
    name: 'Dambulla',
    region: 'Central Province',
    tagline: 'The golden cave temple of 153 Buddha statues',
    image: W('Dambulla Golden Buddha Statue.jpg'),
    shortHistory:
      'Dambulla is a 2,200-year-old cave monastery complex, the largest and best-preserved cave-temple site in Sri Lanka.',
    culture:
      'Five cave shrines filled with murals and Buddha images have drawn pilgrims for over two millennia, crowned by a modern golden Buddha.',
    fullHistory:
      'The Dambulla cave temple — also known as the Golden Temple of Dambulla — began as a rock shelter refuge when King Valagamba was exiled here in the 1st century BC. After reclaiming his throne, he converted the caves into a monastery in gratitude. Over the following centuries, successive kings expanded the five principal caves, decorating them with some 2,100 square metres of murals and over 150 Buddha statues — including a 10-metre reclining Buddha. The complex sits on the summit of a 160-metre rock that overlooks the plains, and was declared a UNESCO World Heritage Site in 1991, remaining one of the holiest pilgrimage destinations in the country.',
    cultureDetail:
      'Every cave has its own character: the first holds a 14-metre reclining Buddha; the second, the largest, houses 56 statues in an ancient assembly hall with a ceiling of continuous painted murals depicting the life of the Buddha. The modern Golden Temple — a colossal standing Buddha at the base of the rock — was funded by Japanese donations in the 20th century, symbolising the site\u2019s living Buddhist tradition.',
    bestTime: 'January – April (dry, cooler evenings)',
    categories: ['day-attractions', 'ayurveda-wellness'],
    hotels: [
      {
        name: 'Jetwing Lake Dambulla',
        distance: '6 km from the caves',
        price: '$$$ (US$150–240)',
        rating: 4.5,
        description: 'Resort overlooking the lake with views of the rock.',
      },
      {
        name: 'Amaya Lake',
        distance: '10 km away',
        price: '$$$ (US$130–200)',
        rating: 4.3,
        description: 'Serene lakeside resort with Ayurveda spa.',
      },
      {
        name: 'Kandalama Eco Lodge',
        distance: '8 km away',
        price: '$$ (US$60–110)',
        rating: 4.2,
        description: 'Eco-friendly lodge amid the trees with pool and guided walks.',
      },
    ],
    activities: [
      {
        name: 'Climb to the cave temples',
        category: 'Heritage',
        description: 'Ascend the rock and tour five painted cave shrines.',
      },
      {
        name: 'Sunset from the rock summit',
        category: 'Viewpoint',
        description: 'Golden-hour views across the plains to Sigiriya.',
      },
      {
        name: 'Visit a local spice garden',
        category: 'Culture',
        description: 'Taste cinnamon, cardamom, and Ayurveda herbs grown nearby.',
      },
    ],
  },
]

export function getDestination(slug: string | undefined): Destination | undefined {
  return destinations.find((d) => d.slug === slug)
}
