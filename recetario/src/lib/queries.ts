// ============================================================
//  RECETARIO DIGITAL — Fetch de datos
//  src/lib/queries.ts
//
//  Todas las queries de Supabase centralizadas aquí.
//  Se usan en Server Components (no llevan 'use client').
// ============================================================

import { supabase } from './supabase'
import type { Receta, Paso, RecetaIngrediente, Resena, RecetaImagen } from '@/types'

// ------------------------------------------------------------
// Galería: recetas publicadas para la página de inicio
// ------------------------------------------------------------
export async function getRecetasPublicadas(limit = 12): Promise<Receta[]> {
  const { data, error } = await supabase
    .from('resumen_recetas')          // Vista creada en schema_v3.sql
    .select('*')
    .eq('publicada', true)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('[getRecetasPublicadas]', error.message)
    return []
  }
  return data ?? []
}

// ------------------------------------------------------------
// Receta destacada: la más reciente publicada
// Se usa en el Hero de la página de inicio
// ------------------------------------------------------------
export async function getRecetaDestacada(): Promise<Receta | null> {
  const { data, error } = await supabase
    .from('resumen_recetas')
    .select('*')
    .eq('publicada', true)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    console.error('[getRecetaDestacada]', error.message)
    return null
  }
  return data
}

// ------------------------------------------------------------
// Receta individual: por slug (página /recetas/[slug])
// ------------------------------------------------------------
export async function getRecetaPorSlug(slug: string): Promise<Receta | null> {
  const { data, error } = await supabase
    .from('recetas')
    .select(`
      *,
      receta_imagenes (id, url, alt_text, es_principal, orden),
      receta_categorias (
        categorias (id, nombre, slug, color_hex)
      )
    `)
    .eq('slug', slug)
    .eq('publicada', true)
    .single()

  if (error) {
    console.error('[getRecetaPorSlug]', error.message)
    return null
  }
  return data
}

// ------------------------------------------------------------
// Pasos de una receta (tabla pasos, C3 del schema)
// ------------------------------------------------------------
export async function getPasosDeReceta(recetaId: string): Promise<Paso[]> {
  const { data, error } = await supabase
    .from('pasos')
    .select('*')
    .eq('receta_id', recetaId)
    .order('numero', { ascending: true })

  if (error) {
    console.error('[getPasosDeReceta]', error.message)
    return []
  }
  return data ?? []
}

// ------------------------------------------------------------
// Ingredientes de una receta con sus cantidades
// ------------------------------------------------------------
export async function getIngredientesDeReceta(recetaId: string): Promise<RecetaIngrediente[]> {
  const { data, error } = await supabase
    .from('receta_ingredientes')
    .select(`
      receta_id,
      ingrediente_id,
      cantidad,
      orden,
      ingredientes (id, nombre, slug)
    `)
    .eq('receta_id', recetaId)
    .order('orden', { ascending: true })

  if (error) {
    console.error('[getIngredientesDeReceta]', error.message)
    return []
  }
  return (data ?? []) as RecetaIngrediente[]
}

// ------------------------------------------------------------
// Reseñas aprobadas de una receta
// ------------------------------------------------------------
export async function getResenasAprobadas(recetaId: string): Promise<Resena[]> {
  const { data, error } = await supabase
    .from('resenas')
    .select('id, autor_nombre, calificacion, comentario, created_at')
    .eq('receta_id', recetaId)
    .eq('aprobada', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[getResenasAprobadas]', error.message)
    return []
  }
  return data ?? []
}

// ------------------------------------------------------------
// Imágenes de una receta ordenadas
// ------------------------------------------------------------
export async function getImagenesDeReceta(recetaId: string): Promise<RecetaImagen[]> {
  const { data, error } = await supabase
    .from('receta_imagenes')
    .select('*')
    .eq('receta_id', recetaId)
    .order('orden', { ascending: true })

  if (error) {
    console.error('[getImagenesDeReceta]', error.message)
    return []
  }
  return data ?? []
}

// ------------------------------------------------------------
// Slugs de todas las recetas publicadas (para generateStaticParams)
// ------------------------------------------------------------
export async function getSlugsPublicados(): Promise<{ slug: string }[]> {
  const { data, error } = await supabase
    .from('recetas')
    .select('slug')
    .eq('publicada', true)

  if (error) {
    console.error('[getSlugsPublicados]', error.message)
    return []
  }
  return data ?? []
}
