import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  title: 'LinkSnap - Professional URL Shortener',
  description: 'Shorten URLs with custom aliases, QR codes, and click tracking. Fast, secure, and production-ready.',
  keywords: 'url shortener, link shortener, qr code, click tracking',
  authors: [{ name: 'LinkSnap' }],
  openGraph: {
    title: 'LinkSnap - Professional URL Shortener',
    description: 'Shorten URLs with custom aliases, QR codes, and click tracking',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}

