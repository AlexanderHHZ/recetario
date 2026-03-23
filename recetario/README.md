# Recetario Digital — Ingrediente 791

Boilerplate completo: Next.js 14 · TypeScript · Tailwind CSS · Supabase

---

## Estructura de carpetas

```
recetario-digital/
│
├── .env.local                         ← Variables de entorno (NO subir a git)
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.js
├── package.json
│
└── src/
    ├── types/
    │   └── index.ts                   ← Tipos TypeScript (espejo del schema SQL)
    │
    ├── lib/
    │   ├── supabase.ts                ← Clientes Supabase (anon + service role)
    │   └── queries.ts                 ← Todas las queries centralizadas
    │
    ├── components/
    │   ├── layout/
    │   │   ├── Navbar.tsx             ← Navbar sticky con buscador y menú móvil
    │   │   └── BuscadorModal.tsx      ← Modal de búsqueda full-text
    │   │
    │   └── receta/
    │       ├── RecetaCard.tsx         ← Tarjeta para la galería
    │       ├── EstrellasBadge.tsx     ← Badge de calificación (solo lectura)
    │       ├── VideoYoutube.tsx       ← Iframe de YouTube (extrae ID automáticamente)
    │       ├── ListaIngredientes.tsx  ← Checkboxes interactivos con barra de progreso
    │       ├── ListaPasos.tsx         ← Pasos numerados con imagen opcional
    │       └── SeccionResenas.tsx     ← Reseñas aprobadas + formulario de nueva reseña
    │
    └── app/                           ← App Router de Next.js 14
        ├── layout.tsx                 ← Layout raíz (incluye Navbar y Footer)
        ├── globals.css                ← Tailwind + tokens CSS + utilidades
        ├── page.tsx                   ← Inicio: Hero + Galería
        ├── loading.tsx                ← Skeleton de carga de la galería
        ├── not-found.tsx              ← Página 404 personalizada
        │
        ├── recetas/
        │   └── [slug]/
        │       ├── page.tsx           ← Página de receta individual
        │       └── loading.tsx        ← Skeleton mientras carga
        │
        ├── sobre-mi/
        │   └── page.tsx              ← Página Sobre mí
        │
        ├── contacto/
        │   └── page.tsx              ← Página de contacto con formulario
        │
        └── api/
            ├── contacto/
            │   └── route.ts          ← POST → inserta en mensajes_contacto
            └── resenas/
                └── route.ts          ← POST → inserta en resenas (aprobada=false)
```

---

## Instalación paso a paso

### 1. Crear el proyecto

```bash
npx create-next-app@14 recetario-digital \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"
cd recetario-digital
```

### 2. Instalar dependencias

```bash
npm install @supabase/supabase-js
npm install -D @tailwindcss/typography @tailwindcss/forms
```

### 3. Copiar los archivos del boilerplate

Copia cada archivo de este boilerplate en la ruta indicada dentro de `src/`.

### 4. Configurar variables de entorno

Crea `.env.local` en la raíz del proyecto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://TU_PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=eyJ...tu_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Encuéntralos en: **Supabase Dashboard → tu proyecto → Settings → API**

### 5. Ejecutar la base de datos

En el editor SQL de Supabase, ejecuta en este orden:
1. `recetario_digital_schema_v3.sql`
2. `recetario_mensajes_contacto.sql`

### 6. Levantar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

---

## Flujo de datos (arquitectura)

```
Supabase (PostgreSQL)
      │
      │  Server Components (sin 'use client')
      ├─ src/lib/queries.ts  ←──────────────── page.tsx (inicio, receta)
      │                                        sobre-mi/page.tsx
      │
      │  Client Components ('use client')
      ├─ BuscadorModal.tsx   ──── supabase (anon, solo lectura)
      │
      │  API Routes (solo servidor, service role)
      └─ /api/contacto       ──── supabaseAdmin → mensajes_contacto
         /api/resenas        ──── supabaseAdmin → resenas
```

**Regla de oro:** `supabaseAdmin` (service role) **nunca** se importa
en Client Components. Solo vive en `/api/` routes.

---

## Páginas y rutas

| Ruta                   | Tipo           | Descripción                          |
|------------------------|----------------|--------------------------------------|
| `/`                    | Server + ISR   | Hero (receta destacada) + galería    |
| `/recetas/[slug]`      | Server + ISR   | Video, ingredientes, pasos, reseñas  |
| `/sobre-mi`            | Server         | Foto, bio, redes sociales            |
| `/contacto`            | Client         | Formulario → `/api/contacto`         |
| `/api/contacto`        | API Route      | POST → `mensajes_contacto`           |
| `/api/resenas`         | API Route      | POST → `resenas` (aprobada=false)    |

**ISR** = revalidación cada 60s (inicio) / 300s (recetas). Las páginas
se sirven como HTML estático y se regeneran en background.

---

## Componentes reutilizables clave

### `VideoYoutube`
Acepta cualquier formato de URL de YouTube y extrae el ID automáticamente:
- `https://youtube.com/watch?v=ABC`
- `https://youtu.be/ABC`
- `https://youtube.com/embed/ABC`

### `ListaIngredientes`
Cliente interactivo con checkboxes. Mantiene estado local (ningún fetch).
Muestra barra de progreso cuando el usuario va marcando ingredientes.

### `SeccionResenas`
Combina lista de reseñas aprobadas (props del servidor) con formulario
de nueva reseña (fetch a `/api/resenas`). La reseña queda en cola de
moderación (`aprobada = false`) hasta que el admin la aprueba en Payload.

### `BuscadorModal`
Búsqueda full-text contra la columna `search_vector` de Supabase con
debounce de 300ms. Soporta acentos en español gracias al índice GIN
y la función `immutable_unaccent`.

---

## Próximos pasos recomendados

1. **Configurar Payload CMS** con los Globals `SobreMi` y `PaginaContacto`
   (ver `payload_globals.ts`)
2. **Conectar Cloudinary** para subida de imágenes desde el panel admin
3. **Reemplazar contenido placeholder** en `sobre-mi/page.tsx` con los
   datos reales del Dr. Edgar
4. **Configurar Supabase RLS** (Row Level Security) para proteger las
   tablas de escritura directa desde el cliente
5. **Desplegar en Vercel**: conectar el repositorio y agregar las
   variables de entorno en el dashboard de Vercel

---

## .gitignore recomendado

```
# Dependencias
node_modules/

# Variables de entorno (¡NUNCA subir!)
.env
.env.local
.env.*.local

# Next.js
.next/
out/

# Misc
.DS_Store
*.log
```
