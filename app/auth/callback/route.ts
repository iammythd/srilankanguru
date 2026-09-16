import { NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

/** OAuth callback: exchanges the auth code for a session cookie, then redirects. */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/journeys'

  if (code) {
    const supabase = await getSupabaseServerClient()
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code)
      if (!error) return NextResponse.redirect(`${origin}${next}`)
    }
  }
  return NextResponse.redirect(`${origin}/auth?next=${encodeURIComponent(next)}`)
}
