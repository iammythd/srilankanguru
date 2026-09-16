'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion, useIsCompact } from '@/hooks/useMedia'

const IslandScene3D = dynamic(() => import('@/components/home/IslandScene3D'), { ssr: false })

const SCENE_COUNT = 6
const clamp01 = (v: number) => Math.min(1, Math.max(0, v))
const smoothstep = (a: number, b: number, v: number) => {
  const x = clamp01((v - a) / (b - a))
  return x * x * (3 - 2 * x)
}

/**
 * Cinematic homepage — a sticky visual stage with six scroll-driven scenes:
 * Island → Culture → Hill Country → Wildlife → Coast → Personal CTA.
 * Motion is RAF-lerped; pointer parallax and 3D are disabled on compact
 * viewports and under prefers-reduced-motion (static stacked sections then).
 */
export default function CinematicHome() {
  const reduced = useReducedMotion()
  const compact = useIsCompact(768)
  const wrapRef = useRef<HTMLDivElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const sceneRefs = useRef<(HTMLDivElement | null)[]>([])
  const [heroGone, setHeroGone] = useState(false)
  const [enable3D, setEnable3D] = useState(false)
  const heroGoneRef = useRef(false)

  useEffect(() => {
    if (!reduced && !compact) {
      const raf = requestAnimationFrame(() => setEnable3D(true))
      return () => cancelAnimationFrame(raf)
    }
    setEnable3D(false)
  }, [reduced, compact])

  useEffect(() => {
    if (reduced) return
    const wrap = wrapRef.current
    if (!wrap) return

    let smooth = 0
    let target = 0
    let mx = 0
    let my = 0
    let tmx = 0
    let tmy = 0
    let raf = 0

    const layers: { el: HTMLElement; depth: number; scene: number }[] = []
    sceneRefs.current.forEach((scene, i) => {
      if (!scene) return
      scene.querySelectorAll<HTMLElement>('[data-depth]').forEach((el) => {
        layers.push({ el, depth: Number.parseFloat(el.dataset.depth ?? '0'), scene: i })
      })
    })

    const update = () => {
      const stage = stageRef.current
      if (!stage) return
      const dist = Math.max(1, wrap.offsetHeight - window.innerHeight)
      const p = clamp01(smooth / dist)

      if (p > 0.1 !== heroGoneRef.current) {
        heroGoneRef.current = p > 0.1
        setHeroGone(p > 0.1)
      }

      for (let i = 0; i < SCENE_COUNT; i++) {
        const scene = sceneRefs.current[i]
        if (!scene) continue
        const t = clamp01((p - i / SCENE_COUNT) * SCENE_COUNT)
        const enter = i === 0 ? 1 : smoothstep(0, 0.16, t)
        const exit = i === SCENE_COUNT - 1 ? 0 : smoothstep(0.84, 1, t)
        const opacity = enter * (1 - exit)
        const ty = (1 - enter) * 70 - exit * 90
        const scale = 1 - exit * 0.04 + (1 - enter) * 0.02
        scene.style.opacity = opacity.toFixed(3)
        scene.style.visibility = opacity < 0.01 ? 'hidden' : 'visible'
        scene.style.transform = `translate3d(0, ${ty.toFixed(1)}px, 0) scale(${scale.toFixed(4)})`
        scene.style.zIndex = String(i + 1)
      }

      for (const { el, depth, scene } of layers) {
        const t = clamp01((p - scene / SCENE_COUNT) * SCENE_COUNT)
        const drift = t * depth * -130
        el.style.transform = `translate3d(${(mx * depth * 26).toFixed(1)}px, ${(my * depth * 18 + drift).toFixed(1)}px, 0)`
      }
    }

    const loop = () => {
      raf = 0
      const dist = Math.max(1, wrap.offsetHeight - window.innerHeight)
      target = Math.min(dist, Math.max(0, -wrap.getBoundingClientRect().top))
      smooth += (target - smooth) * 0.13
      if (Math.abs(smooth - target) < 0.05) smooth = target
      mx += (tmx - mx) * 0.1
      my += (tmy - my) * 0.1
      update()
      if (
        Math.abs(smooth - target) > 0.05 ||
        Math.abs(mx - tmx) > 0.001 ||
        Math.abs(my - tmy) > 0.001
      ) {
        raf = requestAnimationFrame(loop)
      }
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const onPointer = (e: PointerEvent) => {
      if (compact) return
      tmx = e.clientX / window.innerWidth - 0.5
      tmy = e.clientY / window.innerHeight - 0.5
      onScroll()
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    if (!compact) window.addEventListener('pointermove', onPointer, { passive: true })
    return () => {
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [reduced, compact])

  if (reduced) {
    return (
      <div aria-label="Sri Lanka introduction">
        {SCENES.map((_, i) => (
          <section key={i} className="relative flex min-h-[92vh] items-center overflow-hidden">
            {renderScene(i, 'static')}
          </section>
        ))}
      </div>
    )
  }

  return (
    <>
      <div ref={wrapRef} className="relative" style={{ height: `${SCENE_COUNT * 100}vh` }}>
        <div
          ref={stageRef}
          className="sticky top-0 h-screen overflow-hidden"
          aria-label="Sri Lanka cinematic introduction"
        >
          {SCENES.map((_, i) => (
            <div
              key={i}
              ref={(el) => {
                sceneRefs.current[i] = el
              }}
              className="absolute inset-0 will-change-transform"
              style={{ opacity: i === 0 ? 1 : 0, visibility: i === 0 ? 'visible' : 'hidden' }}
            >
              {renderScene(i, 'dynamic')}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile sticky CTA */}
      <div
        className={`fixed inset-x-4 bottom-4 z-40 transition-all duration-500 lg:hidden ${
          heroGone ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-24 opacity-0'
        }`}
      >
        <Link
          href="/plan"
          className="block rounded-full bg-terracotta py-4 text-center text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-editorial"
        >
          Build My Journey
        </Link>
      </div>
    </>
  )

  function renderScene(i: number, mode: 'dynamic' | 'static') {
    switch (i) {
      case 0:
        return <IslandScene mode={mode} compact={compact} enable3D={enable3D} />
      case 1:
        return <CultureScene mode={mode} />
      case 2:
        return <HillScene mode={mode} />
      case 3:
        return <WildlifeScene mode={mode} />
      case 4:
        return <CoastScene mode={mode} />
      case 5:
        return <FinalScene mode={mode} />
      default:
        return null
    }
  }
}

type SceneProps = { mode: 'dynamic' | 'static' }
type IslandProps = SceneProps & { compact: boolean; enable3D: boolean }

function Layer({ depth, className, children, style }: { depth: number; className?: string; children?: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div data-depth={depth} className={className} style={style}>
      {children}
    </div>
  )
}

/* ---------------- Scene 1 — Island ---------------- */
function IslandScene({ mode, compact, enable3D }: IslandProps) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-gradient-to-b from-[#0c4a5a] via-[#4b7a6e] to-[#c9b088]">
      <Layer depth={0.15} className="absolute -top-[12%] left-[62%] h-[46vh] w-[46vh] rounded-full bg-[#f2e3c2] opacity-80 blur-[2px]" style={{ mixBlendMode: 'soft-light' }} />
      {/* distant mountains */}
      <Layer depth={0.35} className="absolute bottom-[22%] inset-x-0">
        <svg viewBox="0 0 1440 220" className="w-full text-[#3d5c50]" preserveAspectRatio="none" aria-hidden>
          <path fill="currentColor" d="M0 220 L0 150 120 90 240 140 360 60 480 130 600 80 720 150 840 100 960 150 1080 70 1200 130 1320 95 1440 145 1440 220 Z" />
        </svg>
      </Layer>
      {/* tea-country silhouettes */}
      <Layer depth={0.55} className="absolute bottom-[10%] inset-x-0">
        <svg viewBox="0 0 1440 160" className="w-full text-[#2c4a3e]" preserveAspectRatio="none" aria-hidden>
          <path fill="currentColor" d="M0 160 L0 100 Q 180 60 360 95 T 720 85 T 1080 100 T 1440 85 L1440 160 Z" />
        </svg>
      </Layer>
      {/* palms foreground */}
      {!compact && (
        <Layer depth={0.9} className="absolute bottom-[-2%] right-[-3%] w-[42vw] max-w-[560px] text-[#10221c]">
          <svg viewBox="0 0 200 200" aria-hidden className="w-full">
            <g fill="currentColor">
              <rect x="96" y="80" width="8" height="120" rx="4" />
              <path d="M100 82 C 70 70 50 74 34 88 C 58 78 78 80 100 88 Z" />
              <path d="M100 82 C 130 70 150 74 166 88 C 142 78 122 80 100 88 Z" />
              <path d="M100 84 C 84 60 66 52 44 54 C 70 58 86 68 98 88 Z" />
              <path d="M100 84 C 116 60 134 52 156 54 C 130 58 114 68 102 88 Z" />
              <path d="M100 80 C 96 56 100 40 100 30 C 102 44 104 60 104 80 Z" />
            </g>
          </svg>
        </Layer>
      )}
      {/* ocean band */}
      <Layer depth={0.25} className="absolute bottom-0 inset-x-0 h-[16%] bg-gradient-to-b from-[#0c4a5a]/0 to-[#0c4a5a]/70" />

      {enable3D && (
        <Layer depth={0.45} className="absolute inset-0">
          <IslandScene3D />
        </Layer>
      )}

      <div
        className={`absolute inset-0 flex flex-col items-center justify-center px-6 text-center ${
          mode === 'static' ? '' : 'pt-[8vh]'
        }`}
      >
        <p className="kicker !text-sand drop-shadow-[0_2px_8px_rgba(0,0,0,0.4)]">Sri Lankan Guru</p>
        <h1 className="display mt-5 text-[16vw] leading-[0.95] text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)] sm:text-[11vw] lg:text-[9rem]">
          SRI LANKA
        </h1>
        <p className="mt-6 max-w-xl text-balance text-base font-medium text-white/90 drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)] sm:text-lg">
          An island of ancient kingdoms, misty mountains, wild horizons and warm seas.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <Link
            href="/plan"
            className="rounded-full bg-terracotta px-8 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-editorial transition-transform hover:scale-[1.03] active:scale-95"
          >
            Plan My Journey
          </Link>
          <Link
            href="/explore"
            className="rounded-full border border-white/70 px-8 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm transition-colors hover:bg-white/15"
          >
            Explore the Island
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Scene 2 — Culture & Heritage ---------------- */
function CultureScene({ mode }: SceneProps) {
  return (
    <SceneShell bg="bg-gradient-to-b from-[#e9e2d2] via-[#efe9da] to-[#e2d7c0]">
      <div className="grid items-center gap-10 px-6 lg:grid-cols-2 lg:px-24">
        <div className={mode === 'static' ? '' : ''}>
          <p className="kicker">Culture &amp; Heritage</p>
          <h2 className="display mt-4 text-5xl text-ink sm:text-6xl">Kingdoms in stone,<br />two thousand years deep</h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
            Climb a sky palace at dawn, stand before granite Buddhas carved from a single
            cliff, and walk sacred cities where pilgrims have kept vigil since 288 BC.
            The Cultural Triangle is Sri Lanka&rsquo;s open-air museum of kingdoms.
          </p>
          <Link href="/explore?theme=Culture+%26+Heritage" className="mt-8 inline-block text-sm font-semibold uppercase tracking-[0.14em] text-ocean transition-colors hover:text-terracotta">
            Discover heritage &rarr;
          </Link>
        </div>
        <Collage
          main={{ src: img('Lion Rock - Sigiriya, Sri Lanka.jpg'), alt: 'Sigiriya Lion Rock rising above the forest canopy' }}
          secondary={{ src: img('Kandy Sri Lanka Temple of the tooth.jpg'), alt: 'The Temple of the Tooth in Kandy' }}
          caption="Sigiriya · Kandy · Anuradhapura · Polonnaruwa"
        />
      </div>
    </SceneShell>
  )
}

/* ---------------- Scene 3 — Hill Country ---------------- */
function HillScene({ mode }: SceneProps) {
  return (
    <SceneShell bg="bg-gradient-to-b from-[#dfe8e4] via-[#e8efe9] to-[#c9d8cd]">
      <div className="grid items-center gap-10 px-6 lg:grid-cols-2 lg:px-24">
        <Collage
          main={{ src: img('Tea plantations near Nuwara Eliya, Sri Lanka - panoramio.jpg'), alt: 'Tea plantations rolling over the hills near Nuwara Eliya' }}
          secondary={{ src: img('Nine Arches Bridge in Ella.jpg'), alt: 'The Nine Arch Bridge at Ella framed by jungle' }}
          caption="Nuwara Eliya · Ella · Horton Plains"
          flip
        />
        <div>
          <p className="kicker">Hill Country</p>
          <h2 className="display mt-4 text-5xl text-ink sm:text-6xl">Green cathedrals<br />in the clouds</h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
            Ride the blue train through emerald tea estates, wake above the clouds at
            World&rsquo;s End, and watch waterfalls braid their way down the highlands.
            Cool air, warm tea, endless horizons.
          </p>
          <Link href="/explore?theme=Scenic" className="mt-8 inline-block text-sm font-semibold uppercase tracking-[0.14em] text-ocean transition-colors hover:text-terracotta">
            See the hill country &rarr;
          </Link>
        </div>
      </div>
    </SceneShell>
  )
}

/* ---------------- Scene 4 — Wildlife ---------------- */
function WildlifeScene({ mode }: SceneProps) {
  return (
    <SceneShell bg="bg-gradient-to-b from-[#2a3b31] via-[#22332a] to-[#17251d]">
      <div className="grid items-center gap-10 px-6 lg:grid-cols-2 lg:px-24">
        <div>
          <p className="kicker !text-sand">Wildlife &amp; Adventure</p>
          <h2 className="display mt-4 text-5xl text-white sm:text-6xl">The wild island</h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/75">
            Dawn jeeps through leopard country, elephant herds against blue mountains,
            blue whales off the deep south. Sri Lanka packs a safari continent into one
            small island.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {['Leopards of Yala', 'Udawalawe herds', 'Blue whales', 'Birding lagoons'].map((chip) => (
              <span key={chip} className="rounded-full border border-white/25 px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] text-white/85">
                {chip}
              </span>
            ))}
          </div>
          <Link href="/explore?theme=Wildlife" className="mt-8 inline-block text-sm font-semibold uppercase tracking-[0.14em] text-sand transition-colors hover:text-terracotta">
            Plan a safari &rarr;
          </Link>
        </div>
        <Collage
          main={{ src: img('Sri Lankan Leopard - Yala National Park.jpg'), alt: 'A Sri Lankan leopard resting in Yala National Park' }}
          secondary={{ src: img('Udawalawe National Park.jpg'), alt: 'Elephants grazing in Udawalawe National Park' }}
          caption="Yala · Udawalawe · Wilpattu"
          dark
        />
      </div>
    </SceneShell>
  )
}

/* ---------------- Scene 5 — Coast ---------------- */
function CoastScene({ mode }: SceneProps) {
  return (
    <SceneShell bg="bg-gradient-to-b from-[#bcd7dc] via-[#cfe4e6] to-[#e8d5b5]">
      <div className="grid items-center gap-10 px-6 lg:grid-cols-2 lg:px-24">
        <Collage
          main={{ src: img('Mirissa beach, Srilanka.jpg'), alt: 'The crescent bay of Mirissa beach with palm trees' }}
          secondary={{ src: img('Galle lighthouse A.jpg'), alt: 'Galle Fort lighthouse above the ramparts' }}
          caption="Mirissa · Galle · Trincomalee · Arugam Bay"
          flip
        />
        <div>
          <p className="kicker">Beaches &amp; Coast</p>
          <h2 className="display mt-4 text-5xl text-ink sm:text-6xl">Warm seas,<br />endless shoreline</h2>
          <p className="mt-6 max-w-md text-base leading-relaxed text-muted">
            Whale-watching bays, surf points that rank among Asia&rsquo;s best, and a
            17th-century fort town breathing sea air. When the season turns, the coast
            follows the sun — south in winter, east in summer.
          </p>
          <Link href="/explore?theme=Beaches" className="mt-8 inline-block text-sm font-semibold uppercase tracking-[0.14em] text-ocean transition-colors hover:text-terracotta">
            Find your beach &rarr;
          </Link>
        </div>
      </div>
    </SceneShell>
  )
}

/* ---------------- Scene 6 — Final CTA ---------------- */
function FinalScene({ mode }: SceneProps) {
  return (
    <div className="relative flex h-full min-h-[92vh] items-center justify-center overflow-hidden bg-jungle">
      <Layer depth={0.3} className="absolute left-1/2 top-1/2 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(12,74,90,0.55)_0%,rgba(16,34,28,0)_65%)]" />
      <Layer depth={0.6} className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black/30 to-transparent" />
      <div className="relative z-10 max-w-3xl px-6 text-center">
        <h2 className="display text-4xl text-white sm:text-6xl">
          Don&rsquo;t just visit Sri Lanka.
          <span className="mt-2 block italic text-sand">Travel it your way.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">
          Sri Lankan Guru creates journeys shaped around your time, interests and pace —
          guided by locals who know every road, season and story.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/plan"
            className="rounded-full bg-terracotta px-9 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white shadow-editorial transition-transform hover:scale-[1.03] active:scale-95"
          >
            Build My Journey
          </Link>
          <Link
            href="/explore"
            className="rounded-full border border-white/40 px-9 py-4 text-sm font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-white/10"
          >
            Explore Sri Lanka
          </Link>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Shared bits ---------------- */
function SceneShell({ bg, children }: { bg: string; children: React.ReactNode }) {
  return <div className={`flex h-full min-h-[92vh] items-center ${bg}`}>{children}</div>
}

function img(file: string) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=1200`
}

function Collage({
  main,
  secondary,
  caption,
  flip,
  dark,
}: {
  main: { src: string; alt: string }
  secondary: { src: string; alt: string }
  caption: string
  flip?: boolean
  dark?: boolean
}) {
  return (
    <div className={`relative mx-auto w-full max-w-lg ${flip ? 'lg:ml-auto' : ''}`}>
      <div data-depth="0.5" className="relative overflow-hidden rounded-2xl shadow-editorial">
        <img src={main.src} alt={main.alt} loading="lazy" className="aspect-[4/3] w-full object-cover" />
      </div>
      <div
        data-depth="0.85"
        className={`absolute -bottom-10 w-44 overflow-hidden rounded-xl border-4 shadow-card sm:w-56 ${
          flip ? '-left-4' : '-right-4'
        } ${dark ? 'border-[#17251d]' : 'border-white'}`}
      >
        <img src={secondary.src} alt={secondary.alt} loading="lazy" className="aspect-[4/3] w-full object-cover" />
      </div>
      <p className={`mt-14 text-center text-xs uppercase tracking-[0.18em] ${dark ? 'text-white/50' : 'text-muted'}`}>
        {caption}
      </p>
    </div>
  )
}

const SCENES = [0, 1, 2, 3, 4, 5]
