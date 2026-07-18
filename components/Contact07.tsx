// components/Contact07.tsx
import { siteData } from '@/lib/content'
import WordReveal from '@/components/WordReveal'

export default function Contact07() {
  const { contact } = siteData
  const email = contact.links.find((l) => l.type === 'email')
  const socials = contact.links.filter((l) => l.type !== 'email')
  return (
    <section className="ct07 wrap" id="contact">
      <div className="kicker">Contact</div>
      <WordReveal as="h2" className="ct07-h" text={contact.heading.join(' ')} />
      {email && (
        <a className="ct07-mail" href={email.href}>
          {email.val}
        </a>
      )}
      <div className="ct07-social">
        {socials.map((s) => (
          <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer">
            {s.lbl}
          </a>
        ))}
      </div>
    </section>
  )
}
