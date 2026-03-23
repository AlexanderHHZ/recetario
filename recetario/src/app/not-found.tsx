// ============================================================
//  RECETARIO DIGITAL — Página 404
//  src/app/not-found.tsx
// ============================================================

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center mb-6">
        <span className="text-2xl font-bold text-orange-400">?</span>
      </div>
      <h1 className="text-2xl font-bold text-stone-800 mb-2">Página no encontrada</h1>
      <p className="text-stone-500 text-sm mb-8 max-w-sm">
        La receta o página que buscas no existe o fue removida.
      </p>
      <Link href="/" className="btn-primary">
        Volver al inicio
      </Link>
    </div>
  )
}
