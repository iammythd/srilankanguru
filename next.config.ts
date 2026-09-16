import type { NextConfig } from 'next'

// Verdent publish injects public BaaS config as VITE_* variables; Next.js
// client bundles only inline NEXT_PUBLIC_* — map them so the same source
// works locally, in preview, and published. Explicit NEXT_PUBLIC_* wins.
const verdentPublicEnv = {
  NEXT_PUBLIC_SUPABASE_URL:
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.VITE_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_VERDENT_OAUTH_INITIATE_URL:
    process.env.NEXT_PUBLIC_VERDENT_OAUTH_INITIATE_URL ??
    process.env.VITE_VERDENT_OAUTH_INITIATE_URL,
}

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['pdfkit'],
  env: verdentPublicEnv,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'commons.wikimedia.org' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' },
    ],
  },
}

export default nextConfig
