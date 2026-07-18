// components/WorkSlider03.tsx
'use client'

import { useRef, useLayoutEffect } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteData, img, blur } from '@/lib/content'
import { usePortfolio } from '@/components/PortfolioChrome'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function WorkSlider03() {
  const events = siteData.work.events
  const { openLightbox } = usePortfolio()
  const sectionRef = useRef<HTMLElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    if (!sectionRef.current || !galleryRef.current || events.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const section = sectionRef.current
    const gallery = galleryRef.current

    const ctx = gsap.context(() => {
      // Membaca seberapa lebar elemen vs viewport
      const getScrollAmount = () => {
        const offset = gallery.scrollWidth - window.innerWidth
        return offset > 0 ? offset + 80 : 0 // +80px untuk buffer padding
      }

      const tween = gsap.to(gallery, {
        x: () => -getScrollAmount(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${getScrollAmount()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [events.length])

  if (events.length === 0) return null

  return (
    <section className="w03" id="work" ref={sectionRef}>
      <div className="wrap" style={{ paddingTop: '80px', paddingBottom: '40px' }}>
        <div className="kicker">Selected Work</div>
      </div>

      <div className="w03-gallery-wrap">
        <div className="w03-gallery" ref={galleryRef}>
          {events.map((ev, idx) => (
            <div
              key={ev.event}
              className="w03-item"
              onClick={() => openLightbox(ev.event)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') openLightbox(ev.event)
              }}
            >
              <div className="w03-cover">
                <Image
                  src={img(ev.cover)}
                  alt={ev.title}
                  fill
                  sizes="(max-width: 768px) 85vw, 50vw"
                  style={{ objectFit: 'cover' }}
                  placeholder={blur(ev.cover) ? 'blur' : 'empty'}
                  blurDataURL={blur(ev.cover)}
                  priority={idx === 0}
                />
              </div>
              <div className="w03-cap">
                <span className="w03-name">{ev.title}</span>
                <span className="w03-year"> — {ev.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
