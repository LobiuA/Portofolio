'use client'

import { useEffect, useState } from 'react'
import { siteData } from '@/lib/content'

const SECTION_IDS = siteData.nav.map((n) => n.href.replace('#', ''))

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24)
      // Determine active section
      for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SECTION_IDS[i])
        if (el && el.getBoundingClientRect().top <= 180) {
          setActive(`#${SECTION_IDS[i]}`)
          return
        }
      }
      setActive('')
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
      <a className="brand" href="#top">
        <span>
          {siteData.brand.tag}
          <b>/</b>
          {siteData.brand.label}
        </span>
      </a>

      <div className="nav-links">
        {siteData.nav.map((n) => (
          <a
            key={n.href}
            href={n.href}
            className={active === n.href ? 'active' : ''}
          >
            {n.label}
          </a>
        ))}
      </div>

      <div className="nav-tools">
        <a className="btn btn-primary" href="#contact">
          Hire me
        </a>
      </div>
    </nav>
  )
}
