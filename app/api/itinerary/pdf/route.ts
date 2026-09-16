import { NextResponse } from 'next/server'
import { createItineraryPdf } from '@/lib/pdf/generator'
import { storedItinerarySchema } from '@/lib/itinerary/schema'
import { getSupabaseServerClient, getServerUser } from '@/lib/supabase/server'
import { isSupabaseConfigured } from '@/lib/config'
import type { Itinerary } from '@/types'

export const runtime = 'nodejs'

/**
 * Server-side PDF generation.
 * GET  ?id=…     → renders a saved journey (owner only, RLS enforced).
 * POST {itinerary} → renders a draft itinerary.
 * Optional shared-secret gate via PDF_SERVICE_KEY (x-pdf-key header).
 */
function pdfKeyOk(request: Request): boolean {
  const required = process.env.PDF_SERVICE_KEY
  return !required || request.headers.get('x-pdf-key') === required
}

function pdfResponse(doc: PDFKit.PDFDocument, filename: string) {
  const chunks: Uint8Array[] = []
  doc.on('data', (chunk: Uint8Array) => chunks.push(chunk))
  return new Promise<Response>((resolve) => {
    doc.on('end', () => {
      const buffer = Buffer.concat(chunks.map((c) => Buffer.from(c)))
      resolve(
        new Response(new Uint8Array(buffer), {
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${filename}"`,
          },
        }),
      )
    })
    doc.on('error', (err: Error) => {
      resolve(NextResponse.json({ error: `PDF render failed: ${err.message}` }, { status: 500 }))
    })
    doc.end()
  })
}

async function resolveItinerary(request: Request): Promise<{ itinerary: Itinerary | null; error?: string; status?: number }> {
  const url = new URL(request.url)
  const id = url.searchParams.get('id')

  if (id) {
    if (!isSupabaseConfigured()) return { itinerary: null, error: 'Supabase is not configured.', status: 501 }
    const user = await getServerUser()
    if (!user) return { itinerary: null, error: 'Sign in to download saved journeys.', status: 401 }
    const supabase = await getSupabaseServerClient()
    const { data, error } = await supabase!
      .from('itineraries')
      .select('itinerary')
      .eq('id', id)
      .single()
    if (error || !data) return { itinerary: null, error: 'Journey not found.', status: 404 }
    return { itinerary: (data as { itinerary: Itinerary }).itinerary }
  }

  const body = await request.json().catch(() => null)
  const parsed = storedItinerarySchema.safeParse(body?.itinerary)
  if (!parsed.success) return { itinerary: null, error: 'Invalid itinerary payload.', status: 400 }
  return { itinerary: parsed.data as Itinerary }
}

export async function GET(request: Request) {
  if (!pdfKeyOk(request)) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  const { itinerary, error, status } = await resolveItinerary(request)
  if (!itinerary) return NextResponse.json({ error }, { status: status ?? 400 })
  try {
    const doc = createItineraryPdf(itinerary)
    return await pdfResponse(doc, 'sri-lankan-guru-journey.pdf')
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'PDF failed.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  if (!pdfKeyOk(request)) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  const { itinerary, error, status } = await resolveItinerary(request)
  if (!itinerary) return NextResponse.json({ error }, { status: status ?? 400 })
  try {
    const doc = createItineraryPdf(itinerary)
    return await pdfResponse(doc, 'sri-lankan-guru-itinerary.pdf')
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'PDF failed.' }, { status: 500 })
  }
}
