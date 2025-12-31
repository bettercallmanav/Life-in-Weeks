import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Life in Weeks',
  description: 'Visualize your life as a grid of weeks. Make them count.',
  keywords: ['life', 'weeks', 'time', 'visualization', 'memento mori'],
  authors: [{ name: 'Life in Weeks' }],
  openGraph: {
    title: 'Life in Weeks',
    description: 'Visualize your life as a grid of weeks. Make them count.',
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
      <body className="min-h-screen" data-zoom="medium">
        {children}
      </body>
    </html>
  )
}
