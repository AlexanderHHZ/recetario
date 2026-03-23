// ============================================================
//  RECETARIO DIGITAL — Cliente Supabase admin
//  src/lib/supabase-admin.ts
//
//  USA SUPABASE_SERVICE_ROLE_KEY — SOLO en el servidor.
//  Importar ÚNICAMENTE desde: src/app/api/**/route.ts
//  NUNCA importar en Client Components ni en componentes
//  que se rendericen en el navegador.
// ============================================================

import { createClient } from '@supabase/supabase-js'

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      persistSession:   false,
      autoRefreshToken: false,
    },
  }
)