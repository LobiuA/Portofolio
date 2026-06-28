import type { Metadata, Viewport } from 'next'
import { Barlow_Condensed, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const barlow = Barlow_Condensed({
  variable: '--font-barlow',
  subsets: ['latin'],
  weight: ['700', '900'],
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
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
  openGraph: {
    title: 'Tri Muhammad Jidan — Broadcast & Livestream Operator',
    description:
      'Broadcast & livestream operator with 5+ years on live esports production crews.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tri Muhammad Jidan — Broadcast & Livestream Operator',
    description:
      'Broadcast & livestream operator with 5+ years on live esports production crews.',
  },
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
      className={`${barlow.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <a href="#main-content" className="sr-only skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  )
}
