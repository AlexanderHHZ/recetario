'use client'
// ============================================================
//  RECETARIO DIGITAL — Sección de reseñas
//  src/components/receta/SeccionResenas.tsx
// ============================================================

import { useState } from 'react'
import type { Resena } from '@/types'

interface Props {
  recetaId: string
  resenas: Resena[]
}

function Estrella({ llena, onClick }: { llena: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="p-0.5 focus:outline-none">
      <svg className={`w-6 h-6 transition-colors ${llena ? 'text-amber-400 fill-amber-400' : 'text-stone-300 fill-stone-200 hover:text-amber-300 hover:fill-amber-200'}`} viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    </button>
  )
}

export default function SeccionResenas({ recetaId, resenas }: Props) {
  const [estrellas, setEstrellas]     = useState(0)
  const [nombre, setNombre]           = useState('')
  const [comentario, setComentario]   = useState('')
  const [enviando, setEnviando]       = useState(false)
  const [enviado, setEnviado]         = useState(false)
  const [error, setError]             = useState('')

  const promedio = resenas.length > 0
    ? (resenas.reduce((s, r) => s + r.calificacion, 0) / resenas.length).toFixed(1)
    : null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (estrellas === 0) { setError('Selecciona una calificación.'); return }
    if (!nombre.trim())  { setError('Ingresa tu nombre.');           return }
    setError('')
    setEnviando(true)

    try {
      const res = await fetch('/api/resenas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ receta_id: recetaId, autor_nombre: nombre.trim(), calificacion: estrellas, comentario: comentario.trim() }),
      })
      if (!res.ok) {
        const json = await res.json()
        throw new Error(json.error ?? 'Error al enviar.')
      }
      setEnviado(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al enviar.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-stone-800">Reseñas</h2>
        {promedio && (
          <div className="flex items-center gap-1.5">
            <svg className="w-5 h-5 text-amber-400 fill-amber-400" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span className="font-semibold text-stone-800">{promedio}</span>
            <span className="text-stone-400 text-sm">({resenas.length})</span>
          </div>
        )}
      </div>

      {/* Lista de reseñas */}
      {resenas.length > 0 ? (
        <ul className="space-y-4 mb-8">
          {resenas.map(r => (
            <li key={r.id} className="p-4 bg-stone-50 rounded-xl border border-stone-100">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <p className="text-sm font-medium text-stone-800">{r.autor_nombre}</p>
                  <p className="text-xs text-stone-400">
                    {new Date(r.created_at).toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className={`w-4 h-4 ${i <= r.calificacion ? 'text-amber-400 fill-amber-400' : 'text-stone-200 fill-stone-200'}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>
              </div>
              {r.comentario && <p className="text-sm text-stone-600 leading-relaxed">{r.comentario}</p>}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-stone-400 mb-8">Sé el primero en dejar una reseña.</p>
      )}

      {/* Formulario de nueva reseña */}
      {enviado ? (
        <div className="p-4 bg-green-50 rounded-xl border border-green-100 text-sm text-green-700 text-center">
          ¡Gracias por tu reseña! Será visible después de ser aprobada.
        </div>
      ) : (
        <div className="bg-stone-50 rounded-xl border border-stone-100 p-5">
          <h3 className="text-sm font-semibold text-stone-700 mb-4">Dejar una reseña</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Estrellas */}
            <div>
              <label className="block text-xs text-stone-500 mb-1">Calificación</label>
              <div className="flex gap-0.5 -ml-0.5">
                {[1,2,3,4,5].map(i => (
                  <Estrella key={i} llena={i <= estrellas} onClick={() => setEstrellas(i)} />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-stone-500 mb-1">Tu nombre</label>
              <input
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                placeholder="Ej: María García"
                maxLength={60}
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white"
              />
            </div>

            <div>
              <label className="block text-xs text-stone-500 mb-1">Comentario (opcional)</label>
              <textarea
                value={comentario}
                onChange={e => setComentario(e.target.value)}
                placeholder="¿Cómo te quedó la receta?"
                maxLength={1000}
                rows={3}
                className="w-full px-3 py-2 text-sm rounded-lg border border-stone-200 focus:outline-none focus:ring-2 focus:ring-orange-300 bg-white resize-none"
              />
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={enviando}
              className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {enviando ? 'Enviando...' : 'Publicar reseña'}
            </button>
          </form>
        </div>
      )}
    </section>
  )
}
