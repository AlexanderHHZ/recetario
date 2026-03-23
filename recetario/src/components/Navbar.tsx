'use client'

// src/components/Navbar.tsx
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ChefHat,
  LayoutDashboard,
  Heart,
  LogIn,
  UserPlus,
  LogOut,
  User,
  Loader2,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function Navbar() {
  const router = useRouter()
  const { user, perfil, cargando, cerrarSesion } = useAuth()

  const handleCerrarSesion = async () => {
    await cerrarSesion()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-amber-100 shadow-sm shadow-amber-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-bold text-gray-900 hover:text-amber-600 transition-colors"
        >
          <div className="flex items-center justify-center w-9 h-9 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl shadow-sm">
            <ChefHat className="w-5 h-5 text-white" strokeWidth={1.5} />
          </div>
          <span className="text-lg tracking-tight">
            Recetario<span className="text-amber-500">Digital</span>
          </span>
        </Link>

        {/* Links de navegación central */}
        <div className="hidden md:flex items-center gap-1">
          <Link
            href="/recetas"
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-amber-50 rounded-lg transition-colors"
          >
            Recetas
          </Link>
          <Link
            href="/categorias"
            className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-amber-50 rounded-lg transition-colors"
          >
            Categorías
          </Link>
        </div>

        {/* Sección derecha: condicional por rol */}
        <div className="flex items-center gap-2">
          {cargando ? (
            /* Estado de carga */
            <div className="flex items-center gap-2 text-gray-400">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs hidden sm:block">Cargando...</span>
            </div>
          ) : !user ? (
            /* ── INVITADO ──────────────────────────── */
            <>
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600
                  hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <LogIn className="w-4 h-4" strokeWidth={1.5} />
                <span>Iniciar sesión</span>
              </Link>
              <Link
                href="/registro"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white
                  bg-gradient-to-r from-amber-400 to-orange-500
                  hover:from-amber-500 hover:to-orange-600
                  rounded-xl shadow-sm shadow-amber-200 transition-all duration-200
                  hover:shadow-md hover:-translate-y-px active:translate-y-0"
              >
                <UserPlus className="w-4 h-4" strokeWidth={1.5} />
                <span className="hidden sm:block">Registrarse</span>
              </Link>
            </>
          ) : perfil?.rol === 'admin' ? (
            /* ── ADMIN ─────────────────────────────── */
            <>
              <Link
                href="/admin"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium
                  text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-xl
                  border border-purple-200 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" strokeWidth={1.5} />
                <span>Panel Admin</span>
              </Link>
              <BotonCerrarSesion onCerrar={handleCerrarSesion} nombre={perfil.nombre} />
            </>
          ) : (
            /* ── USUARIO NORMAL ─────────────────────── */
            <>
              <Link
                href="/favoritos"
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium
                  text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors"
              >
                <Heart className="w-4 h-4" strokeWidth={1.5} />
                <span className="hidden sm:block">Favoritos</span>
              </Link>
              <BotonCerrarSesion onCerrar={handleCerrarSesion} nombre={perfil?.nombre} />
            </>
          )}
        </div>
      </nav>
    </header>
  )
}

// ── Sub-componente: Botón de Cerrar Sesión con avatar ───────
function BotonCerrarSesion({
  onCerrar,
  nombre,
}: {
  onCerrar: () => Promise<void>
  nombre: string | null | undefined
}) {
  return (
    <div className="flex items-center gap-1">
      {/* Avatar / nombre */}
      <div className="hidden sm:flex items-center gap-1.5 px-2 py-1.5 text-xs text-gray-500">
        <User className="w-3.5 h-3.5" strokeWidth={1.5} />
        <span className="max-w-[80px] truncate">{nombre ?? 'Usuario'}</span>
      </div>

      {/* Botón cerrar sesión */}
      <button
        onClick={onCerrar}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium
          text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl
          transition-colors group"
        title="Cerrar sesión"
      >
        <LogOut
          className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
          strokeWidth={1.5}
        />
        <span className="hidden sm:block">Salir</span>
      </button>
    </div>
  )
}
