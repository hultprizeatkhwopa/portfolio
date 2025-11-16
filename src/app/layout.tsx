import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import InstallPWA from '@/components/InstallPWA'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hult Prize - Khwopa College of Engineering',
  description: 'Official website for Hult Prize at Khwopa College of Engineering',
  manifest: '/manifest.json',
  themeColor: '#ec4899',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Hult Prize KCE',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  icons: {
    icon: '/icon-192x192.png',
    apple: '/icon-192x192.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ec4899" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Hult Prize KCE" />
      </head>
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <InstallPWA />
        <footer className="bg-gray-100 border-t border-gray-200 py-8 mt-12">
          <div className="container mx-auto px-4 text-center text-gray-600">
            <p>&copy; 2025 Hult Prize - Khwopa College of Engineering. All rights reserved.</p>
          </div>
        </footer>
      </body>
    </html>
  )
}
