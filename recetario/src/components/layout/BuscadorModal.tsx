'use client'
// ============================================================
//  RECETARIO DIGITAL — Modal de Búsqueda
//  src/components/layout/BuscadorModal.tsx
// ============================================================

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import type { Receta } from '@/types'

interface Props { onClose: () => void }

export default function BuscadorModal({ onClose }: Props) {
  const [query, setQuery]       = useState('')
  const [results, setResults]   = useState<Receta[]>([])
  const [loading, setLoading]   = useState(false)
  const inputRef                = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Búsqueda con debounce mínimo
  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return }
    const timer = setTimeout(async () => {
      setLoading(true)
      const { data } = await supabase
        .from('resumen_recetas')
        .select('id, titulo, slug, imagen_principal_url, tiempo_minutos')
        .eq('publicada', true)
        .textSearch('search_vector', query, { type: 'plain', config: 'spanish' })
        .limit(6)
      setResults(data ?? [])
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-stone-100">
          <svg className="w-5 h-5 text-stone-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar recetas, ingredientes..."
            className="flex-1 outline-none text-stone-800 placeholder-stone-400 text-sm bg-transparent"
          />
          {loading && (
            <svg className="w-4 h-4 text-orange-500 animate-spin shrink-0" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
            </svg>
          )}
        </div>

        {/* Resultados */}
        {results.length > 0 && (
          <ul className="divide-y divide-stone-50 max-h-80 overflow-y-auto">
            {results.map(r => (
              <li key={r.id}>
                <Link
                  href={`/recetas/${r.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 transition-colors"
                >
                  {r.imagen_principal_url ? (
                    <img src={r.imagen_principal_url} alt={r.titulo} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-stone-100 shrink-0" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-stone-800">{r.titulo}</p>
                    {r.tiempo_minutos && (
                      <p className="text-xs text-stone-400">{r.tiempo_minutos} min</p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {query.length >= 2 && results.length === 0 && !loading && (
          <p className="px-4 py-6 text-sm text-center text-stone-400">
            Sin resultados para &ldquo;{query}&rdquo;
          </p>
        )}

        <div className="px-4 py-2 bg-stone-50 border-t border-stone-100">
          <p className="text-xs text-stone-400">Presiona <kbd className="px-1 py-0.5 bg-white border border-stone-200 rounded text-stone-500">Esc</kbd> para cerrar</p>
        </div>
      </div>
    </div>
  )
}
