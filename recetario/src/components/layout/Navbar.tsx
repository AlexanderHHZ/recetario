'use client'
// ============================================================
//  RECETARIO DIGITAL — Navbar
//  src/components/layout/Navbar.tsx
// ============================================================

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import BuscadorModal from './BuscadorModal'

const LINKS = [
  { href: '/',          label: 'Inicio'    },
  { href: '/sobre-mi',  label: 'Sobre mí'  },
  { href: '/contacto',  label: 'Contacto'  },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuAbierto, setMenuAbierto] = useState(false)
  const [buscadorAbierto, setBuscadorAbierto] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-sm border-b border-stone-100 shadow-sm">
        <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
              791
            </span>
            <span className="font-semibold text-stone-800 tracking-tight hidden sm:block">
              Ingrediente 791
            </span>
          </Link>

          {/* Links — desktop */}
          <div className="hidden md:flex items-center gap-1">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === href
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Acciones */}
          <div className="flex items-center gap-2">
            {/* Buscador */}
            <button
              onClick={() => setBuscadorAbierto(true)}
              className="p-2 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
              aria-label="Abrir buscador"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
            </button>

            {/* Iniciar sesión */}
            <Link
              href="/admin"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4M10 17l5-5-5-5M15 12H3" />
              </svg>
              Admin
            </Link>

            {/* Hamburguesa — mobile */}
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="md:hidden p-2 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors"
              aria-label="Abrir menú"
            >
              {menuAbierto ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M3 12h18M3 6h18M3 18h18" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Menú móvil */}
        {menuAbierto && (
          <div className="md:hidden border-t border-stone-100 bg-white px-4 py-3 space-y-1">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuAbierto(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === href
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                {label}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setMenuAbierto(false)}
              className="block px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 transition-colors mt-2"
            >
              Iniciar sesión (Admin)
            </Link>
          </div>
        )}
      </header>

      {buscadorAbierto && (
        <BuscadorModal onClose={() => setBuscadorAbierto(false)} />
      )}
    </>
  )
}
