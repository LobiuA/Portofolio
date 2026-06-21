'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

/**
 * Seamless infinite marquee. Renders the text twice and slides the track by
 * exactly -50% so the second copy lands where the first started — the loop has
 * no visible seam. Pauses for prefers-reduced-motion (the text just sits still).
 */
export default function MarqueeTicker({ text }: { text: string }) {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const track = trackRef.current
    if (!track) return
    const tween = gsap.to(track, {
      xPercent: -50,
      duration: 28,
      ease: 'none',
      repeat: -1,
    })
    return () => {
      tween.kill()
    }
  }, [])

  return (
    <div className="marquee-wrap">
      <div className="marquee-track" ref={trackRef}>
        <span className="marquee-content">{text}</span>
        <span className="marquee-content" aria-hidden="true">{text}</span>
      </div>
    </div>
  )
}
