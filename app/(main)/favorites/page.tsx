"use client"

import { Button } from "@/components/ui/button"
import { useFavorites } from "@/hooks/use-favorites"
import { Frown, Heart, Search } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import PropertyCard from "../feed/property-card"

// Dados simulados de propriedades (mesmo do feed)
const properties = [
  {
    id: "1",
    title: "Apartamento próximo à USP",
    description: "Apartamento de 2 quartos, mobiliado, a 5 minutos da USP",
    price: 1200,
    location: "Butantã, São Paulo - SP",
    university: "USP",
    distance: "500m",
    bedrooms: 2,
    bathrooms: 1,
    area: 65,
    images: ['/images/apartment1.png'],
    features: ["Mobiliado", "Internet", "Lavanderia"],
    type: "Apartamento",
  },
  {
    id: "2",
    title: "Kitnet moderna perto da UFMG",
    description: "Kitnet reformada com ótima localização, próxima ao campus Pampulha",
    price: 800,
    location: "Pampulha, Belo Horizonte - MG",
    university: "UFMG",
    distance: "800m",
    bedrooms: 1,
    bathrooms: 1,
    area: 30,
    images: ['/images/apartment1.png'],
    features: ["Mobiliado", "Segurança 24h", "Academia"],
    type: "Kitnet",
  },
  {
    id: "3",
    title: "Casa compartilhada para estudantes da UFRJ",
    description: "Quartos individuais em casa compartilhada, ambiente tranquilo para estudos",
    price: 700,
    location: "Ilha do Fundão, Rio de Janeiro - RJ",
    university: "UFRJ",
    distance: "1.2km",
    bedrooms: 1,
    bathrooms: 2,
    area: 20,
    images: ['/images/apartment1.png'],
    features: ["Quarto individual", "Cozinha compartilhada", "Área de estudos"],
    type: "Quarto",
  },
  {
    id: "4",
    title: "Apartamento espaçoso próximo à UNICAMP",
    description: "Apartamento de 3 quartos, ideal para compartilhar com outros estudantes",
    price: 1800,
    location: "Barão Geraldo, Campinas - SP",
    university: "UNICAMP",
    distance: "1km",
    bedrooms: 3,
    bathrooms: 2,
    area: 90,
    images: ['/images/apartment1.png'],
    features: ["Varanda", "Garagem", "Área de lazer"],
    type: "Apartamento",
  },
  {
    id: "5",
    title: "Studio moderno próximo à PUC",
    description: "Studio completo, recém reformado, a poucos minutos da PUC",
    price: 1500,
    location: "Consolação, São Paulo - SP",
    university: "PUC-SP",
    distance: "400m",
    bedrooms: 1,
    bathrooms: 1,
    area: 40,
    images: ['/images/apartment1.png'],
    features: ["Mobiliado", "Portaria 24h", "Academia"],
    type: "Studio",
  },
  {
    id: "6",
    title: "Quarto em república próximo à UFPE",
    description: "Quarto individual em república estabelecida, ambiente amigável",
    price: 600,
    location: "Cidade Universitária, Recife - PE",
    university: "UFPE",
    distance: "600m",
    bedrooms: 1,
    bathrooms: 2,
    area: 15,
    images: ['/images/apartment1.png'],
    features: ["Internet", "Limpeza semanal", "Área comum"],
    type: "Quarto",
  },
]

export default function FavoritesPage() {
  const { favorites, isLoaded } = useFavorites()
  const [favoriteProperties, setFavoriteProperties] = useState<typeof properties>([])

  useEffect(() => {
    if (isLoaded) {
      const filtered = properties.filter((property) => favorites.includes(property.id))
      setFavoriteProperties(filtered)
    }
  }, [favorites, isLoaded])

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Heart className="h-8 w-8 text-blue-500" />
          Meus Favoritos
        </h1>
        <p className="text-muted-foreground">Imóveis que você salvou para ver mais tarde</p>
      </div>

      {favoriteProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted/30 p-4 rounded-full mb-4">
            <Frown className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Você ainda não tem favoritos</h2>
          <p className="text-muted-foreground max-w-md mb-6">
            Adicione imóveis aos seus favoritos clicando no ícone de coração em cada anúncio para encontrá-los
            facilmente mais tarde.
          </p>
          <Link href="/feed">
            <Button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white">
              <Search size={16} />
              Explorar imóveis
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
