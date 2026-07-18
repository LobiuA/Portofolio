// components/WordReveal.tsx
'use client'

import { useEffect, useRef, useState, type ElementType } from 'react'
import { splitWords } from '@/lib/split-words'

export default function WordReveal({
  text,
  as,
  className = '',
}: {
  text: string
  as?: ElementType
  className?: string
}) {
  const Tag = (as ?? 'p') as ElementType
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={`word-reveal${inView ? ' in' : ''} ${className}`.trim()}>
      {splitWords(text).map((w, i) => (
        <span key={i} className="word-reveal-w" style={{ transitionDelay: `${i * 40}ms` }}>
          {w}
          {' '}
        </span>
      ))}
    </Tag>
  )
}
