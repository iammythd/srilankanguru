import Link from 'next/link'
import { COMPANY } from '@/lib/config'

const exploreLinks = [
  { href: '/explore', label: 'Destinations' },
  { href: '/plan', label: 'Plan Your Trip' },
  { href: '/journeys', label: 'My Journeys' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
]

export default function Footer() {
  return (
    <footer className="bg-jungle text-sand">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="font-sans text-lg font-bold tracking-[0.06em]">
            Sri Lankan&nbsp;<span className="font-light text-sand">Guru</span>
          </p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-sand/70">{COMPANY.description}</p>
          <a
            href={COMPANY.social.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm text-sand/80 transition-colors hover:text-sand"
          >
            <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M13.5 21v-7h2.4l.4-3h-2.8V9.1c0-.9.3-1.5 1.6-1.5h1.3V4.9c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8V11H8v3h2.5v7h3Z" />
            </svg>
            Facebook
          </a>
        </div>

        <nav aria-label="Footer navigation">
          <p className="kicker !text-sand/60">Explore</p>
          <ul className="mt-5 space-y-2.5 text-sm">
            {exploreLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-sand/80 transition-colors hover:text-sand">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="kicker !text-sand/60">Contact</p>
          <address className="mt-5 space-y-2 text-sm not-italic text-sand/80">
            <p>
              {COMPANY.legalName}
              <br />
              {COMPANY.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>
            {COMPANY.phones.map((phone) => (
              <p key={phone}>
                <a href={`tel:${phone.replace(/\s/g, '')}`} className="transition-colors hover:text-sand">
                  {phone}
                </a>
              </p>
            ))}
            <p>
              <a href={`mailto:${COMPANY.email}`} className="transition-colors hover:text-sand">
                {COMPANY.email}
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-6 py-6 text-xs text-sand/50">
          © {new Date().getFullYear()} {COMPANY.name} ({COMPANY.legalName}). All rights reserved.
        </p>
      </div>
    </footer>
  )
}
