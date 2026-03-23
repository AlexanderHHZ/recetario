'use client'
// ============================================================
//  RECETARIO DIGITAL — Página de Contacto (CORREGIDA)
//  src/app/contacto/page.tsx
// ============================================================

import { useState } from 'react'

// Separamos los iconos para evitar el error de sintaxis 'cx'
const IconLinkedIn = () => (
  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
    <circle cx="4" cy="4" r="2" />
  </svg>
)

const IconTwitter = () => (
  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M4 4l16 16M4 20L20 4" />
  </svg>
)

const IconFacebook = () => (
  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
)

const REDES_PROFESIONALES = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/dredgar', color: '#0A66C2', icon: <IconLinkedIn /> },
  { label: 'Twitter / X', href: 'https://twitter.com/dredgar791', color: '#000000', icon: <IconTwitter /> },
  { label: 'Facebook', href: 'https://facebook.com/ingrediente791', color: '#1877F2', icon: <IconFacebook /> },
]

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' })
  const [enviando, setEnviando] = useState(false)
  const [resultado, setResultado] = useState<'ok' | 'error' | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnviando(true)
    setResultado(null)
    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Error al enviar.')
      setResultado('ok')
      setForm({ nombre: '', email: '', asunto: '', mensaje: '' })
    } catch (err: unknown) {
      setResultado('error')
      setErrorMsg(err instanceof Error ? err.message : 'Error inesperado.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <div className="grid md:grid-cols-[1fr_320px] gap-12">

        {/* ── FORMULARIO ── */}
        <section>
          <p className="text-xs font-semibold tracking-widest text-orange-500 uppercase mb-2">Contacto</p>
          <h1 className="text-3xl font-bold text-stone-900 mb-2">¿Hablamos?</h1>
          <p className="text-stone-500 text-sm mb-8 leading-relaxed">
            Si eres una marca, patrocinador o simplemente quieres colaborar con Ingrediente 791, déjanos tu mensaje. Respondemos en menos de 48 horas.
          </p>

          {resultado === 'ok' ? (
            <div className="p-6 bg-green-50 rounded-2xl border border-green-100 text-center">
              <svg className="w-10 h-10 text-green-500 mx-auto mb-3" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              </svg>
              <p className="font-semibold text-stone-800 mb-1">¡Mensaje enviado!</p>
              <p className="text-sm text-stone-500">Nos pondremos en contacto pronto.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1.5" htmlFor="nombre">
                    Nombre completo <span className="text-orange-500">*</span>
                  </label>
                  <input
                    id="nombre" name="nombre" type="text" required
                    value={form.nombre} onChange={handleChange}
                    placeholder="Tu nombre"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-600 mb-1.5" htmlFor="email">
                    Correo electrónico <span className="text-orange-500">*</span>
                  </label>
                  <input
                    id="email" name="email" type="email" required
                    value={form.email} onChange={handleChange}
                    placeholder="tu@empresa.com"
                    className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1.5" htmlFor="asunto">
                  Asunto <span className="text-orange-500">*</span>
                </label>
                <input
                  id="asunto" name="asunto" type="text" required
                  value={form.asunto} onChange={handleChange}
                  placeholder="Ej: Propuesta de patrocinio"
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1.5" htmlFor="mensaje">
                  Mensaje <span className="text-orange-500">*</span>
                </label>
                <textarea
                  id="mensaje" name="mensaje" required
                  value={form.mensaje} onChange={handleChange}
                  placeholder="Cuéntanos sobre tu propuesta..."
                  rows={5} maxLength={3000}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white resize-none"
                />
                <p className="text-xs text-stone-400 mt-1 text-right">{form.mensaje.length}/3000</p>
              </div>

              {resultado === 'error' && (
                <p className="text-sm text-red-500">{errorMsg}</p>
              )}

              <button
                type="submit"
                disabled={enviando}
                className="w-full py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-medium text-sm rounded-xl transition-colors"
              >
                {enviando ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          )}
        </section>

        {/* ── INFORMACIÓN DE CONTACTO ── */}
        <aside className="space-y-8">
          <div>
            <p className="text-xs font-semibold tracking-widest text-orange-500 uppercase mb-4">Información directa</p>
            <div className="space-y-4">
              <a href="mailto:contact@dr.edgar.recipes" className="flex items-center gap-3 text-stone-600 hover:text-orange-600 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <span className="text-sm break-all">contact@dr.edgar.recipes</span>
              </a>
            </div>
          </div>

          {/* Redes */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-stone-400 uppercase mb-4">Redes profesionales</p>
            <div className="space-y-3">
              {REDES_PROFESIONALES.map(({ label, href, color, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl border border-stone-100 hover:border-stone-200 hover:shadow-sm transition-all"
                >
                  <span style={{ color }}>{icon}</span>
                  <span className="text-sm font-medium text-stone-700">{label}</span>
                </a>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  )
}