'use client'
// ============================================================
//  RECETARIO DIGITAL — Contexto de autenticación
//  src/context/AuthContext.tsx
//
//  Provee sesión y perfil del usuario a toda la app.
//  Envuelve la app en src/app/layout.tsx
// ============================================================

import { createContext, useContext, useEffect, useState } from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface Perfil {
  id:     string
  nombre: string
  email:  string
  rol:    'lector' | 'editor' | 'superadmin'
}

interface AuthContextType {
  user:    User    | null
  perfil:  Perfil  | null
  session: Session | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null, perfil: null, session: null, loading: true,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,    setUser]    = useState<User    | null>(null)
  const [perfil,  setPerfil]  = useState<Perfil  | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchPerfil = async (userId: string) => {
    const { data } = await supabase
      .from('usuarios')
      .select('id, nombre, email, rol')
      .eq('auth_id', userId)
      .single()
    setPerfil(data ?? null)
  }

  useEffect(() => {
    // Sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) fetchPerfil(session.user.id)
      setLoading(false)
    })

    // Escuchar cambios de sesión (login, logout, refresh)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        if (session?.user) fetchPerfil(session.user.id)
        else setPerfil(null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setPerfil(null)
    setSession(null)
  }

  return (
    <AuthContext.Provider value={{ user, perfil, session, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para usar el contexto fácilmente
export const useAuth = () => useContext(AuthContext)
