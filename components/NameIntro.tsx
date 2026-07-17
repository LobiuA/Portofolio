'use client'

import { useEffect, useState } from 'react'

const FULL = 'TRI MUHAMMAD JIDAN'
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_'

function scramble(len: number) {
  let s = ''
  for (let i = 0; i < len; i++) s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
  return s
}

// Fixed resolve schedule — predictable per-char lock-in
function buildSchedule(text: string): number[] {
  const reveals: number[] = []
  for (let i = 0; i < text.length; i++) {
    reveals.push(text[i] === ' ' ? 0.2 : 0.5 + i * 0.12)
  }
  return reveals
}

const SCHEDULE = buildSchedule(FULL)
const MAX_REVEAL = Math.max(...SCHEDULE)

export default function NameIntro({ onDone }: { onDone: () => void }) {
  const [display, setDisplay] = useState(() => scramble(FULL.length))
  const [done, setDone] = useState(false)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []

    // Garble cycle — random chars every 80ms
    const garbleId = setInterval(() => {
      setDisplay((prev) => {
        const next = prev.split('')
        for (let i = 0; i < next.length; i++) {
          if (FULL[i] === ' ' || next[i] === FULL[i]) continue
          next[i] = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
        }
        return next.join('')
      })
    }, 80)

    // Lock each char on schedule
    SCHEDULE.forEach((t, i) => {
      timers.push(setTimeout(() => {
        setDisplay((prev) => {
          const next = prev.split('')
          next[i] = FULL[i]
          return next.join('')
        })
      }, t * 1000))
    })

    // Lock → css fade-out → onDone
    timers.push(setTimeout(() => {
      clearInterval(garbleId)
      setDisplay(FULL)
      setDone(true)
      timers.push(setTimeout(onDone, 450))
    }, (MAX_REVEAL + 0.3) * 1000))

    return () => {
      clearInterval(garbleId)
      timers.forEach(clearTimeout)
    }
  }, [onDone])

  return (
    <div className={`name-intro${done ? ' is-done' : ''}`} role="presentation" aria-hidden={done}>
      <div className="name-intro-scanline" />
      <h1 className={`name-intro-name${done ? ' is-locked' : ''}`}>
        {display.split('').map((ch, i) => (
          <span key={i} className={ch === FULL[i] || ch === ' ' ? '' : 'is-scrambling'}>
            {ch === ' ' ? ' ' : ch}
          </span>
        ))}
      </h1>
      <div className="name-intro-tc">{done ? 'SIGNAL · LOCKED' : 'ACQUIRING…'}</div>
    </div>
  )
}
