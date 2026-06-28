'use client'

import { siteData } from '@/lib/content'
import { useState } from 'react'

export default function ContactSection() {
  const { contact } = siteData
  const [form, setForm] = useState({ name: '', email: '', message: '' })

  function submit(e: React.FormEvent) {
    e.preventDefault()
    const subject = encodeURIComponent(`Portfolio inquiry from ${form.name}`)
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`,
    )
    window.location.href = `mailto:${contact.links[0].val}?subject=${subject}&body=${body}`
  }

  return (
    <section className="block contact" id="contact" data-reveal="from-right">
      <div className="wrap">
        <div className="contact-card" data-reveal="">
          <div className="contact-intro">
            <span className="kicker">{contact.kicker}</span>
            <h2 style={{ marginTop: 18 }}>
              {contact.heading.map((line, idx) => (
                <span key={line}>
                  {line}
                  {idx < contact.heading.length - 1 && <br />}
                </span>
              ))}
            </h2>
            <p>{contact.sub}</p>
          </div>

          <div className="contact-grid">
            {/* Direct links */}
            <div className="contact-links">
              {contact.links.map((l) => (
                <a className="clink" href={l.href} key={l.type}>
                  <span>
                    <span className="lbl">{l.lbl}</span>
                    <span className="val">{l.val}</span>
                  </span>
                  <span className="arr">↗</span>
                </a>
              ))}
            </div>

            {/* Quick form */}
            <form className="cform" onSubmit={submit}>
              <label className="cfield">
                <span className="cfield-label">Name</span>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your name"
                />
              </label>
              <label className="cfield">
                <span className="cfield-label">Email</span>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                />
              </label>
              <label className="cfield">
                <span className="cfield-label">Message</span>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Project details, dates, scope…"
                />
              </label>
              <button type="submit" className="cform-btn">
                SEND SIGNAL →
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}
