# Tri Muhammad Jidan - Elite Broadcast Portfolio

A premium, interactive creative portfolio website built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, **GSAP**, and **Lenis** smooth scrolling.

## Features

✨ **Bold Editorial Design**
- Massive typography with `clamp()` for fluid scaling
- Full-bleed color blocks (Electric, Emerald, Coral)
- Floating card animations
- Brutalist aesthetic with premium animations

🎬 **High-Performance Animations**
- GSAP ScrollTrigger for scroll-driven reveals
- Lenis for buttery smooth scrolling
- Framer Motion for micro-interactions
- GPU-accelerated transforms

📱 **Fully Responsive**
- Desktop-first, mobile-optimized
- Accessible keyboard navigation
- Respects `prefers-reduced-motion`
- Touch-friendly on all devices

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: GSAP + ScrollTrigger + Lenis
- **Fonts**: Archivo (display) + Inter (body)
- **Images**: Next.js Image optimization

## Quick Start

### Installation

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run start
```

## Project Structure

```
portfolio-jidan/
├── app/
│   ├── page.tsx              # Main page
│   ├── layout.tsx            # Root layout with fonts
│   └── globals.css           # Global styles
├── components/
│   ├── SmoothScrollProvider.tsx    # Lenis integration
│   ├── HeroSection.tsx             # Hero with floating cards
│   ├── VisionSection.tsx           # Brand vision
│   ├── WorkSection.tsx            # Event portfolio grid
│   ├── ArchiveSection.tsx         # Archive section
│   ├── ProcessSection.tsx         # 3-step process
│   ├── CreateSection.tsx          # Final CTA
│   └── Footer.tsx                 # Footer navigation
├── lib/
│   └── content.ts            # All site content & data
├── public/
│   └── images/               # Portfolio images
└── tailwind.config.ts        # Tailwind customization
```

## Customization

### Update Content

Edit `lib/content.ts` to change all text, images, and data.

### Update Colors

Edit `tailwind.config.ts` to modify the color palette.

### Update Fonts

Edit `app/layout.tsx` to use different Google Fonts.

### Add Images

Place images in `public/images/` and update URLs in `lib/content.ts`.

## Deployment

Deploy on Vercel, Netlify, or any Node.js host.

```bash
vercel deploy
```

---

**Built with precision. Designed for impact.**
