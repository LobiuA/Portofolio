'use client'

import { useEffect, useState } from 'react'

interface Testimonial {
  quote: string
  stars: string
  cite: string
}

export default function TestimonialCarousel({
  items,
}: {
  items: Testimonial[]
}) {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (items.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      setActive((i) => (i + 1) % items.length)
    }, 5000)
    return () => clearInterval(id)
  }, [items.length])

  return (
    <div className="test-stage" data-reveal="">
      {items.map((t, i) => (
        <figure className="test-card" key={i} data-active={i === active || undefined}>
          <blockquote>"{t.quote.replace(/^[""]|[""]$/g, '')}"</blockquote>
          <figcaption>
            <span className="stars">{t.stars}</span>
            {' '}{t.cite}
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
