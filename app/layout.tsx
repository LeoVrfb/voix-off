import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tiffany Hengebaert — Comédienne de voix',
  description: 'Portfolio de Tiffany Hengebaert — Comédienne de voix. Voix off publicitaire, livres audio, narrations corporate.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
