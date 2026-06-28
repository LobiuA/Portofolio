'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function NotFound() {
  const [noise, setNoise] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setNoise((p) => !p), 120)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A0A',
      color: '#F2F0EB',
      fontFamily: 'var(--font-barlow, sans-serif)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '24px',
      padding: '32px',
      textAlign: 'center',
    }}>
      <div style={{
        fontSize: 'clamp(64px, 12vw, 140px)',
        fontWeight: 900,
        fontFamily: 'var(--font-barlow, sans-serif)',
        letterSpacing: '-0.03em',
        lineHeight: 1,
        color: '#E8332C',
      }}>
        SIGNAL
      </div>
      <div style={{
        fontSize: 'clamp(48px, 10vw, 120px)',
        fontWeight: 900,
        fontFamily: 'var(--font-barlow, sans-serif)',
        letterSpacing: '-0.03em',
        lineHeight: 1,
      }}>
        LOST
      </div>

      <div style={{
        fontFamily: 'var(--font-jetbrains, monospace)',
        fontSize: '14px',
        color: '#888',
        letterSpacing: '0.12em',
        marginTop: '16px',
      }}>
        {noise ? 'ERR_SIGNAL_NOT_FOUND' : '404 · PAGE NOT FOUND'}
      </div>

      <Link
        href="/"
        style={{
          fontFamily: 'var(--font-jetbrains, monospace)',
          fontSize: '13px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: '#F2F0EB',
          padding: '14px 28px',
          border: '2px solid #F2F0EB',
          textDecoration: 'none',
          marginTop: '24px',
          transition: 'background 0.25s, color 0.25s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = '#F2F0EB'
          e.currentTarget.style.color = '#0A0A0A'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent'
          e.currentTarget.style.color = '#F2F0EB'
        }}
      >
        ← RETURN TO HOME
      </Link>
    </div>
  )
}
