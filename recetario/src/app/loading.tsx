// ============================================================
//  RECETARIO DIGITAL — Skeleton del Inicio
//  src/app/loading.tsx
// ============================================================

export default function HomeLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-16 animate-pulse">
      {/* Hero skeleton */}
      <div className="rounded-3xl overflow-hidden bg-white border border-stone-100 grid md:grid-cols-2">
        <div className="aspect-[4/3] bg-stone-200" />
        <div className="p-10 space-y-4">
          <div className="h-3 bg-stone-200 rounded w-28" />
          <div className="h-8 bg-stone-200 rounded w-full" />
          <div className="h-8 bg-stone-200 rounded w-2/3" />
          <div className="space-y-2 pt-2">
            <div className="h-4 bg-stone-200 rounded" />
            <div className="h-4 bg-stone-200 rounded w-4/5" />
            <div className="h-4 bg-stone-200 rounded w-3/5" />
          </div>
        </div>
      </div>

      {/* Galería skeleton */}
      <div>
        <div className="h-6 bg-stone-200 rounded w-40 mb-6" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden border border-stone-100">
              <div className="aspect-[4/3] bg-stone-200" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-stone-200 rounded" />
                <div className="h-4 bg-stone-200 rounded w-3/4" />
                <div className="h-3 bg-stone-200 rounded w-1/2 mt-2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
