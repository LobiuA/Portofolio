'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { blur, siteData } from '@/lib/content'

// Lazy facade: render the poster + a big "play" until the frame scrolls into view
// (or is clicked). Only then do we mount the iframe, so a YouTube player never lands
// in the initial paint. Reduced-motion users get the poster + a plain off-site link.
export default function ShowreelSection() {
  const s = siteData.showreel
  const wrapRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(false)
  const [reduce, setReduce] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduce(mq.matches)
    if (mq.matches || active) return
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setActive(true)
          io.disconnect()
        }
      },
      { rootMargin: '200px 0px', threshold: 0.01 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [active])

  const embedSrc =
    s.platform === 'vimeo'
      ? `https://player.vimeo.com/video/${s.videoId}?autoplay=1&title=0&byline=0`
      : `https://www.youtube-nocookie.com/embed/${s.videoId}?autoplay=1&rel=0&modestbranding=1`

  const hasVideo = s.videoId && s.videoId !== 'VIDEO_ID'
  const watchHref =
    s.platform === 'vimeo'
      ? `https://vimeo.com/${s.videoId}`
      : `https://youtu.be/${s.videoId}`

  return (
    <section className="block" id="showreel" style={{ background: 'var(--bg)' }}>
      <div className="wrap">
        <div className="section-head" data-reveal="">
          <span className="kicker">{s.kicker}</span>
          <h2>{s.heading}</h2>
          <p>{s.sub}</p>
        </div>

        <div className="showreel-frame" data-reveal="" ref={wrapRef}>
          <span className="cam-corner tl" aria-hidden="true" />
          <span className="cam-corner tr" aria-hidden="true" />
          <span className="cam-corner bl" aria-hidden="true" />
          <span className="cam-corner br" aria-hidden="true" />
          <span className="showreel-badge">
            <span className="tally-dot" aria-hidden="true" />
            {s.label} · {s.runtime}
          </span>

          {hasVideo && active && !reduce ? (
            <iframe
              className="showreel-iframe"
              src={embedSrc}
              title={s.title}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          ) : (
            <button
              type="button"
              className="showreel-poster"
              onClick={() => hasVideo && setActive(true)}
              aria-label={hasVideo ? `Play showreel: ${s.title}` : 'Showreel coming soon'}
              disabled={!hasVideo}
            >
              <Image
                src={s.poster}
                alt={s.title}
                fill
                priority
                sizes="(max-width: 1100px) 100vw, 1200px"
                style={{ objectFit: 'cover' }}
                placeholder={blur('showreel-poster') ? 'blur' : 'empty'}
                blurDataURL={blur('showreel-poster')}
              />
              {hasVideo ? (
                <span className="showreel-play" aria-hidden="true">▶</span>
              ) : (
                <span className="showreel-soon">SHOWREEL · COMING SOON</span>
              )}
            </button>
          )}
        </div>

        {(!hasVideo || reduce) && hasVideo && (
          <a className="showreel-direct" href={watchHref} target="_blank" rel="noopener noreferrer">
            Watch on {s.platform === 'vimeo' ? 'Vimeo' : 'YouTube'} ↗
          </a>
        )}
      </div>
    </section>
  )
}
