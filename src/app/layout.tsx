import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'DreamDaa - Empowering Tamil Nadu Students Through AI-Powered English Learning',
  description: 'Help underprivileged students in Tamil Nadu break language barriers with our AI-powered English learning app. Adopt a student, adopt a school, make a difference.',
  keywords: ['nonprofit', 'education', 'Tamil Nadu', 'English learning', 'AI', 'donation', 'sponsorship'],
  authors: [{ name: 'DreamDaa Initiative' }],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://dreamdaa.org',
    siteName: 'DreamDaa',
    title: 'DreamDaa - Empowering Tamil Nadu Students',
    description: 'Help underprivileged students in Tamil Nadu break language barriers with our AI-powered English learning app.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DreamDaa - Empowering Tamil Nadu Students',
    description: 'Help underprivileged students in Tamil Nadu break language barriers with our AI-powered English learning app.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}