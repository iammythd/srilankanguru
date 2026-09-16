'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useReducedMotion, useIsCompact } from '@/hooks/useMedia'

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
  const heroGoneRef = useRef(false)

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
        return <IslandScene mode={mode} compact={compact} />
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
type IslandProps = SceneProps & { compact: boolean }

function Layer({ depth, className, children, style }: { depth: number; className?: string; children?: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div data-depth={depth} className={className} style={style}>
      {children}
    </div>
  )
}

/* ---------------- Scene 1 — Island (editorial hero) ---------------- */
function IslandScene({ mode, compact }: IslandProps) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-jungle">
      {/* photographic base — Sigiriya above the royal gardens */}
      <Layer depth={0.1} className="absolute inset-0">
        <img
          src={img('Sigiriya.jpg', 1600)}
          alt=""
          className="h-full w-full scale-[1.06] object-cover"
        />
      </Layer>

      {/* cinematic colour grade: cool jungle cast + warm dusk from the base */}
      <div className="absolute inset-0 bg-[#0c2a24]/35 mix-blend-multiply" aria-hidden />
      <div
        className="absolute inset-0 bg-[radial-gradient(120%_90%_at_70%_10%,rgba(255,214,150,0.18)_0%,rgba(0,0,0,0)_55%)]"
        aria-hidden
      />
      {/* legibility scrim — bottom-weighted, single direction */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-[#0b1a15]/92 via-[#0b1a15]/35 to-[#0b1a15]/10"
        aria-hidden
      />

      {/* vertical marginalia — desktop only */}
      {!compact && (
        <div className="absolute right-8 top-1/2 hidden -translate-y-1/2 lg:block" aria-hidden>
          <p className="text-[0.68rem] font-medium uppercase tracking-[0.42em] text-white/50 [writing-mode:vertical-rl]">
            The Paradise Island — Indian Ocean
          </p>
        </div>
      )}

      {/* editorial content — bottom-anchored, left-set */}
      <div
        className={`absolute inset-0 flex flex-col justify-end px-6 pb-24 sm:px-12 lg:px-24 ${
          mode === 'static' ? '' : 'pb-28'
        }`}
      >
        <div className="flex items-center gap-4">
          <span className="h-px w-12 bg-sand/70" aria-hidden />
          <p className="!text-sand/90">
            Sri Lankan Guru<span className="hidden sm:inline"> · Destination Management Company</span>
          </p>
        </div>

        <h1 className="display-hero mt-6 text-[17.5vw] text-white drop-shadow-[0_6px_30px_rgba(0,0,0,0.45)] sm:text-[13vw] lg:text-[10.5rem]">
          Sri Lanka
        </h1>

        <p className="display-italic mt-5 max-w-2xl text-2xl text-sand/95 sm:text-3xl lg:text-4xl">
          An island of ancient kingdoms, misty mountains, wild horizons &amp; warm seas.
        </p>

        <div className="mt-10 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-8">
          <Link
            href="/plan"
            className="rounded-full bg-terracotta px-9 py-4 text-sm font-semibold uppercase tracking-[0.16em] text-white shadow-editorial transition-transform hover:scale-[1.03] active:scale-95"
          >
            Plan My Journey
          </Link>
          <Link
            href="/explore"
            className="group inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.16em] text-white/90 transition-colors hover:text-sand"
          >
            Explore the Island
            <span
              aria-hidden
              className="inline-block transition-transform group-hover:translate-x-1.5"
            >
              &rarr;
            </span>
          </Link>
        </div>
      </div>

      {/* bottom folio bar */}
      <div className="absolute inset-x-0 bottom-0 border-t border-white/15 px-6 py-4 sm:px-12 lg:px-24">
        <div className="flex items-center justify-between text-[0.65rem] font-medium uppercase tracking-[0.28em] text-white/55">
          <span>6.9271° N · 79.8612° E</span>
          <span className="hidden items-center gap-3 sm:flex">
            <span className="relative block h-8 w-px overflow-hidden bg-white/25">
              <span className="scroll-cue absolute inset-x-0 top-0 h-3 bg-sand" />
            </span>
            Scroll
          </span>
          <span className="hidden sm:block">Customized journeys, locally guided</span>
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
          main={{ src: img('Kandy Sri Lanka Temple of the tooth.jpg'), alt: 'The Temple of the Tooth in Kandy' }}
          secondary={{ src: img('Ruwanwelisaya Stupa Anuradhapura.jpg'), alt: 'The Ruwanwelisaya stupa at Anuradhapura' }}
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

function img(file: string, width = 1200) {
  return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=${width}`
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
