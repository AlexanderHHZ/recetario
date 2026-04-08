// ============================================================
//  RECETARIO DIGITAL — Auth Callback
//  src/app/auth/callback/route.ts
//
//  Supabase redirige aquí después de que el usuario
//  hace clic en el enlace de confirmación de email.
//  Este route intercambia el code por una sesión activa.
// ============================================================

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
  const { searchParams, origin } = new URL(req.url)
  const code  = searchParams.get('code')
  const next  = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Redirigir al destino indicado (o al inicio)
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Si algo falla, redirigir al login con mensaje de error
  return NextResponse.redirect(`${origin}/login?error=confirmation_failed`)
}