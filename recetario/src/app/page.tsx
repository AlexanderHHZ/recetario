// ============================================================
//  RECETARIO DIGITAL — Página de inicio
//  src/app/page.tsx
//  Server Component — fetch en el servidor
// ============================================================

import Link from 'next/link'
import type { Metadata } from 'next'
import { getRecetaDestacada, getRecetasPublicadas } from '@/lib/queries'
import RecetaCard from '@/components/receta/RecetaCard'
import EstrellasBadge from '@/components/receta/EstrellasBadge'

export const metadata: Metadata = {
  title: 'Inicio',
  description: 'Recetas auténticas del canal Ingrediente 791.',
}

// Revalidar cada 60 segundos (ISR)
export const revalidate = 60

export default async function HomePage() {
  const [destacada, recetas] = await Promise.all([
    getRecetaDestacada(),
    getRecetasPublicadas(12),
  ])

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-16">

      {/* ── HERO: Receta de la Semana ── */}
      {destacada ? (
        <section>
          <p className="text-xs font-semibold tracking-widest text-orange-500 uppercase mb-3">
            Receta de la semana
          </p>
          <Link
            href={`/recetas/${destacada.slug}`}
            className="group grid md:grid-cols-2 gap-0 rounded-3xl overflow-hidden bg-white border border-stone-100 hover:shadow-xl transition-shadow duration-300"
          >
            {/* Imagen */}
            <div className="aspect-[4/3] md:aspect-auto relative overflow-hidden bg-stone-100">
              {destacada.imagen_principal_url ? (
                <img
                  src={destacada.imagen_principal_url}
                  alt={destacada.titulo}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-64 md:h-full bg-gradient-to-br from-orange-100 to-amber-50" />
              )}
            </div>

            {/* Contenido */}
            <div className="p-8 md:p-10 flex flex-col justify-center">
              <div className="flex flex-wrap gap-2 mb-4">
                {destacada.categorias?.filter(Boolean).slice(0, 3).map(cat => (
                  <span key={cat} className="px-2.5 py-1 bg-orange-50 text-orange-600 text-xs font-medium rounded-full">
                    {cat}
                  </span>
                ))}
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-stone-900 leading-tight mb-3 group-hover:text-orange-600 transition-colors">
                {destacada.titulo}
              </h1>

              {destacada.descripcion && (
                <p className="text-stone-500 text-sm leading-relaxed line-clamp-3 mb-5">
                  {destacada.descripcion}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 text-sm text-stone-400">
                {destacada.tiempo_minutos && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                    </svg>
                    {destacada.tiempo_minutos} min
                  </span>
                )}
                {destacada.porciones && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    </svg>
                    {destacada.porciones} porciones
                  </span>
                )}
                {destacada.calificacion_promedio != null && (
                  <EstrellasBadge calificacion={destacada.calificacion_promedio} total={destacada.total_resenas} />
                )}
              </div>

              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-orange-500 group-hover:gap-3 transition-all">
                Ver receta completa
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </span>
            </div>
          </Link>
        </section>
      ) : (
        /* Placeholder si no hay recetas aún */
        <section className="rounded-3xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 p-12 text-center">
          <p className="text-stone-400 text-sm">La Receta de la semana.</p>
        </section>
      )}

      {/* ── GALERÍA ── */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-stone-900">Recetas recientes</h2>
          <Link href="/recetas" className="text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors">
            Ver todas →
          </Link>
        </div>

        {recetas.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {recetas.map(r => (
              <RecetaCard key={r.id} receta={r} />
            ))}
          </div>
        ) : (
          <div className="col-span-full py-16 text-center">
            <p className="text-stone-400 text-sm">No hay recetas publicadas todavía.</p>
          </div>
        )}
      </section>

    </div>
  )
}
