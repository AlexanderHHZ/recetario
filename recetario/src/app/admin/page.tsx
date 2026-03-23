// src/app/admin/page.tsx — Server Component (protegido por middleware)
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import {
  ChefHat,
  Users,
  BookOpen,
  MessageSquare,
  TrendingUp,
} from 'lucide-react'

// Doble verificación server-side (defense in depth)
async function verificarAdmin() {
  const supabase = createSupabaseServerClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('rol, nombre')
    .eq('id', user.id)
    .single()

  if (perfil?.rol !== 'admin') redirect('/')

  return { user, perfil }
}

export default async function PaginaAdmin() {
  const { perfil } = await verificarAdmin()
  const supabase = createSupabaseServerClient()

  // Estadísticas del panel
  const [{ count: totalRecetas }, { count: totalUsuarios }, { count: totalComentarios }] =
    await Promise.all([
      supabase.from('recetas').select('*', { count: 'exact', head: true }),
      supabase.from('perfiles').select('*', { count: 'exact', head: true }),
      supabase.from('comentarios').select('*', { count: 'exact', head: true }),
    ])

  const stats = [
    {
      label: 'Recetas',
      valor: totalRecetas ?? 0,
      icono: BookOpen,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
    },
    {
      label: 'Usuarios',
      valor: totalUsuarios ?? 0,
      icono: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
    },
    {
      label: 'Comentarios',
      valor: totalComentarios ?? 0,
      icono: MessageSquare,
      color: 'text-green-600',
      bg: 'bg-green-50',
      border: 'border-green-200',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center w-10 h-10 bg-purple-100 rounded-xl">
            <ChefHat className="w-5 h-5 text-purple-600" strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Panel de Administración
            </h1>
            <p className="text-sm text-gray-500">
              Bienvenido, {perfil.nombre ?? 'Administrador'}
            </p>
          </div>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, valor, icono: Icono, color, bg, border }) => (
          <div
            key={label}
            className={`${bg} ${border} border rounded-2xl p-5 flex items-center gap-4`}
          >
            <div className={`${bg} border ${border} rounded-xl p-3`}>
              <Icono className={`w-6 h-6 ${color}`} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{valor}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Acciones rápidas */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
          <h2 className="font-semibold text-gray-700">Acciones rápidas</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Nueva Receta', href: '/admin/recetas/nueva' },
            { label: 'Gestionar Usuarios', href: '/admin/usuarios' },
            { label: 'Ver Comentarios', href: '/admin/comentarios' },
            { label: 'Configuración', href: '/admin/configuracion' },
          ].map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="text-center py-3 px-4 text-sm font-medium text-gray-600
                bg-gray-50 hover:bg-amber-50 hover:text-amber-700
                border border-gray-200 hover:border-amber-200
                rounded-xl transition-colors duration-200"
            >
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
