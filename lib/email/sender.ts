import type { Itinerary } from '@/types'
import { COMPANY } from '@/lib/config'
import { hasEmailKey } from '@/lib/config'

/**
 * Transactional email adapter (Resend-compatible).
 * Sends a compact, clean notification email — never a giant HTML page.
 */

interface SendArgs {
  to: string
  itinerary: Itinerary
  itineraryUrl: string
  pdfUrl?: string
}

function buildHtml(args: SendArgs): string {
  const { itinerary: it, itineraryUrl, pdfUrl } = args
  const stops = [...new Set(it.days.map((d) => d.location))]
  const rows = it.days
    .map(
      (day) =>
        `<tr><td style="padding:8px 12px;border-bottom:1px solid #eee;color:#5a625d;font-family:Arial,sans-serif;font-size:13px">Day ${day.day}</td><td style="padding:8px 12px;border-bottom:1px solid #eee;font-family:Arial,sans-serif;font-size:13px"><strong>${day.location}</strong> — ${day.theme}</td></tr>`,
    )
    .join('')

  return `<!doctype html>
<html><body style="margin:0;background:#f4f0e8;padding:24px 0">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden">
    <div style="background:#10221c;padding:28px 32px">
      <div style="color:#e8d5b5;font-family:Georgia,serif;font-size:18px">${COMPANY.name}</div>
      <div style="color:#ffffff;font-family:Georgia,serif;font-size:24px;margin-top:10px">${it.trip_title}</div>
    </div>
    <div style="padding:28px 32px;font-family:Arial,sans-serif;color:#111412">
      <p style="font-size:14px;line-height:1.5;margin:0 0 12px">${it.start_date} → ${it.end_date} · ${it.days.length} days · ${it.traveller_type}</p>
      <p style="font-size:14px;line-height:1.5;margin:0 0 20px;color:#5a625d">${it.summary}</p>
      <p style="font-size:12px;letter-spacing:1px;color:#a75d3f;margin:0 0 8px">ROUTE</p>
      <p style="font-size:14px;margin:0 0 20px">${stops.join(' → ')}</p>
      <table style="width:100%;border-collapse:collapse;margin:0 0 24px">${rows}</table>
      <a href="${itineraryUrl}" style="display:inline-block;background:#0c4a5a;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:999px;font-size:14px;font-weight:bold">Open your itinerary</a>
      ${pdfUrl ? `<a href="${pdfUrl}" style="display:inline-block;margin-left:12px;color:#0c4a5a;font-size:14px">Download PDF</a>` : ''}
      <p style="font-size:12px;color:#5a625d;margin:28px 0 0">${COMPANY.legalName} · ${COMPANY.address.join(', ')} · ${COMPANY.phones[0]}</p>
    </div>
  </div>
</body></html>`
}

export async function sendItineraryEmail(args: SendArgs): Promise<{ sent: true; id: string }> {
  if (!hasEmailKey()) {
    throw Object.assign(
      new Error('Email delivery is not configured. Set EMAIL_API_KEY (and EMAIL_FROM) on the server.'),
      { statusCode: 501 },
    )
  }

  const { Resend } = await import('resend')
  const resend = new Resend(process.env.EMAIL_API_KEY)
  const result = await resend.emails.send({
    from: process.env.EMAIL_FROM ?? COMPANY.email,
    to: args.to,
    subject: `Your Sri Lanka journey — ${args.itinerary.trip_title}`,
    html: buildHtml(args),
  })

  if (result.error) {
    throw Object.assign(new Error(result.error.message), { statusCode: 502 })
  }
  return { sent: true, id: result.data?.id ?? 'sent' }
}
