// components/Freelance05.tsx
'use client'

import Image from 'next/image'
import { siteData, img, blur } from '@/lib/content'
import { usePortfolio } from '@/components/PortfolioChrome'

export default function Freelance05() {
  const { freelance, ledger } = siteData
  const { openLightbox } = usePortfolio()
  // freelance.testimonial is an array of 3 {quote, stars, cite}; feature the first.
  const t = freelance.testimonial[0]
  return (
    <section className="f05 wrap" id="freelance">
      <div className="kicker">Freelance</div>
      <div className="f05-grid">
        {freelance.clients.map((c) => (
          <button
            key={c.event}
            className="f05-card"
            data-reveal
            onClick={() => openLightbox(c.event)}
            aria-label={`Open ${c.name} gallery`}
          >
            <Image
              src={img(c.cover)}
              alt={c.name}
              fill
              sizes="(max-width: 700px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
              placeholder={blur(c.cover) ? 'blur' : 'empty'}
              blurDataURL={blur(c.cover)}
            />
            <span className="f05-card-name">{c.name}</span>
          </button>
        ))}
      </div>
      {t && (
        <blockquote className="f05-quote" data-reveal>
          {t.quote}
          <small>
            {t.stars} · {t.cite}
          </small>
        </blockquote>
      )}
      <div className="f05-ledger" data-reveal>
        {ledger.rows.map((r) => (
          <div className="f05-row" key={r.idx}>
            <span className="f05-y">{r.idx}</span>
            <span>{r.title}</span>
            <span className="f05-meta">{r.meta}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
