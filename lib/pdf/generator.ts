import PDFDocument from 'pdfkit'
import type { Itinerary } from '@/types'
import { COMPANY } from '@/lib/config'

/**
 * Server-side PDF itinerary generation (pdfkit, node runtime).
 * Produces a premium travel document: cover, trip summary, route overview,
 * day-by-day pages and company contact details.
 */

const COLORS = {
  jungle: '#10221C',
  ocean: '#0C4A5A',
  sand: '#E8D5B5',
  cloud: '#F4F0E8',
  terracotta: '#A75D3F',
  tea: '#607A54',
  ink: '#111412',
  muted: '#5a625d',
}

export function createItineraryPdf(itinerary: Itinerary): PDFKit.PDFDocument {
  const doc = new PDFDocument({ size: 'A4', margin: 56, info: { Title: itinerary.trip_title } })
  drawCover(doc, itinerary)
  drawSummary(doc, itinerary)
  for (const day of itinerary.days) {
    doc.addPage()
    drawDay(doc, day)
  }
  doc.addPage()
  drawNotes(doc)
  return doc
}

function drawCover(doc: PDFKit.PDFDocument, it: Itinerary) {
  const { width, height } = doc.page
  doc.rect(0, 0, width, height).fill(COLORS.jungle)
  doc.rect(0, height - 190, width, 190).fill(COLORS.ocean)
  doc.circle(width - 90, 120, 46).fillOpacity(0.25).fill(COLORS.sand).fillOpacity(1)

  doc
    .font('Times-Bold')
    .fontSize(15)
    .fillColor(COLORS.sand)
    .text(COMPANY.name.toUpperCase(), 56, 64, { characterSpacing: 4 })
  doc
    .font('Helvetica')
    .fontSize(10)
    .fillColor(COLORS.sand)
    .text('Destination Management Company — Sri Lanka', 56, 86)

  doc
    .font('Times-Bold')
    .fontSize(42)
    .fillColor('#ffffff')
    .text(it.trip_title, 56, height / 2 - 90, { width: width - 112, lineGap: 6 })

  doc
    .font('Helvetica')
    .fontSize(12)
    .fillColor(COLORS.sand)
    .text(`${it.start_date}  →  ${it.end_date}   ·   ${it.days.length} days   ·   ${it.traveller_type}`, 56, height - 140)
  doc
    .font('Helvetica')
    .fontSize(10)
    .fillColor('#ffffff')
    .text(
      `Estimated budget: ${it.estimated_budget.currency} ${it.estimated_budget.low.toLocaleString()} – ${it.estimated_budget.high.toLocaleString()}`,
      56,
      height - 116,
    )
  doc.fontSize(9).fillColor('#d8e4e2').text('Prepared with local expertise by Sri Lankan Guru', 56, height - 66)
}

function drawSummary(doc: PDFKit.PDFDocument, it: Itinerary) {
  let y = 64
  heading(doc, 'Journey Overview', y)
  y += 34

  doc.font('Times-Italic').fontSize(13).fillColor(COLORS.ink).text(it.summary, 56, y, {
    width: 483,
    lineGap: 4,
  })
  y += doc.heightOfString(it.summary, { width: 483, lineGap: 4 }) + 26

  // Route overview
  heading(doc, 'Route Overview', y)
  y += 30
  const stops = [...new Set(it.days.map((d) => d.location))]
  doc.font('Helvetica').fontSize(11).fillColor(COLORS.ocean)
  stops.forEach((stop, i) => {
    const x = 56 + (i % 3) * 170
    if (i > 0 && i % 3 === 0) y += 24
    doc.roundedRect(x, y, 158, 20, 10).fill(COLORS.cloud)
    doc.fillColor(COLORS.ink).text(`${i + 1}.  ${stop}`, x + 12, y + 5, { width: 140, ellipsis: true })
  })
  y += Math.ceil(stops.length / 3) * 24 + 20

  // Traveller profile
  heading(doc, 'Traveller Profile', y)
  y += 28
  const profile = [
    ['Dates', `${it.start_date} → ${it.end_date}`],
    ['Travellers', it.traveller_type],
    ['Pace', it.pace],
    ['Budget level', it.budget_level],
    ['Requirements', it.special_requirements.length ? it.special_requirements.join(', ') : 'None'],
    ['Estimated budget', `${it.estimated_budget.currency} ${it.estimated_budget.low.toLocaleString()} – ${it.estimated_budget.high.toLocaleString()}`],
  ] as const
  doc.font('Helvetica').fontSize(10.5)
  for (const [label, value] of profile) {
    doc.fillColor(COLORS.muted).text(label, 56, y, { width: 130 })
    doc.fillColor(COLORS.ink).text(String(value), 196, y, { width: 343 })
    y += 20
  }
}

