// middleware.ts  (raíz del proyecto, junto a next.config.ts)
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/supabase/types'

// Rutas que requieren estar autenticado
const RUTAS_PROTEGIDAS = ['/favoritos', '/perfil']

// Rutas exclusivas para admin
const RUTAS_ADMIN = ['/admin']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refrescar sesión (crítico para SSR con cookies)
  const { data: { user } } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // ── Rutas de Admin ───────────────────────────────────────
  const esRutaAdmin = RUTAS_ADMIN.some((ruta) => pathname.startsWith(ruta))

  if (esRutaAdmin) {
    if (!user) {
      // No autenticado → login
      const url = request.nextUrl.clone()
      url.pathname = '/login'
      url.searchParams.set('redirect', pathname)
      return NextResponse.redirect(url)
    }

    // Verificar rol directamente en DB (no confiar solo en JWT claims)
    const { data: perfil } = await supabase
      .from('perfiles')
      .select('rol')
      .eq('id', user.id)
      .single()

    if (perfil?.rol !== 'admin') {
      // Autenticado pero no admin → home
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
    }
  }

  // ── Rutas Protegidas (usuarios autenticados) ─────────────
  const esRutaProtegida = RUTAS_PROTEGIDAS.some((ruta) =>
    pathname.startsWith(ruta)
  )

  if (esRutaProtegida && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  // ── Redirigir si ya está logueado y va a /login ──────────
  if (user && pathname === '/login') {
    const { data: perfil } = await supabase
      .from('perfiles')
      .select('rol')
      .eq('id', user.id)
      .single()

    const url = request.nextUrl.clone()
    url.pathname = perfil?.rol === 'admin' ? '/admin' : '/'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Excluye rutas internas de Next.js y archivos estáticos
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}