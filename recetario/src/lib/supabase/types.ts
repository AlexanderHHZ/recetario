// src/lib/supabase/types.ts
export type RolUsuario = 'admin' | 'usuario'

export interface Perfil {
  id: string
  email: string
  nombre: string | null
  avatar_url: string | null
  rol: RolUsuario
  creado_en: string
  actualizado_en: string
}

export interface Receta {
  id: string
  titulo: string
  descripcion: string | null
  imagen_url: string | null
  ingredientes: Record<string, unknown> | null
  instrucciones: string | null
  autor_id: string | null
  creado_en: string
  actualizado_en: string
}

export interface Comentario {
  id: string
  receta_id: string
  autor_id: string
  contenido: string
  creado_en: string
}

export type Database = {
  public: {
    Tables: {
      perfiles: {
        Row: Perfil
        Insert: Omit<Perfil, 'creado_en' | 'actualizado_en'>
        Update: Partial<Omit<Perfil, 'id' | 'creado_en'>>
      }
      recetas: {
        Row: Receta
        Insert: Omit<Receta, 'id' | 'creado_en' | 'actualizado_en'>
        Update: Partial<Omit<Receta, 'id' | 'creado_en'>>
      }
      comentarios: {
        Row: Comentario
        Insert: Omit<Comentario, 'id' | 'creado_en'>
        Update: never
      }
    }
    Enums: {
      rol_usuario: RolUsuario
    }
  }
}