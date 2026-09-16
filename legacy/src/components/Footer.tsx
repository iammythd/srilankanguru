import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-guru-sand/80 bg-guru-sand/40">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 py-12 text-center sm:flex-row sm:justify-between sm:text-left">
        <div>
          <p className="font-display text-xl font-semibold text-guru-text">
            Srilankan<span className="text-guru-teal">Guru</span>
          </p>
          <p className="mt-1 max-w-sm text-sm text-guru-muted">
            Your guide to Sri Lanka&rsquo;s history, culture, and unforgettable journeys.
          </p>
        </div>
        <ul className="flex flex-wrap items-center justify-center gap-6 text-sm text-guru-text">
          <li>
            <Link to="/" className="transition-colors hover:text-guru-prompt">
              Home
            </Link>
          </li>
          <li>
            <Link to="/destinations" className="transition-colors hover:text-guru-prompt">
              Destinations
            </Link>
          </li>
          <li>
            <Link to="/itinerary" className="transition-colors hover:text-guru-prompt">
              Itinerary Builder
            </Link>
          </li>
          <li>
            <Link to="/about" className="transition-colors hover:text-guru-prompt">
              About
            </Link>
          </li>
        </ul>
        <p className="text-xs text-guru-muted">&copy; {new Date().getFullYear()} SrilankanGuru</p>
      </div>
    </footer>
  )
}
