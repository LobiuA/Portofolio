/**
 * Seamless infinite marquee. Two copies of the text; the CSS keyframe slides
 * the track by exactly -50% so the second copy lands where the first started.
 * Pauses for prefers-reduced-motion via the Block A kill-list.
 */
export default function MarqueeTicker({ text }: { text: string }) {
  return (
    <div className="marquee-wrap">
      <div className="marquee-track">
        <span className="marquee-content">{text}</span>
        <span className="marquee-content" aria-hidden="true">{text}</span>
      </div>
    </div>
  )
}
