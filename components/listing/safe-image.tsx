"use client"

import Image from "next/image"
import { useState } from "react"

interface SafeImageProps {
  fotos: {
    id: string
    dadosBase64: string
  }[]
  alt: string
  className?: string
  fill?: boolean
  priority?: boolean
}

export default function SafeImage({
  fotos,
  alt,
  className = "object-cover",
  fill = true,
  priority = false
}: SafeImageProps) {
  const [error, setError] = useState(false)
  
  // Fallback se não houver fotos ou ocorrer erro
  if (error || !fotos?.length) {
    return (
      <div className={`${fill ? "absolute inset-0" : "relative"} bg-gray-100 dark:bg-gray-800 flex items-center justify-center`}>
        <span className="text-gray-400 dark:text-gray-600 text-sm">
          {alt || "Imagem não disponível"}
        </span>
      </div>
    )
  }

  const firstPhoto = fotos[0]
  const imageSrc = firstPhoto.dadosBase64.startsWith('data:image')
    ? firstPhoto.dadosBase64
    : `data:image/jpeg;base64,${firstPhoto.dadosBase64}`

  return (
    <Image
      src={imageSrc}
      alt={alt}
      fill={fill}
      className={className}
      priority={priority}
      onError={() => setError(true)}
      unoptimized={true} // Recomendado para imagens base64
    />
  )
}