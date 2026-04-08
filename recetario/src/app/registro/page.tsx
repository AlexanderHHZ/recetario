'use client'
// ============================================================
//  RECETARIO DIGITAL — Página de Registro
//  src/app/registro/page.tsx
// ============================================================

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function RegistroPage() {
  const router = useRouter()

  const [form, setForm] = useState({
    nombre:    '',
    email:     '',
    password:  '',
    confirmar: '',
  })
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [enviado,  setEnviado]  = useState(false)   // confirmación de email

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const validar = (): string | null => {
    if (form.nombre.trim().length < 2)       return 'El nombre debe tener al menos 2 caracteres.'
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) return 'Email inválido.'
    if (form.password.length < 8)            return 'La contraseña debe tener al menos 8 caracteres.'
    if (form.password !== form.confirmar)    return 'Las contraseñas no coinciden.'
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const err = validar()
    if (err) { setError(err); return }

    setLoading(true)
    try {
      const { error: authError } = await supabase.auth.signUp({
        email:    form.email.trim().toLowerCase(),
        password: form.password,
        options: {
          data: {
            // Estos datos llegan al trigger handle_new_user()
            // y se guardan en la tabla usuarios
            nombre: form.nombre.trim(),
          },
          // Supabase enviará un email de confirmación a esta URL
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (authError) throw authError

      setEnviado(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al crear la cuenta.'
      // Traducir mensajes comunes de Supabase Auth al español
      if (msg.includes('already registered')) {
        setError('Ya existe una cuenta con ese email. ¿Quieres iniciar sesión?')
      } else if (msg.includes('Password should be')) {
        setError('La contraseña debe tener al menos 8 caracteres.')
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Pantalla de confirmación ─────────────────────────────
  if (enviado) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-stone-900 mb-2">
            ¡Revisa tu email!
          </h1>
          <p className="text-stone-500 text-sm leading-relaxed mb-6">
            Te enviamos un enlace de confirmación a{' '}
            <span className="font-medium text-stone-700">{form.email}</span>.
            Haz clic en el enlace para activar tu cuenta.
          </p>
          <p className="text-xs text-stone-400">
            ¿No llegó? Revisa tu carpeta de spam o{' '}
            <button
              onClick={() => setEnviado(false)}
              className="text-orange-500 hover:underline"
            >
              intenta de nuevo
            </button>
            .
          </p>
        </div>
      </div>
    )
  }

  // ── Formulario de registro ───────────────────────────────
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
          <h1 className="text-2xl font-bold text-stone-900">Crear cuenta</h1>
          <p className="text-stone-500 text-sm mt-1">
            Únete para calificar y comentar recetas
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Nombre */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5" htmlFor="nombre">
                Nombre completo <span className="text-orange-500">*</span>
              </label>
              <input
                id="nombre" name="nombre" type="text"
                required autoComplete="name"
                value={form.nombre} onChange={handleChange}
                placeholder="Ej: María García"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5" htmlFor="email">
                Correo electrónico <span className="text-orange-500">*</span>
              </label>
              <input
                id="email" name="email" type="email"
                required autoComplete="email"
                value={form.email} onChange={handleChange}
                placeholder="tu@correo.com"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
              />
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5" htmlFor="password">
                Contraseña <span className="text-orange-500">*</span>
              </label>
              <input
                id="password" name="password" type="password"
                required autoComplete="new-password"
                value={form.password} onChange={handleChange}
                placeholder="Mínimo 8 caracteres"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
              />
              {/* Indicador de fortaleza */}
              {form.password.length > 0 && (
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3].map(i => (
                    <div
                      key={i}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        form.password.length >= i * 4
                          ? i === 1 ? 'bg-red-400'
                          : i === 2 ? 'bg-amber-400'
                          :           'bg-green-400'
                          : 'bg-stone-200'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1.5" htmlFor="confirmar">
                Confirmar contraseña <span className="text-orange-500">*</span>
              </label>
              <input
                id="confirmar" name="confirmar" type="password"
                required autoComplete="new-password"
                value={form.confirmar} onChange={handleChange}
                placeholder="Repite tu contraseña"
                className={`w-full px-4 py-2.5 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white ${
                  form.confirmar && form.confirmar !== form.password
                    ? 'border-red-300'
                    : 'border-stone-200'
                }`}
              />
              {form.confirmar && form.confirmar !== form.password && (
                <p className="text-xs text-red-500 mt-1">Las contraseñas no coinciden.</p>
              )}
            </div>

            {/* Error general */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-xs text-red-600">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-medium text-sm rounded-xl transition-colors"
            >
              {loading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-xs text-stone-400">o</span>
            </div>
          </div>

          <p className="text-center text-sm text-stone-500">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="text-orange-500 hover:text-orange-600 font-medium">
              Iniciar sesión
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-stone-400 mt-6 px-4">
          Al registrarte aceptas que tus reseñas y comentarios sean moderados antes de publicarse.
        </p>

      </div>
    </div>
  )
}
