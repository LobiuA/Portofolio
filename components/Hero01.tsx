// components/Hero01.tsx
import Image from 'next/image'
import { siteData } from '@/lib/content'

export default function Hero01() {
  const { nameLines, role, kicker, headshot, headshotBlur } = siteData.hero
  return (
    <section className="h01" id="top">
      <div className="h01-meta">
        <span>{kicker}</span>
      </div>
      <div className="h01-photo" data-reveal>
        <Image
          src={headshot}
          alt="Tri Muhammad Jidan"
          fill
          priority
          sizes="(max-width: 768px) 100vw, 380px"
          style={{ objectFit: 'cover' }}
          placeholder={headshotBlur ? 'blur' : 'empty'}
          blurDataURL={headshotBlur}
        />
      </div>
      <div className="h01-grid">
        <div className="h01-main">
          <h1 className="h01-name">
            {nameLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <div className="h01-rule" />
          <div className="h01-sub">
            <span>
              {role.pre}
              {role.accent}
              {role.post}
            </span>
            <span className="h01-hint">Scroll ↓</span>
          </div>
        </div>
      </div>
    </section>
  )
}
