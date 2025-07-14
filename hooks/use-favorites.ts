"use client"

import { anuncioService } from "@/lib/services/anuncio.service"
import { useState, useEffect } from "react"

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Carregar favoritos do localStorage quando o componente montar
  useEffect(() => {
    const storedFavorites = localStorage.getItem("favorites")
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites))
    }
    setIsLoaded(true)
  }, [])

  // Salvar favoritos no localStorage quando mudar
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("favorites", JSON.stringify(favorites))
    }
  }, [favorites, isLoaded])

  const toggleFavorite = (id: string) => {
    anuncioService.favoritar(id)
    .then((response) => {
      setFavorites((prev) => {
        if (prev.includes(id)) {
          return prev.filter((item) => item !== id)
        } else {
          return [...prev, id]
        }
      })
    })
    .catch((error) => {
      console.error(error, 'error')
    })

  }

  const isFavorite = (id: string) => {
    return favorites.includes(id)
  }

  return { favorites, toggleFavorite, isFavorite, isLoaded }
}
