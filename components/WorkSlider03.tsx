// components/WorkSlider03.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { siteData, img, blur } from '@/lib/content'
import { usePortfolio } from '@/components/PortfolioChrome'

const AUTO_MS = 5000

export default function WorkSlider03() {
  const events = siteData.work.events
  const { openLightbox } = usePortfolio()
  const [i, setI] = useState(0)
  const hover = useRef(false)

  const go = (d: number) => setI((p) => (p + d + events.length) % events.length)

  useEffect(() => {
    if (events.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      if (!hover.current) setI((p) => (p + 1) % events.length)
    }, AUTO_MS)
    return () => clearInterval(id)
  }, [events.length])

  if (events.length === 0) return null
  const cur = events[i]

  return (
    <section className="w03" id="work">
      <div className="wrap">
        <div className="kicker">Selected Work</div>
      </div>
      <div
        className="w03-frame"
        onMouseEnter={() => (hover.current = true)}
        onMouseLeave={() => (hover.current = false)}
        onClick={() => openLightbox(cur.event)}
        role="button"
        tabIndex={0}
        aria-label={`Open ${cur.title} gallery`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') openLightbox(cur.event)
        }}
      >
        {events.map((ev, idx) => (
          <div key={ev.event} className={`w03-slide${idx === i ? ' on' : ''}`} aria-hidden={idx !== i}>
            <Image
              src={img(ev.cover)}
              alt={ev.title}
              fill
              sizes="70vw"
              style={{ objectFit: 'cover' }}
              placeholder={blur(ev.cover) ? 'blur' : 'empty'}
              blurDataURL={blur(ev.cover)}
              priority={idx === 0}
            />
          </div>
        ))}
      </div>
      <div className="wrap w03-cap">
        <div>
          <span className="w03-name">{cur.title}</span>
          <span className="w03-year"> — {cur.year}</span>
        </div>
        {events.length > 1 && (
          <div className="w03-nav">
            <button aria-label="Previous" onClick={() => go(-1)}>
              ←
            </button>
            <button aria-label="Next" onClick={() => go(1)}>
              →
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
