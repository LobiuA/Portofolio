'use client'

import { useEffect, useRef } from 'react'

/**
 * Counts from 0 → `value` when the number scrolls into view (IntersectionObserver
 * + rAF, ease-out-cubic). Non-numeric values (e.g. "Rising") render as-is.
 * Reduced-motion users see the final number immediately. The `plus`/suffix sits
 * outside the animated node so it never flickers mid-count.
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
    let raf = 0
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          io.disconnect()
          const start = performance.now()
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / 1600)
            const eased = 1 - Math.pow(1 - t, 3) // ease-out-cubic
            el.textContent = String(Math.round(eased * target))
            if (t < 1) raf = requestAnimationFrame(tick)
          }
          raf = requestAnimationFrame(tick)
        }
      },
      { threshold: 0.1 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [numeric, target])

  return (
    <>
      <span ref={ref}>{numeric ? '0' : value}</span>
      {suffix}
    </>
  )
}
