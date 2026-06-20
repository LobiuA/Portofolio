'use client'

import { useEffect, useState } from 'react'
import { siteData } from '@/lib/content'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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
        <a className="btn btn-primary" href="#contact">
          Hire me
        </a>
      </div>
    </nav>
  )
}
