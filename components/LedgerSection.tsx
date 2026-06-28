import { siteData } from '@/lib/content'

export default function LedgerSection() {
  const { ledger } = siteData
  return (
    <section className="block block--tight" id="ledger" style={{ background: 'var(--bg-2)' }} data-reveal="from-scale">
      <div className="wrap">
        <div className="section-head" data-reveal="">
          <span className="kicker">{ledger.kicker}</span>
          <h2>{ledger.heading}</h2>
        </div>
        <div className="ledger" data-reveal="">
          {ledger.rows.map((r) => (
            <div className="row" key={r.idx}>
              <span className="idx">{r.idx}</span>
              <span className="ttl">{r.title}</span>
              <span className="meta">{r.meta}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
