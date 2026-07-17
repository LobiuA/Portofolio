'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { blur, img, siteData } from '@/lib/content'

// Showreel = auto-rotating slideshow across every event + client cover.
// Slides crossfade every 4s; hover pauses; dots jump; reduced-motion freezes.
// A slide whose event has a VOD href shows a ▶ Watch broadcast CTA.
type Slide = {
  key: string
  cover: string
  title: string
  meta: string
  href?: string
}

const ROTATE_MS = 4000

export default function ShowreelSection() {
  const s = siteData.showreel
  const slides: Slide[] = [
    ...siteData.work.events.map((e) => ({
      key: e.event,
      cover: e.cover,
      title: e.title,
      meta: [e.year, e.role].filter(Boolean).join(' · '),
      href: e.images.find((i) => i.href)?.href,
    })),
    ...siteData.freelance.clients.map((c) => ({
      key: c.event,
      cover: c.cover,
      title: c.name,
      meta: c.loc,
      href: c.images.find((i) => i.href)?.href,
    })),
  ].filter((sl) => sl.cover)

  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const [reduce, setReduce] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduce(mq.matches)
  }, [])

  const next = useCallback(() => {
    setI((p) => (p + 1) % slides.length)
  }, [slides.length])

  useEffect(() => {
    if (reduce || paused || slides.length < 2) return
    timer.current = setInterval(next, ROTATE_MS)
    return () => {
      if (timer.current) clearInterval(timer.current)
    }
  }, [reduce, paused, next, slides.length])

  const goto = (idx: number) => setI((idx + slides.length) % slides.length)
  const cur = slides[i]

  return (
    <section className="block" id="showreel" style={{ background: 'var(--bg)' }}>
      <div className="wrap">
        <div className="section-head" data-reveal="">
          <span className="kicker">{s.kicker}</span>
          <h2>{s.heading}</h2>
          <p>{s.sub}</p>
        </div>

        {cur && (
          <div
            className="showreel-frame showreel-stage"
            data-reveal=""
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            role="region"
            aria-roledescription="carousel"
            aria-label="Event showreel"
          >
            <span className="showreel-badge">
              {s.label} · {slides.length} EVENTS
            </span>

            <div className="showreel-slides">
              {slides.map((sl, idx) => (
                <div
                  key={sl.key}
                  className={`showreel-slide${idx === i ? ' active' : ''}`}
                  aria-hidden={idx !== i}
                >
                  <Image
                    src={img(sl.cover)}
                    alt={sl.title}
                    fill
                    sizes="(max-width: 1100px) 100vw, 1200px"
                    priority={idx === 0}
                    style={{ objectFit: 'cover' }}
                    placeholder={blur(sl.cover) ? 'blur' : 'empty'}
                    blurDataURL={blur(sl.cover)}
                  />
                  <div className="showreel-veil" aria-hidden="true" />
                  <div className="showreel-cap">
                    <div className="showreel-title">{sl.title}</div>
                    {sl.meta && <div className="showreel-meta">{sl.meta}</div>}
                    {sl.href && (
                      <a
                        className="showreel-watch"
                        href={sl.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        ▶ Watch broadcast ↗
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {slides.length > 1 && (
              <>
                <button
                  type="button"
                  className="showreel-nav showreel-prev"
                  aria-label="Previous"
                  onClick={() => goto(i - 1)}
                >
                  ‹
                </button>
                <button
                  type="button"
                  className="showreel-nav showreel-next"
                  aria-label="Next"
                  onClick={() => goto(i + 1)}
                >
                  ›
                </button>
                <div className="showreel-dots" role="tablist">
                  {slides.map((sl, idx) => (
                    <button
                      key={sl.key}
                      type="button"
                      className={`showreel-dot${idx === i ? ' active' : ''}`}
                      aria-label={`Go to ${sl.title}`}
                      aria-selected={idx === i}
                      role="tab"
                      onClick={() => goto(idx)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
