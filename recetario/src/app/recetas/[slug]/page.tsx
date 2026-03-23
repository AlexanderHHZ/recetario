// ============================================================
//  RECETARIO DIGITAL — Página de receta individual
//  src/app/recetas/[slug]/page.tsx
// ============================================================

import { notFound }       from 'next/navigation'
import type { Metadata }  from 'next'
import {
  getRecetaPorSlug,
  getPasosDeReceta,
  getIngredientesDeReceta,
  getResenasAprobadas,
  getSlugsPublicados,
} from '@/lib/queries'
import VideoYoutube       from '@/components/receta/VideoYoutube'
import ListaIngredientes  from '@/components/receta/ListaIngredientes'
import ListaPasos         from '@/components/receta/ListaPasos'
import SeccionResenas     from '@/components/receta/SeccionResenas'
import EstrellasBadge     from '@/components/receta/EstrellasBadge'

// ── Tipos ──────────────────────────────────────────────────
interface Props { params: { slug: string } }

// ── Static params (build time) ─────────────────────────────
export async function generateStaticParams() {
  const slugs = await getSlugsPublicados()
  return slugs.map(({ slug }) => ({ slug }))
}

// ── Metadata dinámica ──────────────────────────────────────
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const receta = await getRecetaPorSlug(params.slug)
  if (!receta) return { title: 'Receta no encontrada' }
  return {
    title:       receta.titulo,
    description: receta.descripcion ?? undefined,
    openGraph: {
      title:  receta.titulo,
      images: receta.imagen_principal_url ? [receta.imagen_principal_url] : [],
    },
  }
}

// ── Revalidar cada 5 minutos ───────────────────────────────
export const revalidate = 300

// ── Página ─────────────────────────────────────────────────
export default async function RecetaPage({ params }: Props) {
  const receta = await getRecetaPorSlug(params.slug)
  if (!receta) notFound()

  const [pasos, ingredientes, resenas] = await Promise.all([
    getPasosDeReceta(receta.id),
    getIngredientesDeReceta(receta.id),
    getResenasAprobadas(receta.id),
  ])

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

      {/* ── VIDEO ── */}
      {receta.video_youtube_url && (
        <div className="mb-8">
          <VideoYoutube url={receta.video_youtube_url} titulo={receta.titulo} />
        </div>
      )}

      {/* ── ENCABEZADO ── */}
      <header className="mb-8">
        {/* Categorías */}
        {Array.isArray((receta as any).receta_categorias) && (
          <div className="flex flex-wrap gap-2 mb-3">
            {(receta as any).receta_categorias.map(({ categorias: cat }: any) => (
              <span
                key={cat.id}
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: `${cat.color_hex}22`, color: cat.color_hex }}
              >
                {cat.nombre}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 leading-tight mb-4">
          {receta.titulo}
        </h1>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-stone-500 pb-6 border-b border-stone-100">
          {receta.tiempo_minutos && (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
              </svg>
              {receta.tiempo_minutos} min
            </span>
          )}
          {receta.porciones && (
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              </svg>
              {receta.porciones} porciones
            </span>
          )}
          {receta.dificultad && (
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
              receta.dificultad === 'fácil' ? 'bg-green-100 text-green-700' :
              receta.dificultad === 'media' ? 'bg-amber-100 text-amber-700' :
                                              'bg-red-100 text-red-700'
            }`}>
              {receta.dificultad}
            </span>
          )}
          {receta.calificacion_promedio != null && (
            <EstrellasBadge calificacion={receta.calificacion_promedio} total={receta.total_resenas} />
          )}
        </div>

        {/* Descripción */}
        {receta.descripcion && (
          <p className="mt-4 text-stone-600 leading-relaxed">{receta.descripcion}</p>
        )}
      </header>

      {/* ── CUERPO: 2 columnas en desktop ── */}
      <div className="grid lg:grid-cols-[280px_1fr] gap-10">

        {/* Columna izquierda: Ingredientes */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <ListaIngredientes ingredientes={ingredientes} />
        </aside>

        {/* Columna derecha: Pasos */}
        <div>
          <ListaPasos pasos={pasos} />
        </div>
      </div>

      {/* ── RESEÑAS ── */}
      <div className="mt-14 pt-10 border-t border-stone-100">
        <SeccionResenas recetaId={receta.id} resenas={resenas} />
      </div>

    </article>
  )
}
