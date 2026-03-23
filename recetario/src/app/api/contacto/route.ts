// ============================================================
//  RECETARIO DIGITAL — API Route: Contacto
//  src/app/api/contacto/route.ts
//
//  Importa supabaseAdmin desde supabase-admin.ts (no desde supabase.ts)
// ============================================================

import { createHash }    from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-admin'   // ← archivo separado

interface Body { nombre: string; email: string; asunto: string; mensaje: string }

function validar(b: Body): string | null {
  if (!b.nombre  || b.nombre.length  < 2   || b.nombre.length  > 80)   return 'Nombre inválido (2–80 caracteres).'
  if (!b.email   || !/^[^@]+@[^@]+\.[^@]+$/.test(b.email))             return 'Email inválido.'
  if (!b.asunto  || b.asunto.length  < 3   || b.asunto.length  > 120)  return 'Asunto inválido (3–120 caracteres).'
  if (!b.mensaje || b.mensaje.length < 10  || b.mensaje.length > 3000) return 'Mensaje inválido (10–3000 caracteres).'
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

    const { data: puedeEnviar, error: rlErr } = await supabaseAdmin
      .rpc('puede_enviar_mensaje', { p_ip_hash: ip_hash })
    if (rlErr) throw rlErr
    if (!puedeEnviar) {
      return NextResponse.json(
        { ok: false, error: 'Demasiados mensajes. Intenta más tarde.' },
        { status: 429 }
      )
    }

    const { error: insertErr } = await supabaseAdmin
      .from('mensajes_contacto')
      .insert({
        nombre:  body.nombre.trim(),
        email:   body.email.trim().toLowerCase(),
        asunto:  body.asunto.trim(),
        mensaje: body.mensaje.trim(),
        ip_hash,
      })
    if (insertErr) throw insertErr

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (e) {
    console.error('[POST /api/contacto]', e)
    return NextResponse.json({ ok: false, error: 'Error interno.' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Método no permitido.' }, { status: 405 })
}