// ============================================================
//  RECETARIO DIGITAL — Página Sobre mí
//  src/app/sobre-mi/page.tsx
//  Server Component — datos fijos por ahora, listos para
//  conectar con Payload CMS cuando esté configurado.
// ============================================================

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title:       'Sobre mí',
  description: 'Conoce al Dr. Edgar, médico y creador del canal Ingrediente 791.',
}

// Íconos de redes sociales
const REDES = [
  { label: 'YouTube',   href: 'https://youtube.com/@ingrediente791', color: '#FF0000',
    icon: <path d="M23 7s-.3-2-1.2-2.7c-1.1-1.2-2.4-1.2-3-1.3C16.2 3 12 3 12 3s-4.2 0-6.8.2c-.6 0-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.1.7 11.2v2c0 2 .3 4.1.3 4.1s.3 2 1.2 2.7c1.1 1.2 2.6 1.1 3.3 1.2C7.2 21.4 12 21.4 12 21.4s4.2 0 6.8-.3c.6 0 1.9-.1 3-1.3.9-.7 1.2-2.7 1.2-2.7s.3-2 .3-4.1v-2C23.3 9.1 23 7 23 7zM9.7 15.5V8.4l6.5 3.6-6.5 3.5z"/> },
  { label: 'Instagram', href: 'https://instagram.com/ingrediente791', color: '#E4405F',
    icon: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></> },
  { label: 'Facebook',  href: 'https://facebook.com/ingrediente791', color: '#1877F2',
    icon: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/> },
]

export default function SobreMiPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-16">

      {/* ── SECCIÓN PRINCIPAL ── */}
      <section className="grid md:grid-cols-[280px_1fr] gap-10 items-start">

        {/* Foto */}
        <div className="md:sticky md:top-24">
          <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-orange-100 to-amber-50 border border-orange-100">
            {/* Reemplazar src con la foto real del Dr. Edgar */}
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-24 h-24 text-orange-200" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
              </svg>
            </div>
          </div>

          {/* Redes sociales */}
          <div className="mt-6 flex justify-center gap-3">
            {REDES.map(({ label, href, color, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="w-10 h-10 rounded-full border border-stone-200 flex items-center justify-center hover:border-stone-300 hover:shadow-sm transition-all"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" style={{ color }}>
                  {icon}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Biografía */}
        <div className="space-y-8">
          <div>
            <p className="text-xs font-semibold tracking-widest text-orange-500 uppercase mb-2">Quién soy</p>
            <h1 className="text-3xl font-bold text-stone-900 mb-4">Dr. Edgar</h1>
            {/* PLACEHOLDER — reemplazar con contenido real del creador */}
            <div className="prose prose-stone prose-sm max-w-none space-y-4 text-stone-600 leading-relaxed">
              <p>
                Médico de formación y cocinero por vocación. Mi trayectoria en el mundo de la salud me llevó a descubrir la cocina no como un hobby, sino como una extensión natural de mi pasión por el bienestar humano.
              </p>
              <p>
                Llevo más de {new Date().getFullYear() - 2018} años documentando recetas que combinan sabor con ciencia nutricional, buscando siempre que cocinar en casa sea accesible, placentero y, sobre todo, nutritivo.
              </p>
            </div>
          </div>

          {/* Mi pasión */}
          <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100">
            <p className="text-xs font-semibold tracking-widest text-orange-500 uppercase mb-2">Mi pasión</p>
            <h2 className="text-lg font-semibold text-stone-800 mb-3">La cocina como lenguaje universal</h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              Creo que la mesa es el lugar más honesto del mundo. Aquí no importan títulos ni jerarquías: importa lo que pusiste en esa olla y el amor con que lo sirviste. Cada receta que comparto en Ingrediente 791 nace de esa convicción.
            </p>
          </div>

          {/* El sitio web */}
          <div>
            <p className="text-xs font-semibold tracking-widest text-orange-500 uppercase mb-2">El sitio web</p>
            <h2 className="text-lg font-semibold text-stone-800 mb-3">Nuestra misión</h2>
            <p className="text-stone-600 text-sm leading-relaxed">
              Ingrediente 791 nació para ser el repositorio definitivo de recetas del canal: un lugar donde cada platillo tiene su contexto, sus ingredientes claros, su video incrustado y la comunidad que lo acompaña. Calidad sobre cantidad, siempre.
            </p>
          </div>
        </div>
      </section>

    </div>
  )
}
