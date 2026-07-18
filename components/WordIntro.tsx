// components/WordIntro.tsx
'use client'

import { useEffect, useState } from 'react'

const WORDS = ['TRI', 'MUHAMMAD', 'JIDAN']

export default function WordIntro({ onDone }: { onDone: () => void }) {
  // Deterministic initial state — no random/time in render (SSR hydration rule).
  const [shown, setShown] = useState(0) // how many words are visible
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onDone()
      return
    }
    const timers: ReturnType<typeof setTimeout>[] = []
    WORDS.forEach((_, i) => {
      timers.push(setTimeout(() => setShown(i + 1), 300 + i * 400))
    })
    const holdEnd = 300 + WORDS.length * 400 + 600
    timers.push(setTimeout(() => setLeaving(true), holdEnd))
    timers.push(setTimeout(onDone, holdEnd + 500))
    return () => timers.forEach(clearTimeout)
  }, [onDone])

  return (
    <div className={`word-intro${leaving ? ' is-leaving' : ''}`} role="presentation">
      <h1 className="word-intro-name">
        {WORDS.map((w, i) => (
          <span key={w} className={i < shown ? 'on' : ''}>
            {w}
            {i < WORDS.length - 1 ? ' ' : ''}
          </span>
        ))}
      </h1>
    </div>
  )
}
