'use client'
// ============================================================
//  RECETARIO DIGITAL — Página de Login
//  src/app/login/page.tsx
// ============================================================

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const router = useRouter()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email:    form.email.trim().toLowerCase(),
        password: form.password,
      })

      if (authError) throw authError

      // Obtener rol para redirigir correctamente
      const { data: perfil } = await supabase
        .from('usuarios')
        .select('rol')
        .eq('auth_id', data.user.id)
        .single()

      if (perfil?.rol === 'superadmin' || perfil?.rol === 'editor') {
        router.push('/admin')
      } else {
        router.push('/')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al iniciar sesión.'
      if (msg.includes('Invalid login credentials')) {
        setError('Email o contraseña incorrectos.')
      } else if (msg.includes('Email not confirmed')) {
        setError('Confirma tu email antes de iniciar sesión. Revisa tu bandeja de entrada.')
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
              791
            </span>
            <span className="font-semibold text-stone-800">Ingrediente 791</span>
          </Link>
          <h1 className="text-2xl font-bold text-stone-900">Iniciar sesión</h1>
          <p className="text-stone-500 text-sm mt-1">
            Bienvenido de vuelta
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5" htmlFor="email">
                Correo electrónico
              </label>
              <input
                id="email" name="email" type="email"
                required autoComplete="email"
                value={form.email} onChange={handleChange}
                placeholder="tu@correo.com"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-stone-600" htmlFor="password">
                  Contraseña
                </label>
                <Link href="/recuperar-password" className="text-xs text-orange-500 hover:underline">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <input
                id="password" name="password" type="password"
                required autoComplete="current-password"
                value={form.password} onChange={handleChange}
                placeholder="Tu contraseña"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-medium text-sm rounded-xl transition-colors"
            >
              {loading ? 'Entrando...' : 'Iniciar sesión'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-xs text-stone-400">o</span>
            </div>
          </div>

          <p className="text-center text-sm text-stone-500">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="text-orange-500 hover:text-orange-600 font-medium">
              Regístrate gratis
            </Link>
          </p>
        </div>

      </div>
    </div>
  )
}