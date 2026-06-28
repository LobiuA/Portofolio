'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { siteData } from '@/lib/content'
import CountUp from './CountUp'

gsap.registerPlugin(ScrollTrigger)

export default function HeroMetrics() {
  const ref = useRef<HTMLDivElement>(null)
  const { hero } = siteData

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.to(el, {
        y: -25,
        ease: 'none',
        scrollTrigger: {
          trigger: '#hero',
          start: 'top top',
          end: '+=300',
          scrub: true,
        },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={ref} className="vmix-metrics">
      <div className="metrics-header" data-reveal="" data-delay="1">METRICS</div>
      {hero.stats.map((s, i) => (
        <div className="metric" key={s.label} data-reveal="" data-delay={String(i + 2)}>
          <div className="metric-n">
            <CountUp value={s.n} suffix={s.plus} />
          </div>
          <div className="metric-l">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
