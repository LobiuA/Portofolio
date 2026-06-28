'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

const FULL = 'TRI MUHAMMAD JIDAN'

// Scramble chars — random uppercase + underscore for the glitch look
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ_'

function scramble(len: number) {
  let s = ''
  for (let i = 0; i < len; i++) s += GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
  return s
}

// Build a resolve schedule — each char flips at fixed intervals
// Phase 1: full garble, Phase 2: partial resolve, Phase 3: full clean
function buildSchedule(text: string): number[] {
  const chars = text.split('')
  const stagger = 0.12
  const reveals: number[] = []
  for (let i = 0; i < chars.length; i++) {
    if (chars[i] === ' ') { reveals.push(0.2); continue }
    reveals.push(0.5 + i * stagger)
  }
  return reveals
}

const SCHEDULE = buildSchedule(FULL)
const MAX_REVEAL = Math.max(...SCHEDULE)

export default function NameIntro({ onDone }: { onDone: () => void }) {
  const [display, setDisplay] = useState(() => scramble(FULL.length))
  const [phase, setPhase] = useState(0)
  const [timecode, setTimecode] = useState('00:00:00:00')
  const overlayRef = useRef<HTMLDivElement>(null)

  // Resolve letters over time — use stable SCHEDULE so timers don't drift per render
  useEffect(() => {
    // Garble — cycle random chars every 80ms
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

    // Resolve chars at fixed times
    const timers: ReturnType<typeof setTimeout>[] = []
    SCHEDULE.forEach((t, i) => {
      if (FULL[i] === ' ') return
      timers.push(
        setTimeout(() => {
          setDisplay((prev) => {
            const next = prev.split('')
            next[i] = FULL[i]
            return next.join('')
          })
        }, t * 1000),
      )
    })

    // All resolved — show SIGNAL LOCKED
    const cleanTimer = setTimeout(() => {
      setPhase(2)
      setDisplay(FULL)
      clearInterval(garbleId)
    }, (MAX_REVEAL + 0.15) * 1000)
    timers.push(cleanTimer)

    // Fade out → reveal hero
    const doneTimer = setTimeout(() => {
      setPhase(3)
      const overlay = overlayRef.current
      if (overlay) {
        gsap.to(overlay, {
          opacity: 0,
          duration: 0.5,
          ease: 'power2.in',
          onComplete: () => onDone(),
        })
      } else {
        onDone()
      }
    }, (MAX_REVEAL + 0.8) * 1000)
    timers.push(doneTimer)

    return () => {
      clearInterval(garbleId)
      timers.forEach(clearTimeout)
    }
  }, [onDone])

  // Timecode
  useEffect(() => {
    let f = 0
    const id = setInterval(() => {
      f++
      const fr = f % 25
      const s = Math.floor(f / 25) % 60
      const m = Math.floor(f / 25 / 60) % 60
      const h = Math.floor(f / 25 / 3600)
      setTimecode(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(fr).padStart(2, '0')}`,
      )
    }, 40)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#0A0A0A',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
      }}
    >
      {/* Scanline overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Glitch name */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          fontFamily: "var(--font-barlow, 'Barlow Condensed'), sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(40px, 8vw, 90px)',
          letterSpacing: '0.08em',
          color: '#F2F0EB',
          lineHeight: 1,
          textAlign: 'center',
        }}
      >
        {phase === 3 ? FULL : display.split('').map((ch, i) => {
          const isResolved = ch === FULL[i]
          const isSpace = ch === ' '
          return (
            <span
              key={i}
              style={{
                color: isSpace ? 'transparent' : isResolved ? '#F2F0EB' : '#E8332C',
                opacity: isSpace ? 0 : isResolved ? 1 : 0.7,
                transition: 'color 0.15s, opacity 0.15s',
              }}
            >
              {isSpace ? ' ' : ch}
            </span>
          )
        })}
      </div>

      {/* Tally + status */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontFamily: "var(--font-jetbrains, 'JetBrains Mono'), monospace",
          fontSize: '13px',
          letterSpacing: '0.12em',
          color: phase === 2 ? '#F0A500' : '#888',
          transition: 'color 0.3s',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: phase >= 2 ? '#E8332C' : '#555',
            display: 'inline-block',
            animation: phase >= 2 ? 'tally-pulse 1.4s ease-in-out infinite' : 'none',
          }}
        />
        {phase >= 2 ? 'SIGNAL LOCKED' : 'ACQUIRING...'}
      </div>

      {/* Timecode */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          fontFamily: "var(--font-jetbrains, 'JetBrains Mono'), monospace",
          fontSize: '14px',
          letterSpacing: '0.06em',
          color: '#666',
        }}
      >
        {timecode}
      </div>
    </div>
  )
}
