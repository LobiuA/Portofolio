'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { blur, mediaPoster, mediaVideo, siteData } from '@/lib/content'

type Gfx = {
  id: string
  title: string
  type: string
  tools: string
  media: string
  caption: string
}

// Inline graphics gallery, folded in from the old GraphicsSection. Each item
// tries a looping .webm first; onError flips the slot to the .jpg poster.
function SkillsGraphicsCard({ g }: { g: Gfx }) {
  const [useImage, setUseImage] = useState(false)

  return (
    <article className="skills-graphics-card" data-reveal="">
      <div className="skills-graphics-media">
        {!useImage ? (
          <video
            className="skills-graphics-vid"
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
        <span className="skills-graphics-type">{g.type}</span>
      </div>
      <div className="skills-graphics-body">
        <h3>{g.title}</h3>
        <div className="skills-graphics-tools">{g.tools}</div>
        <p>{g.caption}</p>
      </div>
    </article>
  )
}

export default function SkillsSection() {
  const { skills, graphics } = siteData
  return (
    <section className="block block--tight" id="skills" style={{ background: 'var(--bg-2)' }} data-reveal="from-scale">
      <div className="wrap">
        <div className="section-head" data-reveal="">
          <span className="kicker">{skills.kicker}</span>
          <h2>{skills.heading}</h2>
          <p>{skills.sub}</p>
        </div>

        <div className="cols">
          <div className="tool-grid">
            {skills.tools.map((t, idx) => (
              <div className="tool" data-reveal="" data-delay={idx || undefined} key={t.name}>
                <div className="glyph">{t.glyph}</div>
                <div>
                  <div className="tn">{t.name}</div>
                  <div className="td">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="meter-list" data-reveal="" data-delay="1">
            {skills.meters.map((m) => (
              <div className="meter" key={m.name}>
                <div className="top">
                  <span className="name">{m.name}</span>
                  <span className="lvl">{m.level}</span>
                </div>
                <div className="bar">
                  <span className="fill" data-w={m.w} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="role-tags" data-reveal="" data-delay="2">
          {skills.roleTags.map((rt) => (
            <span className="rt" key={rt}>
              <b>·</b> {rt}
            </span>
          ))}
        </div>

        {/* Inline graphics gallery (folded in from GraphicsSection) */}
        {graphics.items.length > 0 && (
          <div className="skills-graphics">
            <div className="skills-graphics-grid">
              {graphics.items.map((g) => (
                <SkillsGraphicsCard key={g.id} g={g} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
