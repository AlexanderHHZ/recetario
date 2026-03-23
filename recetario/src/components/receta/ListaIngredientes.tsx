'use client'
// ============================================================
//  RECETARIO DIGITAL — Lista de ingredientes con checkboxes
//  src/components/receta/ListaIngredientes.tsx
// ============================================================

import { useState } from 'react'
import type { RecetaIngrediente } from '@/types'

interface Props { ingredientes: RecetaIngrediente[] }

export default function ListaIngredientes({ ingredientes }: Props) {
  const [marcados, setMarcados] = useState<Set<string>>(new Set())

  const toggle = (id: string) =>
    setMarcados(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })

  const progreso = ingredientes.length > 0
    ? Math.round((marcados.size / ingredientes.length) * 100)
    : 0

  return (
    <section>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold text-stone-800">Ingredientes</h2>
        {marcados.size > 0 && (
          <span className="text-xs text-stone-400">
            {marcados.size}/{ingredientes.length}
          </span>
        )}
      </div>

      {/* Barra de progreso */}
      {marcados.size > 0 && (
        <div className="h-1.5 bg-stone-100 rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-orange-400 rounded-full transition-all duration-300"
            style={{ width: `${progreso}%` }}
          />
        </div>
      )}

      <ul className="space-y-2">
        {ingredientes.map(item => {
          const key = item.ingrediente_id
          const checked = marcados.has(key)
          return (
            <li key={key}>
              <label className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(key)}
                  className="mt-0.5 w-4 h-4 rounded border-stone-300 text-orange-500 focus:ring-orange-400 shrink-0 cursor-pointer"
                />
                <span className={`text-sm leading-relaxed transition-colors ${
                  checked ? 'line-through text-stone-400' : 'text-stone-700'
                }`}>
                  <span className="font-medium">{item.cantidad}</span>
                  {' '}
                  {item.ingredientes.nombre}
                </span>
              </label>
            </li>
          )
        })}
      </ul>

      {progreso === 100 && (
        <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-100 text-sm text-green-700 font-medium text-center">
          ¡Tienes todos los ingredientes listos!
        </div>
      )}
    </section>
  )
}
