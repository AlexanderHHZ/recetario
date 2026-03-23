// ============================================================
//  RECETARIO DIGITAL — Cliente Supabase público
//  src/lib/supabase.ts
//
//  SOLO variables NEXT_PUBLIC_ — seguro para el navegador.
//  Importar desde Client Components y Server Components.
// ============================================================

import { createClient } from '@supabase/supabase-js'

const supabaseUrl  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnon)