'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

function AuthPanel() {
  const router = useRouter()
  const params = useSearchParams()
  const next = params.get('next') ?? '/journeys'
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [unconfigured, setUnconfigured] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setUnconfigured(true)
      return
    }
    setBusy(true)
    setError(null)
    setMessage(null)
    const { error } =
      mode === 'signin'
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password })
    setBusy(false)
    if (error) {
      setError(error.message)
      return
    }
    if (mode === 'signup') {
      setMessage('Check your inbox to confirm your account, then sign in.')
      setMode('signin')
    } else {
      router.push(next)
      router.refresh()
    }
  }

  async function handleGoogle() {
    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setUnconfigured(true)
      return
    }
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    })
  }

  const inputClass =
    'w-full rounded-lg border border-sand-dark/40 bg-white px-4 py-3 text-sm focus:border-terracotta'

  return (
    <div className="mx-auto max-w-md px-6 pb-28 pt-40">
      <p className="kicker">My Journeys</p>
      <h1 className="display mt-3 text-4xl text-ink sm:text-5xl">
        {mode === 'signin' ? 'Welcome back' : 'Create your account'}
      </h1>
      <p className="mt-3 text-base text-muted">
        Sign in to save itineraries, download PDFs and email your journeys.
      </p>

      {unconfigured && (
        <p className="mt-6 rounded-lg bg-terracotta/10 px-4 py-3 text-sm text-terracotta">
          Authentication is not configured on this deployment. Set
          NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to enable accounts.
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-8 space-y-4 rounded-xl border border-sand-dark/30 bg-white p-7 shadow-card">
        <div>
          <label htmlFor="auth-email" className="mb-1.5 block text-sm font-semibold text-ink">Email</label>
          <input id="auth-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} autoComplete="email" />
        </div>
        <div>
          <label htmlFor="auth-password" className="mb-1.5 block text-sm font-semibold text-ink">Password</label>
          <input
            id="auth-password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          />
        </div>
        {error && <p className="text-sm text-terracotta">{error}</p>}
        {message && <p className="text-sm text-tea">{message}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-jungle py-3.5 text-sm font-semibold uppercase tracking-[0.14em] text-sand transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-50"
        >
          {busy ? 'One moment…' : mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>
        <button
          type="button"
          onClick={handleGoogle}
          className="w-full rounded-full border border-sand-dark/40 py-3 text-sm font-semibold text-ink transition-colors hover:bg-cloud"
        >
          Continue with Google
        </button>
        <p className="text-center text-sm text-muted">
          {mode === 'signin' ? (
            <>
              New here?{' '}
              <button type="button" onClick={() => setMode('signup')} className="font-semibold text-ocean hover:text-terracotta">
                Create an account
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button type="button" onClick={() => setMode('signin')} className="font-semibold text-ocean hover:text-terracotta">
                Sign in
              </button>
            </>
          )}
        </p>
      </form>
    </div>
  )
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="py-48 text-center text-muted">Loading…</div>}>
      <AuthPanel />
    </Suspense>
  )
}
