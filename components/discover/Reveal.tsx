'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from '@/hooks/useMedia'

/**
 * Subtle fade-up on first scroll into view. Renders children immediately
 * (no animation) when the user prefers reduced motion.
 */
export default function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (reduced) return
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [reduced])

  if (reduced) return <div className={className}>{children}</div>

  return (
    <div ref={ref} className={`${className ?? ''} reveal ${visible ? 'reveal-visible' : ''}`}>
      {children}
    </div>
  )
}
