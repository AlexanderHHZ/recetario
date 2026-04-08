'use client'
// ============================================================
//  RECETARIO DIGITAL — Navbar con Auth
//  src/components/layout/Navbar.tsx
//
//  Muestra: login/registro si no hay sesión,
//           nombre + cerrar sesión si hay sesión,
//           botón Admin si el rol es editor/superadmin.
// ============================================================

import Link from 'next/link'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import BuscadorModal from './BuscadorModal'

const LINKS = [
  { href: '/',         label: 'Inicio'   },
  { href: '/sobre-mi', label: 'Sobre mí' },
  { href: '/contacto', label: 'Contacto' },
]

export default function Navbar() {
  const pathname              = usePathname()
  const router                = useRouter()
  const { user, perfil, signOut, loading } = useAuth()
  const [menuAbierto,     setMenuAbierto]     = useState(false)
  const [buscadorAbierto, setBuscadorAbierto] = useState(false)
  const [userMenuAbierto, setUserMenuAbierto] = useState(false)

  const esAdmin = perfil?.rol === 'superadmin' || perfil?.rol === 'editor'

  const handleSignOut = async () => {
    await signOut()
    setUserMenuAbierto(false)
    router.push('/')
  }

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

          {/* Links desktop */}
          <div className="hidden md:flex items-center gap-1">
            {LINKS.map(({ href, label }) => (
              <Link
                key={href} href={href}
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
              aria-label="Buscar"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </button>

            {/* Auth — desktop */}
            {!loading && (
              <div className="hidden sm:flex items-center gap-2">
                {user ? (
                  /* Usuario logueado */
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuAbierto(!userMenuAbierto)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-stone-50 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-orange-600 font-semibold text-xs">
                        {perfil?.nombre?.[0]?.toUpperCase() ?? '?'}
                      </div>
                      <span className="text-sm font-medium text-stone-700 max-w-[100px] truncate">
                        {perfil?.nombre ?? 'Usuario'}
                      </span>
                      <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="m6 9 6 6 6-6"/>
                      </svg>
                    </button>

                    {/* Dropdown */}
                    {userMenuAbierto && (
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden z-50">
                        <div className="px-4 py-3 border-b border-stone-100">
                          <p className="text-xs font-medium text-stone-800 truncate">{perfil?.nombre}</p>
                          <p className="text-xs text-stone-400 truncate">{perfil?.email}</p>
                          {esAdmin && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-orange-50 text-orange-600 text-xs rounded-full font-medium">
                              {perfil?.rol}
                            </span>
                          )}
                        </div>
                        {esAdmin && (
                          <Link
                            href="/admin"
                            onClick={() => setUserMenuAbierto(false)}
                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-stone-700 hover:bg-stone-50 transition-colors"
                          >
                            <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                              <rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/>
                              <rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>
                            </svg>
                            Panel admin
                          </Link>
                        )}
                        <button
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
                          </svg>
                          Cerrar sesión
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  /* No logueado */
                  <>
                    <Link
                      href="/login"
                      className="px-4 py-2 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
                    >
                      Entrar
                    </Link>
                    <Link
                      href="/registro"
                      className="px-4 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium transition-colors"
                    >
                      Registrarse
                    </Link>
                  </>
                )}
              </div>
            )}

            {/* Hamburguesa mobile */}
            <button
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="md:hidden p-2 rounded-lg text-stone-500 hover:bg-stone-100 transition-colors"
              aria-label="Menú"
            >
              {menuAbierto ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M6 18 18 6M6 6l12 12"/>
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M3 12h18M3 6h18M3 18h18"/>
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
                key={href} href={href}
                onClick={() => setMenuAbierto(false)}
                className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === href ? 'bg-orange-50 text-orange-600' : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                {label}
              </Link>
            ))}
            <div className="pt-2 border-t border-stone-100 space-y-1">
              {user ? (
                <>
                  <p className="px-4 py-2 text-xs text-stone-400">
                    Conectado como <span className="font-medium text-stone-600">{perfil?.nombre}</span>
                  </p>
                  {esAdmin && (
                    <Link href="/admin" onClick={() => setMenuAbierto(false)}
                      className="block px-4 py-2.5 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50">
                      Panel admin
                    </Link>
                  )}
                  <button onClick={handleSignOut}
                    className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50">
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMenuAbierto(false)}
                    className="block px-4 py-2.5 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-50">
                    Iniciar sesión
                  </Link>
                  <Link href="/registro" onClick={() => setMenuAbierto(false)}
                    className="block px-4 py-2.5 rounded-lg text-sm font-medium text-white bg-orange-500 hover:bg-orange-600">
                    Registrarse
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Overlay para cerrar dropdown */}
      {userMenuAbierto && (
        <div className="fixed inset-0 z-30" onClick={() => setUserMenuAbierto(false)} />
      )}

      {buscadorAbierto && (
        <BuscadorModal onClose={() => setBuscadorAbierto(false)} />
      )}
    </>
  )
}
