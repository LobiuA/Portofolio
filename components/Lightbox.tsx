'use client'

import { useCallback, useEffect, useState } from 'react'
import { galleryData, img } from '@/lib/content'

export default function Lightbox({
  event,
  onClose,
}: {
  event: string | null
  onClose: () => void
}) {
  const data = event ? galleryData[event] : null
  const [i, setI] = useState(0)

  // reset to first shot whenever a new set opens
  useEffect(() => {
    setI(0)
  }, [event])

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

  const [file, cap] = data.imgs[i]

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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={img(file)} alt={cap} />
        </div>
        <div className="lb-meta">
          <div className="lb-title">{data.title}</div>
          <div className="lb-caption">{cap}</div>
          <div className="lb-index">
            {i + 1} / {data.imgs.length}
          </div>
        </div>
      </div>
      <div className="lb-thumbs">
        {data.imgs.map(([k, c], idx) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={k}
            src={img(k)}
            alt={c}
            loading="lazy"
            className={idx === i ? 'active' : ''}
            onClick={() => setI(idx)}
          />
        ))}
      </div>
    </div>
  )
}
