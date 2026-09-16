import { createClient, type SupabaseClient } from '@supabase/supabase-js'

/**
 * Service-role client for privileged server-side operations ONLY
 * (e.g. storage uploads from route handlers). Never import from client code.
 */
export function getSupabaseAdminClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SECRET_KEY
  if (!url || !key) return null
  return createClient(url, key, { auth: { persistSession: false } })
}
