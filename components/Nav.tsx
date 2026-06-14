'use client'

import { useEffect, useRef, useState } from 'react'
import { accents, siteData } from '@/lib/content'
import { usePortfolio } from '@/components/PortfolioChrome'

export default function Nav() {
  const { theme, toggleTheme, accent, setAccent } = usePortfolio()
  const [scrolled, setScrolled] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const popRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!pickerOpen) return
    const onDocClick = (e: MouseEvent) => {
      if (popRef.current && !popRef.current.contains(e.target as Node)) setPickerOpen(false)
    }
    document.addEventListener('click', onDocClick)
    return () => document.removeEventListener('click', onDocClick)
  }, [pickerOpen])

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
      <a className="brand" href="#top">
        <span className="tally" />
        <span>
          {siteData.brand.tag}
          <b>/</b>
          {siteData.brand.label}
        </span>
      </a>

      <div className="nav-links">
        {siteData.nav.map((n) => (
          <a key={n.href} href={n.href}>
            {n.label}
          </a>
        ))}
      </div>

      <div className="nav-tools">
        <div className={`accent-pop${pickerOpen ? ' open' : ''}`} ref={popRef}>
          <button
            className="icon-btn"
            aria-label="Change accent color"
            title="Accent color"
            onClick={(e) => {
              e.stopPropagation()
              setPickerOpen((o) => !o)
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 3a9 9 0 0 0 0 18" />
            </svg>
          </button>
          <div className="swatches">
            {accents.map((a) => (
              <button
                key={a.c}
                className="swatch"
                style={{ background: a.c }}
                title={a.name}
                aria-pressed={accent.c === a.c}
                onClick={() => {
                  setAccent(a)
                  setPickerOpen(false)
                }}
              />
            ))}
          </div>
        </div>

        <button
          className="icon-btn"
          aria-label="Toggle theme"
          title="Toggle light / dark"
          onClick={toggleTheme}
        >
          {theme === 'light' ? (
            <svg className="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: 'block' }}>
              <circle cx="12" cy="12" r="4" />
              <path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M19 5l-1.5 1.5M6.5 17.5L5 19" />
            </svg>
          ) : (
            <svg className="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
            </svg>
          )}
        </button>

        <a className="btn btn-primary" href="#contact">
          Hire me
        </a>
      </div>
    </nav>
  )
}
