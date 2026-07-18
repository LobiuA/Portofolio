// components/Capabilities04.tsx
'use client'

import { useState } from 'react'
import { CAP_GROUPS } from '@/lib/capabilities'

export default function Capabilities04() {
  const [open, setOpen] = useState(0)
  if (CAP_GROUPS.length === 0) return null
  return (
    <section className="c04 wrap" id="capabilities">
      <div className="kicker">Capabilities</div>
      <div className="c04-acc">
        {CAP_GROUPS.map((g, idx) => (
          <div key={g.title} className={`c04-item${idx === open ? ' open' : ''}`}>
            <button
              className="c04-head"
              aria-expanded={idx === open}
              onClick={() => setOpen(idx === open ? -1 : idx)}
            >
              <span>{g.title}</span>
              <span className="c04-pm">+</span>
            </button>
            <div className="c04-body">
              <div className="c04-inner">
                <div className="c04-pad">
                  <div>
                    <h4>Roles</h4>
                    <ul>
                      {g.roles.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4>Experience</h4>
                    <ul>
                      {g.experience.map((e) => (
                        <li key={e}>{e}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
