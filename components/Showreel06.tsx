// components/Showreel06.tsx
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { siteData, img, blur } from '@/lib/content'

const AUTO_MS = 4000

export default function Showreel06() {
  const covers = [
    ...siteData.work.events.map((e) => ({ key: e.cover, title: e.title })),
    ...siteData.freelance.clients.map((c) => ({ key: c.cover, title: c.name })),
  ]
  const [i, setI] = useState(0)

  useEffect(() => {
    if (covers.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setI((p) => (p + 1) % covers.length), AUTO_MS)
    return () => clearInterval(id)
  }, [covers.length])

  if (covers.length === 0) return null

  return (
    <section className="s06 wrap" id="showreel">
      <div className="kicker">Showreel</div>
      <div className="s06-frame">
        {covers.map((c, idx) => (
          <div key={c.key + idx} className={`s06-slide${idx === i ? ' on' : ''}`} aria-hidden={idx !== i}>
            <Image
              src={img(c.key)}
              alt={c.title}
              fill
              sizes="100vw"
              style={{ objectFit: 'cover' }}
              placeholder={blur(c.key) ? 'blur' : 'empty'}
              blurDataURL={blur(c.key)}
            />
          </div>
        ))}
        <div className="s06-cap">{covers[i].title}</div>
      </div>
    </section>
  )
}
