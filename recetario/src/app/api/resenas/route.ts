// ============================================================
//  RECETARIO DIGITAL — API Route: Reseñas
//  src/app/api/resenas/route.ts
//
//  Importa supabaseAdmin desde supabase-admin.ts (no desde supabase.ts)
// ============================================================

import { createHash }    from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'   // ← archivo separado

interface Body {
  receta_id:    string
  autor_nombre: string
  calificacion: number
  comentario?:  string
}

function validar(b: Body): string | null {
  if (!b.receta_id)                                                      return 'receta_id requerido.'
  if (!b.autor_nombre || b.autor_nombre.length < 2
                      || b.autor_nombre.length > 60)                     return 'Nombre inválido (2–60 caracteres).'
  if (!b.calificacion || b.calificacion < 1 || b.calificacion > 5
                      || !Number.isInteger(b.calificacion))              return 'Calificación debe ser un entero de 1 a 5.'
  if (b.comentario && b.comentario.length > 1000)                        return 'Comentario máximo 1000 caracteres.'
  return null
}

export async function POST(req: NextRequest) {
  try {
    const body: Body = await req.json()

    const err = validar(body)
    if (err) return NextResponse.json({ ok: false, error: err }, { status: 400 })

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
           ?? req.headers.get('x-real-ip')
           ?? 'unknown'
    const ip_hash = createHash('sha256').update(ip).digest('hex')

    const { data: puedeCommentar, error: rlErr } = await supabaseAdmin
      .rpc('puede_comentar', { p_receta_id: body.receta_id, p_ip_hash: ip_hash })
    if (rlErr) throw rlErr
    if (!puedeCommentar) {
      return NextResponse.json(
        { ok: false, error: 'Demasiadas reseñas. Intenta más tarde.' },
        { status: 429 }
      )
    }

    const { data: receta, error: recetaErr } = await supabaseAdmin
      .from('recetas')
      .select('id')
      .eq('id', body.receta_id)
      .eq('publicada', true)
      .single()
    if (recetaErr || !receta) {
      return NextResponse.json({ ok: false, error: 'Receta no encontrada.' }, { status: 404 })
    }

    const { error: insertErr } = await supabaseAdmin
      .from('resenas')
      .insert({
        receta_id:    body.receta_id,
        autor_nombre: body.autor_nombre.trim(),
        calificacion: body.calificacion,
        comentario:   body.comentario?.trim() ?? null,
        ip_hash,
        aprobada:     false,
      })
    if (insertErr) throw insertErr

    return NextResponse.json(
      { ok: true, mensaje: 'Reseña recibida. Aparecerá después de ser aprobada.' },
      { status: 201 }
    )
  } catch (e) {
    console.error('[POST /api/resenas]', e)
    return NextResponse.json({ ok: false, error: 'Error interno.' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Método no permitido.' }, { status: 405 })
}