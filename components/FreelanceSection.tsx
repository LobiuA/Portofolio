'use client'

import Image from 'next/image'
import { blur, img, siteData } from '@/lib/content'
import { usePortfolio } from '@/components/PortfolioChrome'

export default function FreelanceSection() {
  const { freelance } = siteData
  const { openLightbox } = usePortfolio()

  return (
    <section className="block" id="freelance">
      <div className="wrap">
        <div className="section-head" data-reveal="">
          <span className="kicker">{freelance.kicker}</span>
          <h2>{freelance.heading}</h2>
          <p>{freelance.sub}</p>
        </div>

        <div className="up-stats" data-reveal="">
          {freelance.stats.map((s) => (
            <div className="stat" key={s.label}>
              <div className="n">
                {s.n}
                {s.plus && <span style={{ color: 'var(--accent)' }}>{s.plus}</span>}
              </div>
              <div className="l">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="fl-grid">
          {freelance.clients.map((c, idx) => {
            const open = () => openLightbox(c.event)
            return (
              <div
                key={c.event}
                className="fl fl-img"
                data-reveal=""
                data-delay={idx || undefined}
                tabIndex={0}
                onClick={open}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault()
                    open()
                  }
                }}
              >
                <div className="fl-media">
                  <Image
                    src={img(c.cover)}
                    alt={c.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    style={{ objectFit: 'cover', objectPosition: 'top' }}
                    placeholder={blur(c.cover) ? 'blur' : 'empty'}
                    blurDataURL={blur(c.cover)}
                  />
                  <span className="ev-count">
                    {c.count} {c.count === 1 ? 'shot' : 'shots'}
                  </span>
                </div>
                <div className="fl-info">
                  <div className="pin">{c.pin}</div>
                  <h4>{c.name}</h4>
                  <div className="loc">{c.loc}</div>
                  <p>{c.desc}</p>
                </div>
              </div>
            )
          })}
        </div>

        <figure className="testimonial" data-reveal="">
          <blockquote>{freelance.testimonial.quote}</blockquote>
          <figcaption>
            <span className="stars">{freelance.testimonial.stars}</span>{' '}
            {freelance.testimonial.cite}
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
