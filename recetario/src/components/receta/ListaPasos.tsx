// ============================================================
//  RECETARIO DIGITAL — Pasos de preparación
//  src/components/receta/ListaPasos.tsx
//  Server Component
// ============================================================

import type { Paso } from '@/types'

interface Props { pasos: Paso[] }

export default function ListaPasos({ pasos }: Props) {
  if (pasos.length === 0) return null

  return (
    <section>
      <h2 className="text-lg font-semibold text-stone-800 mb-4">Preparación</h2>
      <ol className="space-y-6">
        {pasos.map((paso) => (
          <li key={paso.id} className="flex gap-4">
            {/* Número */}
            <div className="shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold mt-0.5">
              {paso.numero}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-stone-700 leading-relaxed text-sm">{paso.descripcion}</p>
              {paso.imagen_url && (
                <div className="mt-3 aspect-video rounded-xl overflow-hidden bg-stone-100 max-w-sm">
                  <img
                    src={paso.imagen_url}
                    alt={`Paso ${paso.numero}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              )}
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
