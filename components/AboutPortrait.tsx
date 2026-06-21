'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Editorial parallax: the portrait drifts slower than the page as it scrolls
 * through view, giving the About block a sense of depth. The image is rendered
 * slightly taller than its frame (handled in CSS) so the drift never exposes an
 * edge. Reduced-motion users get a static photo.
 */
export default function AboutPortrait({
  src,
  blurDataURL,
}: {
  src: string
  blurDataURL?: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ref.current
    if (!el) return
    const tween = gsap.fromTo(
      el,
      { y: -28 },
      {
        y: 28,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <div className="about-portrait" data-reveal="">
      <span className="frame-corner tl" />
      <span className="frame-corner br" />
      <span className="frame-tag">
        <span className="dot" />
        OFF AIR
      </span>
      <div className="about-portrait-frame">
        <div className="about-portrait-inner" ref={ref}>
          <Image
            src={src}
            alt="Tri Muhammad Jidan portrait"
            width={742}
            height={1011}
            sizes="(max-width: 880px) 100vw, 42vw"
            placeholder={blurDataURL ? 'blur' : 'empty'}
            blurDataURL={blurDataURL}
          />
        </div>
      </div>
    </div>
  )
}
