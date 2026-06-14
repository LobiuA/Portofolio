'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { accents } from '@/lib/content'
import Lightbox from '@/components/Lightbox'

type Accent = (typeof accents)[number]
type Theme = 'dark' | 'light'

interface ChromeCtx {
  theme: Theme
  toggleTheme: () => void
  accent: Accent
  setAccent: (a: Accent) => void
  openLightbox: (event: string) => void
}

const Ctx = createContext<ChromeCtx | null>(null)

export function usePortfolio() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioChrome')
  return ctx
}

export default function PortfolioChrome({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark')
  const [accent, setAccentState] = useState<Accent>(accents[0])
  const [lbEvent, setLbEvent] = useState<string | null>(null)

  /* ---------- restore persisted theme + accent ---------- */
  useEffect(() => {
    const savedTheme = localStorage.getItem('tmj-theme') as Theme | null
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme)
      document.documentElement.setAttribute('data-theme', savedTheme)
    }
    const savedAccent = localStorage.getItem('tmj-accent')
    if (savedAccent) {
      try {
        const a = JSON.parse(savedAccent) as Accent
        if (a?.c) {
          setAccentState(a)
          document.documentElement.style.setProperty('--accent', a.c)
          document.documentElement.style.setProperty('--accent-ink', a.ink)
        }
      } catch {
        /* ignore */
      }
    }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'light' ? 'dark' : 'light'
      document.documentElement.setAttribute('data-theme', next)
      localStorage.setItem('tmj-theme', next)
      return next
    })
  }, [])

  const setAccent = useCallback((a: Accent) => {
    setAccentState(a)
    document.documentElement.style.setProperty('--accent', a.c)
    document.documentElement.style.setProperty('--accent-ink', a.ink)
    localStorage.setItem('tmj-accent', JSON.stringify(a))
  }, [])

  const openLightbox = useCallback((event: string) => setLbEvent(event), [])

  /* ---------- scroll reveal + meter fill ---------- */
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const fillMeters = (scope: ParentNode) =>
      scope.querySelectorAll<HTMLElement>('.fill[data-w]').forEach((f) => {
        f.style.width = f.dataset.w || ''
      })

    if (reduce) {
      document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => el.classList.add('in'))
      fillMeters(document)
      return
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement
            el.classList.add('in')
            fillMeters(el)
            io.unobserve(el)
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    )
    document.querySelectorAll<HTMLElement>('[data-reveal]:not(.in)').forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  /* ---------- cursor glow ---------- */
  const glowRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!window.matchMedia('(hover: hover)').matches) return
    const glow = glowRef.current
    if (!glow) return
    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      raf: number | null = null
    const loop = () => {
      cx += (tx - cx) * 0.12
      cy += (ty - cy) * 0.12
      glow.style.transform = `translate(${cx}px, ${cy}px) translate(-50%,-50%)`
      if (Math.abs(tx - cx) > 0.5 || Math.abs(ty - cy) > 0.5) raf = requestAnimationFrame(loop)
      else raf = null
    }
    const onMove = (e: MouseEvent) => {
      tx = e.clientX
      ty = e.clientY
      glow.classList.add('on')
      if (!raf) raf = requestAnimationFrame(loop)
    }
    const onLeave = () => glow.classList.remove('on')
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <Ctx.Provider value={{ theme, toggleTheme, accent, setAccent, openLightbox }}>
      <div className="cursor-glow" ref={glowRef} aria-hidden="true" />
      {children}
      <Lightbox event={lbEvent} onClose={() => setLbEvent(null)} />
    </Ctx.Provider>
  )
}
