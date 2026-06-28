'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Testimonial {
  quote: string
  stars: string
  cite: string
}

export default function TestimonialCarousel({
  items,
}: {
  items: Testimonial[]
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const ctxRef = useRef<gsap.Context | null>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = gsap.context(() => {
      const w = track.scrollWidth / 2
      gsap.to(track, {
        x: -w,
        duration: items.length * 8,
        ease: 'none',
        repeat: -1,
      })
    }, track)

    ctxRef.current = ctx
    return () => ctx.revert()
  }, [items.length])

  // Duplicate for seamless loop
  const doubled = [...items, ...items]

  return (
    <div className="test-ticker" data-reveal="">
      <div className="test-ticker-wrap">
        <div className="test-track" ref={trackRef}>
          {doubled.map((t, i) => (
            <figure className="test-card" key={i} aria-hidden={i >= items.length ? 'true' : undefined}>
              <blockquote>"{t.quote.replace(/^[""]|[""]$/g, '')}"</blockquote>
              <figcaption>
                <span className="stars">{t.stars}</span>
                {' '}{t.cite}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  )
}
