// ============================================================
//  RECETARIO DIGITAL — Tipos TypeScript
//  src/types/index.ts
//  Espejo fiel del schema_v3.sql
// ============================================================

export interface Receta {
  id: string
  titulo: string
  descripcion: string | null
  video_youtube_url: string | null
  slug: string
  publicada: boolean
  tiempo_minutos: number | null
  porciones: number | null
  dificultad: 'fácil' | 'media' | 'difícil' | null
  created_at: string
  updated_at: string
  // Campos de la vista resumen_recetas
  imagen_principal_url?: string | null
  total_resenas?: number
  calificacion_promedio?: number | null
  categorias?: string[]
  ingredientes?: string[]
  total_pasos?: number
}

export interface Paso {
  id: string
  receta_id: string
  numero: number
  descripcion: string
  imagen_url: string | null
}

export interface Ingrediente {
  id: string
  nombre: string
  slug: string
}

export interface RecetaIngrediente {
  receta_id: string
  ingrediente_id: string
  cantidad: string
  orden: number
  ingredientes: Ingrediente   // JOIN
}

export interface Categoria {
  id: string
  nombre: string
  slug: string
  color_hex: string
}

export interface Resena {
  id: string
  receta_id: string
  autor_nombre: string
  calificacion: number
  comentario: string | null
  aprobada: boolean
  created_at: string
}

export interface RecetaImagen {
  id: string
  receta_id: string
  url: string
  alt_text: string | null
  es_principal: boolean
  orden: number
}

export interface MensajeContacto {
  nombre: string
  email: string
  asunto: string
  mensaje: string
}

// Global de Payload CMS — forma que devuelve el endpoint
export interface SobreMiGlobal {
  bio: object          // RichText de Payload (JSON)
  foto: { url: string; alt?: string }
  redes_sociales: Array<{
    plataforma: 'youtube' | 'instagram' | 'tiktok' | 'facebook' | 'twitter' | 'linkedin' | 'website'
    url: string
  }>
  seo?: { meta_titulo?: string; meta_descripcion?: string }
}

export interface ContactoGlobal {
  texto_bienvenida: object
  email_publico: string
  mostrar_telefono: boolean
  telefono?: string
  horario_atencion?: string
  seo?: { meta_titulo?: string; meta_descripcion?: string }
}
