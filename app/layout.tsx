import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import { APIKeyProvider } from '@/contexts/APIKeyContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: 'Explore NASA - Space Data Explorer',
  description: 'Discover the wonders of space through NASA\'s public APIs. Explore astronomy pictures, Mars rover photos, asteroids, and more.',
  keywords: 'NASA, space, astronomy, Mars rover, APOD, asteroids, space weather, ISS',
  authors: [{ name: 'Space Explorer Team' }],
  openGraph: {
    title: 'Explore NASA - Space Data Explorer',
    description: 'Discover the wonders of space through NASA\'s public APIs',
    url: './',
    siteName: 'Explore NASA',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Explore NASA - Space Data Explorer',
      },
    ],
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore NASA - Space Data Explorer',
    description: 'Discover the wonders of space through NASA\'s public APIs',
    images: ['/twitter-image.png'],
  },
  robots: 'index, follow',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <APIKeyProvider>
          <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </APIKeyProvider>
      </body>
    </html>
  )
}