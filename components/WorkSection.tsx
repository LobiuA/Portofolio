'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { blur, img, siteData } from '@/lib/content'
import { usePortfolio } from '@/components/PortfolioChrome'

export default function WorkSection() {
  const { work } = siteData
  const { openLightbox } = usePortfolio()
  const [game, setGame] = useState('all')
  const [role, setRole] = useState('all')

  const matches = (e: (typeof work.events)[number], g: string, r: string) =>
    (g === 'all' || e.game === g) && (r === 'all' || e.roles.includes(r))

  const stateOf = (e: (typeof work.events)[number]): 'onair' | 'standby' | 'complete' => {
    if (e.flags.some((f) => f.live)) return 'onair'
    const year = parseInt(e.year, 10)
    return year >= 2025 ? 'standby' : 'complete'
  }

  const stateLabel = (s: ReturnType<typeof stateOf>) => {
    if (s === 'onair') return 'ON AIR'
    if (s === 'standby') return 'STANDBY'
    return 'COMPLETE'
  }

  // count results a filter button would yield, holding the other axis fixed
  const countFor = useMemo(
    () => (groupVal: string, isGame: boolean) =>
      work.events.filter((e) =>
        isGame ? matches(e, groupVal, role) : matches(e, game, groupVal),
      ).length,
    [game, role, work.events],
  )

  return (
    <section className="block" id="work" style={{ background: 'var(--bg-2)' }}>
      <div className="wrap">
        <div className="section-head" data-reveal="">
          <span className="kicker">{work.kicker}</span>
          <h2>{work.heading}</h2>
          <p>{work.sub}</p>
        </div>

        <div className="filters" data-reveal="">
          {work.gameFilters.map((f) => {
            const dead = f.val !== 'all' && countFor(f.val, true) === 0
            return (
              <button
                key={f.val}
                className="filter"
                aria-pressed={game === f.val}
                style={dead ? { opacity: 0.35, pointerEvents: 'none' } : undefined}
                onClick={() => setGame(f.val)}
              >
                {f.label}
              </button>
            )
          })}
        </div>
        <div className="filters" data-reveal="" data-delay="1">
          {work.roleFilters.map((f) => {
            const dead = f.val !== 'all' && countFor(f.val, false) === 0
            return (
              <button
                key={f.val}
                className="filter"
                aria-pressed={role === f.val}
                style={dead ? { opacity: 0.35, pointerEvents: 'none' } : undefined}
                onClick={() => setRole(f.val)}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        <div className="gallery">
          {work.events.map((e, idx) => {
            const open = () => openLightbox(e.event)
            return (
              <article
                key={e.event}
                className={`ev ev-${stateOf(e)}${matches(e, game, role) ? '' : ' hide'}`}
                data-reveal=""
                data-delay={(idx % 3) || undefined}
                tabIndex={0}
                onClick={open}
                onKeyDown={(ev) => {
                  if (ev.key === 'Enter' || ev.key === ' ') {
                    ev.preventDefault()
                    open()
                  }
                }}
              >
                <div className="ev-media">
                  <div className="ev-flag">
                    {e.flags.map((fl) => (
                      <span className={`tag${fl.live ? ' live' : ''}`} key={fl.label}>
                        {fl.label}
                      </span>
                    ))}
                  </div>
                  <Image
                    src={img(e.cover)}
                    alt={e.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    placeholder={blur(e.cover) ? 'blur' : 'empty'}
                    blurDataURL={blur(e.cover)}
                  />
                  <span className="ev-count">{e.count} shots</span>
                </div>
                <div className="ev-body">
                  <div className="ev-body-header">
                    <h4>{e.title}</h4>
                    <span className="ev-state-badge">
                      {stateOf(e) === 'onair' && <span className="tally" aria-hidden="true" />}
                      {stateLabel(stateOf(e))}
                    </span>
                  </div>
                  <div className="yr">{e.year}</div>
                  <div className="ev-role">{e.role}</div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
