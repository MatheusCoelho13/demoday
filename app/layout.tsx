import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Flowfest - Peça, pague e retire sem fila',
  description: 'Sistema de pedidos para bares e festivais',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className="bg-dark-graphite text-white min-h-screen">
        {children}
      </body>
    </html>
  )
}


