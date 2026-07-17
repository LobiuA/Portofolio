'use client'

import Image from 'next/image'
import { siteData } from '@/lib/content'

// Editorial credits strip — "productions I've crewed". Wordmarks render as mono
// text by default; a logo entry with `src` renders as a white-silhouette image
// (usage rights cleared by the client). "Worked alongside" wording stays factual.
export default function ProofStrip() {
  const { proof } = siteData
  return (
    <section className="block block--tight" id="proof" style={{ background: 'var(--bg)' }}>
      <div className="wrap">
        <div className="proof-head" data-reveal="">
          <span className="kicker">{proof.kicker}</span>
          <h2>{proof.heading}</h2>
          <p>{proof.sub}</p>
        </div>

        {proof.logos.length > 0 && (
          <ul className="proof-logos" data-reveal="" data-delay="1">
            {proof.logos.map((l) => (
              <li key={l.key} className="proof-logo">
                {'src' in l && l.src ? (
                  <span className="proof-logo-img">
                    <Image src={l.src} alt={l.name} fill sizes="120px" style={{ objectFit: 'contain' }} />
                  </span>
                ) : (
                  l.name
                )}
              </li>
            ))}
          </ul>
        )}

        <ul className="proof-names" data-reveal="" data-delay="2">
          {proof.names.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}
