// components/TopBar.tsx
'use client'

import { useEffect, useState } from 'react'
import { siteData } from '@/lib/content'
import { NAV_LINKS } from '@/lib/nav'
import OverlayMenu from '@/components/OverlayMenu'

export default function TopBar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const email =
    siteData.contact.links.find((l) => l.type === 'email')?.val ?? ''

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className={`topbar${scrolled ? ' scrolled' : ''}`}>
        <a className="topbar-brand" href="#top">
          JIDAN
        </a>
        <button
          className="topbar-menu"
          aria-expanded={open}
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          Menu
        </button>
      </header>
      <OverlayMenu open={open} onClose={() => setOpen(false)} links={NAV_LINKS} email={email} />
    </>
  )
}
