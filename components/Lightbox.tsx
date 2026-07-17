'use client'

import { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import { blur, galleryData, img } from '@/lib/content'

export default function Lightbox({
  event,
  onClose,
}: {
  event: string | null
  onClose: () => void
}) {
  const data = event ? galleryData[event] : null
  // i resets to 0 naturally on remount (PortfolioChrome passes key={lbEvent ?? ''})
  const [i, setI] = useState(0)

  const step = useCallback(
    (d: number) => {
      if (!data) return
      setI((prev) => (prev + d + data.imgs.length) % data.imgs.length)
    },
    [data],
  )

  // lock scroll + wire keyboard while open
  useEffect(() => {
    if (!data) return
    document.body.style.overflow = 'hidden'
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') step(1)
      else if (e.key === 'ArrowLeft') step(-1)
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [data, onClose, step])

  if (!data) return null

  const [file, cap, href] = data.imgs[i]

  return (
    <div
      className="lightbox open"
      id="lightbox"
      aria-hidden="false"
      role="dialog"
      aria-modal="true"
      aria-label={data.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <button className="lb-close" aria-label="Close" onClick={onClose}>
        ✕
      </button>
      <button className="lb-nav lb-prev" aria-label="Previous" onClick={() => step(-1)}>
        ‹
      </button>
      <button className="lb-nav lb-next" aria-label="Next" onClick={() => step(1)}>
        ›
      </button>
      <div
        className="lb-stage"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose()
        }}
      >
        <div className="lb-frame">
          <span className="lb-tally">
            <span className="dot" />
            REC
          </span>
          <Image
            src={img(file)}
            alt={cap}
            fill
            sizes="(max-width: 640px) 100vw, min(1100px, 100vw)"
            quality={85}
            style={{ objectFit: 'contain' }}
            placeholder={blur(file) ? 'blur' : 'empty'}
            blurDataURL={blur(file)}
          />
        </div>
        <div className="lb-meta">
          <div className="lb-title">{data.title}</div>
          <div className="lb-caption">{cap}</div>
          {href && (
            <a className="lb-link" href={href} target="_blank" rel="noopener noreferrer">
              ▶ Watch broadcast ↗
            </a>
          )}
          <div className="lb-index">
            {i + 1} / {data.imgs.length}
          </div>
        </div>
      </div>
      <div className="lb-thumbs">
        {data.imgs.map(([k, c], idx) => (
          <Image
            key={k}
            src={img(k)}
            alt={c}
            width={92}
            height={56}
            className={idx === i ? 'active' : ''}
            onClick={() => setI(idx)}
            style={{ cursor: 'pointer' }}
            placeholder={blur(k) ? 'blur' : 'empty'}
            blurDataURL={blur(k)}
          />
        ))}
      </div>
    </div>
  )
}
