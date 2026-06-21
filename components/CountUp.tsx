'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * Counts from 0 → `value` when the number scrolls into view. Non-numeric values
 * (e.g. "Rising") are rendered as-is. Reduced-motion users see the final number
 * immediately. The `plus`/suffix sits outside the animated node so it never
 * flickers mid-count.
 */
export default function CountUp({
  value,
  suffix = '',
}: {
  value: string
  suffix?: string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const target = parseInt(value, 10)
  const numeric = !Number.isNaN(target)

  useEffect(() => {
    if (!numeric) return
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.textContent = String(target)
      return
    }
    const counter = { n: 0 }
    const tween = gsap.to(counter, {
      n: target,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
      onUpdate: () => {
        el.textContent = String(Math.round(counter.n))
      },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [numeric, target])

  return (
    <>
      <span ref={ref}>{numeric ? '0' : value}</span>
      {suffix}
    </>
  )
}
