// components/OverlayMenu.tsx
'use client'

import { useEffect, useRef } from 'react'

export default function OverlayMenu({
  open,
  onClose,
  links,
  email,
}: {
  open: boolean
  onClose: () => void
  links: { label: string; href: string }[]
  email: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    ref.current?.querySelector<HTMLElement>('a,button')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <div
      ref={ref}
      className={`overlay-menu${open ? ' open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      aria-label="Menu"
    >
      <button className="overlay-close" aria-label="Close menu" onClick={onClose}>
        ✕
      </button>
      <nav className="overlay-links">
        {links.map((l) => (
          <a key={l.href} href={l.href} onClick={onClose}>
            {l.label}
          </a>
        ))}
      </nav>
      <div className="overlay-foot">
        <a href={`mailto:${email}`}>{email}</a>
        <span>© Tri Muhammad Jidan</span>
      </div>
    </div>
  )
}
