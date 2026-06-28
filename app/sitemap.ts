export const runtime = 'edge'

export default function sitemap() {
  return [
    {
      url: 'https://portofoliotmj.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 1,
    },
  ]
}
