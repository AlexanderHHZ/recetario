// ============================================================
//  RECETARIO DIGITAL — Layout raíz (CORREGIDO)
//  src/app/layout.tsx
// ============================================================

import type { Metadata } from 'next'
import { Inter } from 'next/font/google' // Cambiamos Geist por Inter
import './globals.css'
import Navbar from '@/components/layout/Navbar'

// Configuramos la fuente Inter que es más compatible
const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans', 
})

export const metadata: Metadata = {
  title: { 
    default: 'Recetario Digital — Ingrediente 791', 
    template: '%s | Ingrediente 791' 
  },
  description: 'Recetas auténticas del canal Ingrediente 791. Cocina sana, sabrosa y fácil.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="min-h-screen bg-stone-50 text-stone-900 antialiased font-sans">
        <Navbar />
        
        <main>
          {children}
        </main>

        <footer className="mt-20 border-t border-stone-100 bg-white py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-stone-400">
              © {new Date().getFullYear()} Ingrediente 791. Todos los derechos reservados.
            </p>
            
            <div className="flex items-center gap-1">
              <span className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
                791
              </span>
              <span className="text-sm font-medium text-stone-600 ml-1">
                Ingrediente 791
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  )
}