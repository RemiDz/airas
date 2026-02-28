import type { Metadata } from 'next'
import Script from 'next/script'
import { Cormorant_Garamond, Lato, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  title: 'Airas — Air Quality Intelligence for Practitioners',
  description:
    "Real-time air quality, pollen, and UV monitoring designed for breathwork facilitators, sound healers, and wellness practitioners. Know what you're breathing.",
  keywords:
    'air quality, breathwork, pollen forecast, UV index, sound healing, pranayama, outdoor yoga, wellness practitioner, AQI',
  metadataBase: new URL('https://airas.app'),
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.svg',
  },
  openGraph: {
    title: 'Airas — Air Quality Intelligence',
    description:
      'Real-time air quality monitoring for breathwork and sound healing practitioners.',
    url: 'https://airas.app',
    siteName: 'Airas',
    locale: 'en_GB',
    type: 'website',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'Airas — Air Quality Intelligence',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Airas — Air Quality Intelligence',
    description:
      'Air quality monitoring designed for breathwork and sound healing practitioners.',
    images: ['/og-image.svg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#A8DADC" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.svg" />
      </head>
      <body
        className={`${cormorant.variable} ${lato.variable} ${jetbrains.variable} antialiased`}
      >
        {children}
        <Script
          defer
          data-domain="airas.app"
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  )
}
