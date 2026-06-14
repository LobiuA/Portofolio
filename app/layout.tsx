import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, Hanken_Grotesk, Space_Mono } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const hanken = Hanken_Grotesk({
  variable: '--font-hanken',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const spaceMono = Space_Mono({
  variable: '--font-space-mono',
  subsets: ['latin'],
  weight: ['400', '700'],
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Tri Muhammad Jidan — Broadcast & Livestream Operator',
  description:
    'Broadcast & livestream operator with 5+ years on live esports production crews — switching, graphics, audio and encoding for Valorant, Mobile Legends, PUBG Mobile and Free Fire events.',
  keywords: [
    'broadcast operator',
    'livestream operator',
    'esports production',
    'vMix',
    'OBS Studio',
    'live graphics',
    'audio operator',
    'in-game observer',
  ],
  authors: [{ name: 'Tri Muhammad Jidan' }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${spaceGrotesk.variable} ${hanken.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <a href="#main-content" className="sr-only skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
