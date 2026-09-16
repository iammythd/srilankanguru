'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import type { Map as LeafletMap, Marker } from 'leaflet'
import { destinations } from '@/lib/destinations'

/**
 * Interactive route map (OpenStreetMap tiles via Leaflet — no API key needed).
 * Shows itinerary stops as numbered markers joined by a dashed route line.
 * Dynamically imported so Leaflet never blocks the editorial itinerary view.
 */

export default function RouteMap({ stops }: { stops: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const markersRef = useRef<Marker[]>([])

  useEffect(() => {
    let cancelled = false

    async function init() {
      const L = (await import('leaflet')).default
      if (cancelled || !containerRef.current || mapRef.current) return

      const points = stops
        .map((name) => {
          const dest = destinations.find((d) => d.name.toLowerCase() === name.toLowerCase())
          return dest ? { name, coords: dest.coords as [number, number] } : null
        })
        .filter((p): p is { name: string; coords: [number, number] } => p !== null)

      if (points.length === 0) return

      const map = L.map(containerRef.current, {
        scrollWheelZoom: false,
        attributionControl: true,
      })
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map)

      const latlngs: [number, number][] = []
      points.forEach((point, i) => {
        const icon = L.divIcon({
          className: '',
          html: `<div class="slg-marker ${i === 0 ? 'slg-marker-start' : ''}">${i + 1}</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        })
        const marker = L.marker(point.coords, { icon, title: point.name, alt: point.name })
          .addTo(map)
          .bindPopup(`<strong>${point.name}</strong>`)
        markersRef.current.push(marker)
        latlngs.push(point.coords)
      })

      if (latlngs.length > 1) {
        L.polyline(latlngs, { color: '#a75d3f', weight: 2.5, dashArray: '6 8', opacity: 0.85 }).addTo(map)
      }

      map.fitBounds(L.latLngBounds(latlngs).pad(0.18))
    }

    init()
    return () => {
      cancelled = true
      mapRef.current?.remove()
      mapRef.current = null
      markersRef.current = []
    }
  }, [stops])

  return (
    <div
      ref={containerRef}
      className="h-[380px] w-full overflow-hidden rounded-xl shadow-card"
      role="application"
      aria-label="Route map showing the itinerary sequence"
    />
  )
}
