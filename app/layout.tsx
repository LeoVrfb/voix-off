import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Tiffany Voix Off — Comédienne, narratrice & voix off',
  description:
    'Tiffany Voix Off — Comédienne et lectrice. Livres audio, voix off publicitaire, narration corporate, audio guides. Studio à distance partout dans le monde.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className="bg-studio text-cream">{children}</body>
    </html>
  )
}
