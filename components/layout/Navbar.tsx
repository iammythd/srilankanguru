'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

const LINKS = [
  { href: '/explore', label: 'Destinations' },
  { href: '/plan', label: 'Plan Your Trip' },
  { href: '/journeys', label: 'My Journeys' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) return
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null))
    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => setOpen(false), [pathname])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/50 via-black/20 to-transparent"
      />
      <div className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="font-sans text-[15px] font-bold tracking-[0.06em] text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)] sm:text-base"
        >
          Sri Lankan&nbsp;<span className="font-light text-sand">Guru</span>
        </Link>

        <nav aria-label="Main menu" className="hidden items-center gap-8 lg:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname === link.href ? 'page' : undefined}
              className={`text-[13px] font-medium uppercase tracking-[0.14em] transition-opacity hover:opacity-60 ${
                pathname.startsWith(link.href) ? 'text-sand' : 'text-white'
              } drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]`}
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={async () => (await getSupabaseBrowserClient())?.auth.signOut()}
              className="text-[13px] font-medium uppercase tracking-[0.14em] text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)] transition-opacity hover:opacity-60"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/auth"
              className="rounded-full border border-white/60 px-5 py-2 text-[13px] font-medium uppercase tracking-[0.14em] text-white backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              Sign in
            </Link>
          )}
          <Link
            href="/plan"
            className="rounded-full bg-terracotta px-5 py-2.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-white shadow-editorial transition-transform hover:scale-[1.03] active:scale-95"
          >
            Build My Journey
          </Link>
        </nav>

        <button
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-full bg-black/30 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`h-px w-5 bg-white transition-transform ${open ? 'translate-y-[3.5px] rotate-45' : ''}`} />
          <span className={`h-px w-5 bg-white transition-transform ${open ? '-translate-y-[3.5px] -rotate-45' : ''}`} />
        </button>
      </div>

      {open && (
        <nav aria-label="Mobile menu" className="border-t border-white/15 bg-jungle/95 backdrop-blur-md lg:hidden">
          <ul className="mx-auto max-w-7xl space-y-1 px-6 py-4">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-lg px-3 py-3 text-sm font-medium uppercase tracking-[0.14em] text-white hover:bg-white/10"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/auth"
                className="block rounded-lg px-3 py-3 text-sm font-medium uppercase tracking-[0.14em] text-sand hover:bg-white/10"
              >
                Sign in
              </Link>
            </li>
            <li className="pt-2">
              <Link
                href="/plan"
                className="block rounded-full bg-terracotta px-5 py-3 text-center text-sm font-semibold uppercase tracking-[0.14em] text-white"
              >
                Build My Journey
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
