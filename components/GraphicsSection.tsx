'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { blur, mediaPoster, mediaVideo, siteData } from '@/lib/content'

// Motion-graphics gallery. Each item tries a looping .webm first; if that asset
// is missing we fall back to the .jpg poster. "Missing" is detected onerror and
// flips the slot to image-only. Items without any asset render a placeholder cell.
export default function GraphicsSection() {
  const { graphics } = siteData
  return (
    <section className="block" id="graphics" style={{ background: 'var(--bg-2)' }}>
      <div className="wrap">
        <div className="section-head" data-reveal="">
          <span className="kicker">{graphics.kicker}</span>
          <h2>{graphics.heading}</h2>
          <p>{graphics.sub}</p>
        </div>

        <div className="gfx-grid">
          {graphics.items.map((g, idx) => (
            <GfxCard key={g.id} g={g} delay={idx} />
          ))}
        </div>
      </div>
    </section>
  )
}

function GfxCard({
  g,
  delay,
}: {
  g: { id: string; title: string; type: string; tools: string; media: string; caption: string }
  delay: number
}) {
  const vidRef = useRef<HTMLVideoElement>(null)
  const [useImage, setUseImage] = useState(false)

  return (
    <article className="gfx" data-reveal="" data-delay={delay || undefined}>
      <div className="gfx-media">
        {!useImage ? (
          <video
            ref={vidRef}
            className="gfx-vid"
            src={mediaVideo(g.media)}
            poster={mediaPoster(g.media)}
            muted
            loop
            playsInline
            preload="none"
            onError={() => setUseImage(true)}
          />
        ) : (
          <Image
            src={mediaPoster(g.media)}
            alt={g.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 33vw"
            style={{ objectFit: 'cover' }}
            placeholder={blur(g.media) ? 'blur' : 'empty'}
            blurDataURL={blur(g.media)}
          />
        )}
        <span className="gfx-type">{g.type}</span>
      </div>
      <div className="gfx-body">
        <h3>{g.title}</h3>
        <div className="gfx-tools">{g.tools}</div>
        <p>{g.caption}</p>
      </div>
    </article>
  )
}
