// ============================================================
//  RECETARIO DIGITAL — Tarjeta de receta (galería)
//  src/components/receta/RecetaCard.tsx
//  Server Component — no necesita 'use client'
// ============================================================

import Link from 'next/link'
import type { Receta } from '@/types'
import EstrellasBadge from './EstrellasBadge'

interface Props { receta: Receta }

export default function RecetaCard({ receta }: Props) {
  return (
    <Link
      href={`/recetas/${receta.slug}`}
      className="group block bg-white rounded-2xl overflow-hidden border border-stone-100 hover:border-orange-200 hover:shadow-lg transition-all duration-200"
    >
      {/* Imagen */}
      <div className="aspect-[4/3] relative overflow-hidden bg-stone-100">
        {receta.imagen_principal_url ? (
          <img
            src={receta.imagen_principal_url}
            alt={receta.titulo}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-12 h-12 text-stone-300" fill="none" stroke="currentColor" strokeWidth={1} viewBox="0 0 24 24">
              <path d="M12 2a10 10 0 1 0 0 20A10 10 0 0 0 12 2zm0 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0-8a6 6 0 0 0-5.2 9h10.4A6 6 0 0 0 12 8z" />
            </svg>
          </div>
        )}

        {/* Badge dificultad */}
        {receta.dificultad && (
          <span className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-medium ${
            receta.dificultad === 'fácil'   ? 'bg-green-100  text-green-700'  :
            receta.dificultad === 'media'   ? 'bg-amber-100  text-amber-700'  :
                                              'bg-red-100    text-red-700'
          }`}>
            {receta.dificultad}
          </span>
        )}
      </div>

      {/* Contenido */}
      <div className="p-4">
        <h3 className="font-semibold text-stone-800 text-sm leading-snug line-clamp-2 group-hover:text-orange-600 transition-colors mb-2">
          {receta.titulo}
        </h3>

        {/* Meta row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-stone-400 text-xs">
            {receta.tiempo_minutos && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
                {receta.tiempo_minutos} min
              </span>
            )}
            {receta.porciones && (
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                </svg>
                {receta.porciones}
              </span>
            )}
          </div>

          {receta.calificacion_promedio != null && (
            <EstrellasBadge calificacion={receta.calificacion_promedio} total={receta.total_resenas} />
          )}
        </div>
      </div>
    </Link>
  )
}
