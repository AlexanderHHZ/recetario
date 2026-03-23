'use client'

// src/hooks/useAuth.ts
import { useState, useEffect, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import type { Perfil } from '@/lib/supabase/types'

interface EstadoAuth {
  user: User | null
  perfil: Perfil | null
  cargando: boolean
}

export function useAuth(): EstadoAuth & { cerrarSesion: () => Promise<void> } {
  const [estado, setEstado] = useState<EstadoAuth>({
    user: null,
    perfil: null,
    cargando: true,
  })

  const supabase = createSupabaseBrowserClient()

  const cargarPerfil = useCallback(
    async (user: User | null) => {
      if (!user) {
        setEstado({ user: null, perfil: null, cargando: false })
        return
      }

      const { data: perfil } = await supabase
        .from('perfiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setEstado({ user, perfil, cargando: false })
    },
    [supabase]
  )

  useEffect(() => {
    // Carga inicial
    supabase.auth.getUser().then(({ data: { user } }) => cargarPerfil(user))

    // Suscripción reactiva a cambios de sesión
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      cargarPerfil(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase, cargarPerfil])

  const cerrarSesion = useCallback(async () => {
    await supabase.auth.signOut()
  }, [supabase])

  return { ...estado, cerrarSesion }
}