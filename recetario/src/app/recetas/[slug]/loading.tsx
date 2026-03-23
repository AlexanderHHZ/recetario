// ============================================================
//  RECETARIO DIGITAL — Skeleton de carga
//  src/app/recetas/[slug]/loading.tsx
//  Se muestra automáticamente mientras carga la página de receta
// ============================================================

export default function RecetaLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 animate-pulse">
      {/* Video skeleton */}
      <div className="aspect-video bg-stone-200 rounded-2xl mb-8" />

      {/* Título */}
      <div className="space-y-3 mb-6">
        <div className="h-4 bg-stone-200 rounded w-24" />
        <div className="h-8 bg-stone-200 rounded w-3/4" />
        <div className="h-8 bg-stone-200 rounded w-1/2" />
      </div>

      {/* Meta row */}
      <div className="flex gap-4 pb-6 border-b border-stone-100 mb-8">
        <div className="h-5 bg-stone-200 rounded w-20" />
        <div className="h-5 bg-stone-200 rounded w-24" />
        <div className="h-5 bg-stone-200 rounded w-16" />
      </div>

      {/* Body grid */}
      <div className="grid lg:grid-cols-[280px_1fr] gap-10">
        {/* Ingredientes */}
        <div className="space-y-3">
          <div className="h-5 bg-stone-200 rounded w-32 mb-4" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-stone-200 rounded" style={{ width: `${60 + i * 5}%` }} />
          ))}
        </div>
        {/* Pasos */}
        <div className="space-y-6">
          <div className="h-5 bg-stone-200 rounded w-32 mb-4" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-4">
              <div className="w-8 h-8 bg-stone-200 rounded-full shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-4 bg-stone-200 rounded" />
                <div className="h-4 bg-stone-200 rounded w-4/5" />
                <div className="h-4 bg-stone-200 rounded w-3/5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
