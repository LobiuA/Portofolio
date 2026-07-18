// components/Manifesto02.tsx
import Image from 'next/image'
import { siteData } from '@/lib/content'
import WordReveal from '@/components/WordReveal'

const stripTags = (s: string) => s.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&')

export default function Manifesto02() {
  const { about, hero } = siteData
  const statement = stripTags(about.paras[0])
  return (
    <section className="m02 wrap" id="about">
      <div className="kicker">About</div>
      <WordReveal as="blockquote" className="m02-statement" text={statement} />
      <div className="m02-cols">
        <div className="m02-photo" data-reveal>
          <Image
            src={about.portrait}
            alt="Tri Muhammad Jidan"
            fill
            sizes="(max-width: 700px) 100vw, 320px"
            style={{ objectFit: 'cover' }}
            placeholder={about.portraitBlur ? 'blur' : 'empty'}
            blurDataURL={about.portraitBlur}
          />
        </div>
        <div className="m02-bio">
          {about.paras.slice(1).map((p, i) => (
            <p key={i} data-reveal dangerouslySetInnerHTML={{ __html: p }} />
          ))}
          {about.chips && about.chips.length > 0 && (
            <div className="m02-chips" data-reveal>
              <h4>{about.interestsLabel || 'Interests'}</h4>
              <div className="m02-chips-list">
                {about.chips.map((c: string) => (
                  <span key={c} className="m02-chip">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="m02-stats" data-reveal>
            {hero.stats.map((s) => (
              <div className="m02-stat" key={s.label}>
                <span className="m02-num">
                  {s.n}
                  {s.plus}
                </span>
                <span className="m02-lbl">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
