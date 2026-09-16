/** Feature-configuration checks. Keys themselves are never read on the client. */

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  )
}

export function hasServiceCredentials(): boolean {
  return Boolean(process.env.SUPABASE_SECRET_KEY)
}

export function hasClaudeKey(): boolean {
  return Boolean(process.env.CLAUDE_API_KEY)
}

export function hasEmailKey(): boolean {
  return Boolean(process.env.EMAIL_API_KEY)
}

export const COMPANY = {
  name: 'Sri Lankan Guru',
  legalName: 'Lanka Tour Services',
  address: ['392/A/1 New Kandy Road', 'Malabe, Colombo', 'Sri Lanka'],
  phones: ['+94 11 434 3302', '+94 77 209 0064'],
  email: 'info@srilankanguru.com',
  description:
    'Sri Lankan Guru is a Destination Management Company based in Colombo, Sri Lanka, specializing in customized Sri Lankan tours and professional travel services.',
  social: {
    facebook: 'https://www.facebook.com/srilankanguru/',
  },
} as const
