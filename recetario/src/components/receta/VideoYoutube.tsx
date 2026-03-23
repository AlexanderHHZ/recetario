'use client'
// ============================================================
//  RECETARIO DIGITAL — Componente de Video YouTube
//  src/components/receta/VideoYoutube.tsx
//
//  Extrae el video ID de cualquier formato de URL de YouTube
//  y lo incrusta con el iframe oficial.
// ============================================================

interface Props {
  url: string
  titulo?: string
}

function extraerVideoId(url: string): string | null {
  try {
    const u = new URL(url)
    // youtu.be/ID
    if (u.hostname === 'youtu.be') return u.pathname.slice(1)
    // youtube.com/watch?v=ID
    if (u.searchParams.has('v')) return u.searchParams.get('v')
    // youtube.com/embed/ID
    const embedMatch = u.pathname.match(/\/embed\/([^/?]+)/)
    if (embedMatch) return embedMatch[1]
    return null
  } catch {
    return null
  }
}

export default function VideoYoutube({ url, titulo }: Props) {
  const videoId = extraerVideoId(url)

  if (!videoId) {
    return (
      <div className="aspect-video bg-stone-100 rounded-2xl flex items-center justify-center">
        <p className="text-stone-400 text-sm">Video no disponible</p>
      </div>
    )
  }

  return (
    <div className="aspect-video rounded-2xl overflow-hidden shadow-md bg-black">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
        title={titulo ?? 'Video de la receta'}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
        loading="lazy"
      />
    </div>
  )
}
