'use client'

// src/app/login/page.tsx
import { useState, useActionState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ChefHat, Mail, Lock, AlertCircle, Loader2, ArrowRight } from 'lucide-react'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

type EstadoFormulario = {
  error: string | null
}

export default function PaginaLogin() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/'

  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createSupabaseBrowserClient()

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setCargando(true)
    setError(null)

    const formData = new FormData(event.currentTarget)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      // 1. Autenticar con Supabase Auth
      const { data: authData, error: authError } =
        await supabase.auth.signInWithPassword({ email, password })

      if (authError) {
        // Mensajes amigables según el código de error
        if (authError.message.includes('Invalid login credentials')) {
          throw new Error('Correo o contraseña incorrectos.')
        }
        if (authError.message.includes('Email not confirmed')) {
          throw new Error('Confirma tu correo antes de iniciar sesión.')
        }
        throw new Error(authError.message)
      }

      if (!authData.user) throw new Error('No se pudo obtener la sesión.')

      // 2. Consultar rol en tabla perfiles
      const { data: perfil, error: perfilError } = await supabase
        .from('perfiles')
        .select('rol')
        .eq('id', authData.user.id)
        .single()

      if (perfilError || !perfil) {
        throw new Error('No se pudo obtener el perfil del usuario.')
      }

      // 3. Redirección inteligente según rol
      if (perfil.rol === 'admin') {
        router.push('/admin')
      } else {
        router.push(redirect === '/login' ? '/' : redirect)
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado.')
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 flex items-center justify-center p-4">
      {/* Decoración de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-200/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rose-200/30 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-amber-100/50 border border-amber-100 p-8">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl shadow-lg shadow-amber-200 mb-4">
              <ChefHat className="w-8 h-8 text-white" strokeWidth={1.5} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Bienvenido de vuelta
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Inicia sesión en tu Recetario Digital
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="flex items-start gap-3 bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Formulario */}
          <form onSubmit={handleLogin} noValidate className="space-y-5">
            
            {/* Campo Email */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  strokeWidth={1.5}
                />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  disabled={cargando}
                  placeholder="tu@correo.com"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400
                    disabled:opacity-60 disabled:cursor-not-allowed
                    transition-colors duration-200"
                />
              </div>
            </div>

            {/* Campo Contraseña */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <Link
                  href="/recuperar-cuenta"
                  className="text-xs text-amber-600 hover:text-amber-700 font-medium transition-colors"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <div className="relative">
                <Lock
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  strokeWidth={1.5}
                />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  disabled={cargando}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400
                    focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-amber-400
                    disabled:opacity-60 disabled:cursor-not-allowed
                    transition-colors duration-200"
                />
              </div>
            </div>

            {/* Botón Submit */}
            <button
              type="submit"
              disabled={cargando}
              className="w-full flex items-center justify-center gap-2 py-3 px-4
                bg-gradient-to-r from-amber-400 to-orange-500
                hover:from-amber-500 hover:to-orange-600
                disabled:from-amber-300 disabled:to-orange-400
                text-white font-semibold text-sm rounded-xl
                shadow-md shadow-amber-200 hover:shadow-lg hover:shadow-amber-200
                transform hover:-translate-y-0.5 active:translate-y-0
                transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none"
            >
              {cargando ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  Iniciar sesión
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divisor */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-400 bg-white px-3">
              ¿No tienes cuenta?
            </div>
          </div>

          {/* Link a Registro */}
          <Link
            href="/registro"
            className="w-full flex items-center justify-center gap-2 py-3 px-4
              bg-gray-50 hover:bg-gray-100 border border-gray-200
              text-gray-700 font-medium text-sm rounded-xl
              transition-colors duration-200"
          >
            Crear cuenta nueva
          </Link>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-gray-400 mt-6">
          Al iniciar sesión aceptas nuestros{' '}
          <Link href="/terminos" className="text-amber-600 hover:underline">
            Términos de Uso
          </Link>
        </p>
      </div>
    </div>
  )
}