function drawDay(doc: PDFKit.PDFDocument, day: Itinerary['days'][number]) {
  let y = 64
  doc.font('Helvetica').fontSize(10).fillColor(COLORS.terracotta).text(`DAY ${day.day}`, 56, y, {
    characterSpacing: 3,
  })
  doc.font('Times-Bold').fontSize(26).fillColor(COLORS.ink).text(day.location, 56, y + 18)
  doc.font('Helvetica').fontSize(10.5).fillColor(COLORS.muted).text(day.theme, 56, y + 52)
  y += 82
  doc.moveTo(56, y).lineTo(539, y).lineWidth(1).strokeColor(COLORS.sand).stroke()
  y += 22

  for (const activity of day.activities) {
    const descHeight = doc.heightOfString(activity.description, { width: 380 })
    if (y + descHeight + 46 > 780) {
      doc.addPage()
      y = 64
    }
    doc.font('Helvetica-Bold').fontSize(10).fillColor(COLORS.ocean).text(activity.time.toUpperCase(), 56, y, { width: 90 })
    doc.font('Helvetica-Bold').fontSize(12).fillColor(COLORS.ink).text(activity.title, 150, y - 1, { width: 389 })
    doc.font('Helvetica').fontSize(10).fillColor(COLORS.muted).text(activity.description, 150, y + 15, { width: 380 })
    doc
      .font('Helvetica')
      .fontSize(9)
      .fillColor(COLORS.tea)
      .text(`~${activity.duration_minutes} min`, 150, y + 19 + descHeight)
    y += descHeight + 48
  }
}

function drawNotes(doc: PDFKit.PDFDocument) {
  let y = 64
  heading(doc, 'Travel Notes', y)
  y += 34
  const notes = [
    'Visas: most travellers obtain an ETA online before arrival (srilankaevisa.org).',
    'Currency: Sri Lankan Rupee (LKR). Cards are widely accepted in cities; carry cash in rural areas.',
    'Dress modestly at temples — remove shoes and cover shoulders and knees.',
    'Respect wildlife: keep distance, never feed animals, and use licensed guides in national parks.',
    'The best regional seasons vary — your Guru consultant will confirm conditions for your dates.',
  ]
  doc.font('Helvetica').fontSize(10.5).fillColor(COLORS.ink)
  for (const note of notes) {
    doc.fillColor(COLORS.tea).text('•', 56, y)
    doc.fillColor(COLORS.ink).text(note, 70, y, { width: 469 })
    y += doc.heightOfString(note, { width: 469 }) + 10
  }

  y = 560
  doc.rect(0, 560, doc.page.width, doc.page.height - 560).fill(COLORS.jungle)
  doc.font('Times-Bold').fontSize(16).fillColor(COLORS.sand).text('Sri Lankan Guru', 56, 592)
  doc
    .font('Helvetica')
    .fontSize(9.5)
    .fillColor('#ffffff')
    .text(`${COMPANY.legalName} · ${COMPANY.address.join(', ')}`, 56, 616)
  doc.text(`Tel: ${COMPANY.phones.join('  ·  ')}   ·   ${COMPANY.email}`, 56, 632)
  doc.fontSize(8.5).fillColor('#c9d6d3').text(COMPANY.description, 56, 652, { width: 483 })
}

function heading(doc: PDFKit.PDFDocument, text: string, y: number) {
  doc.font('Times-Bold').fontSize(20).fillColor(COLORS.ink).text(text, 56, y)
  doc.moveTo(56, y + 26).lineTo(160, y + 26).lineWidth(2).strokeColor(COLORS.terracotta).stroke()
}
