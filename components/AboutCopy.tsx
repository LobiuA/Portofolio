'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * About paragraphs with a scroll-scrubbed word reveal: each word starts at 0.1
 * opacity and brightens to 1 as the block scrolls through the viewport, so the
 * copy "develops" like a print coming up in a darkroom.
 *
 * The paragraphs arrive as HTML (they contain <span class="mark">), so instead
 * of a naive split() we walk the text nodes and wrap each word — that keeps the
 * amber-marked phrases intact while still animating their words individually.
 */
function wrapWords(node: Node, out: HTMLSpanElement[]) {
  node.childNodes.forEach((child) => {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent ?? ''
      if (!text.trim()) return
      const frag = document.createDocumentFragment()
      text.split(/(\s+)/).forEach((token) => {
        if (token.trim()) {
          const span = document.createElement('span')
          span.className = 'word-reveal'
          span.textContent = token
          frag.appendChild(span)
          out.push(span)
        } else {
          frag.appendChild(document.createTextNode(token))
        }
      })
      child.replaceWith(frag)
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      wrapWords(child, out)
    }
  })
}

export default function AboutCopy({ paras }: { paras: string[] }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return

    const words: HTMLSpanElement[] = []
    wrapWords(root, words)
    if (!words.length) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(words, { opacity: 1 })
      return
    }

    gsap.set(words, { opacity: 0.12 })
    const tween = gsap.to(words, {
      opacity: 1,
      ease: 'none',
      stagger: 0.5,
      scrollTrigger: {
        trigger: root,
        start: 'top 80%',
        end: 'bottom 60%',
        scrub: true,
      },
    })

    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  }, [])

  return (
    <div ref={ref}>
      {paras.map((p, idx) => (
        <p
          key={idx}
          style={idx === 0 ? { marginTop: 22 } : undefined}
          dangerouslySetInnerHTML={{ __html: p }}
        />
      ))}
    </div>
  )
}
