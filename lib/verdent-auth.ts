'use client'

import { createVerdentAuth, type VerdentAuthClient } from '@verdent/auth-js'
import { getSupabaseBrowserClient } from '@/lib/supabase/client'

let auth: VerdentAuthClient | null = null

/**
 * Verdent-managed sign-in (Google + email/password, verification, recovery).
 * Shares the app's cookie-based Supabase browser client so sessions are
 * visible to middleware and server components. Returns null when Supabase
 * is not configured so the UI can degrade honestly.
 */
export function getVerdentAuth(): VerdentAuthClient | null {
  if (auth) return auth
  const supabase = getSupabaseBrowserClient()
  if (!supabase) return null
  const authorizeUrl = process.env.NEXT_PUBLIC_VERDENT_OAUTH_INITIATE_URL
  auth = createVerdentAuth(
    authorizeUrl ? { supabase, oauth: { authorizeUrl } } : { supabase },
  )
  return auth
}
