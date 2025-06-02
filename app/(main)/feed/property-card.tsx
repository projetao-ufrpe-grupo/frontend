"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart, MapPin, School, Ruler, BedDouble, Bath } from "lucide-react"
import { useFavorites } from "@/hooks/use-favorites"

interface PropertyCardProps {
  property: {
    id: string
    title: string
    description: string
    price: number
    location: string
    university: string
    distance: string
    bedrooms: number
    bathrooms: number
    area: number
    images: string[]
    features: string[]
    type: string
  }
  viewMode?: "grid" | "list"
}

export default function PropertyCard({ property, viewMode = "grid" }: PropertyCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorited = isFavorite(property.id)

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden rounded-3xl border-0 bg-white/80 backdrop-blur-sm shadow-lg ring-1 ring-gray-900/5 hover:shadow-xl transition-all duration-300 dark:bg-gray-800/80 dark:ring-gray-100/10">
        <div className="flex flex-col lg:flex-row">
          <div className="relative w-full lg:w-80 h-64 lg:h-auto">
            <Link href={`/listing/${property.id}`}>
              <Image src="/placeholder.svg?height=300&width=400" alt={property.title} fill className="object-cover" />
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
              onClick={() => toggleFavorite(property.id)}
              aria-label={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
              <Heart className={favorited ? "fill-red-500 text-red-500" : "text-gray-600"} size={20} />
            </Button>
            <Badge className="absolute bottom-4 left-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white border-0 rounded-full px-4 py-2 font-semibold">
              R$ {property.price.toLocaleString()}/mês
            </Badge>
          </div>

          <div className="flex flex-col flex-1 p-8">
            <Link href={`/listing/${property.id}`}>
              <h3 className="font-bold text-xl mb-3 hover:text-blue-600 transition-colors line-clamp-2">
                {property.title}
              </h3>
            </Link>

            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
              <MapPin size={16} className="mr-2 text-gray-400" />
              <span className="text-sm">{property.location}</span>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
              <School size={16} className="mr-2 text-blue-500" />
              <span className="text-sm font-medium">
                {property.university} • {property.distance}
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed">{property.description}</p>

            <div className="grid grid-cols-3 gap-6 mb-6">
              <div className="flex items-center gap-2">
                <BedDouble size={18} className="text-gray-400" />
                <span className="text-sm font-medium">
                  {property.bedrooms} {property.bedrooms > 1 ? "quartos" : "quarto"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Bath size={18} className="text-gray-400" />
                <span className="text-sm font-medium">
                  {property.bathrooms} {property.bathrooms > 1 ? "banheiros" : "banheiro"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Ruler size={18} className="text-gray-400" />
                <span className="text-sm font-medium">{property.area}m²</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {property.features.slice(0, 3).map((feature, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="rounded-full px-3 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                >
                  {feature}
                </Badge>
              ))}
            </div>

            <div className="mt-auto">
              <Link href={`/listing/${property.id}`} className="w-full">
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-2xl border-gray-200 hover:bg-gray-50 font-medium dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  Ver detalhes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden rounded-3xl border-0 bg-white/80 backdrop-blur-sm shadow-lg ring-1 ring-gray-900/5 hover:shadow-xl hover:scale-[1.02] transition-all duration-300 dark:bg-gray-800/80 dark:ring-gray-100/10 flex flex-col">
      <div className="relative">
        <Link href={`/listing/${property.id}`}>
          <div className="aspect-[4/3] relative overflow-hidden">
            <Image
              src="/placeholder.svg?height=300&width=400"
              alt={property.title}
              fill
              className="object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
          onClick={() => toggleFavorite(property.id)}
          aria-label={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Heart className={favorited ? "fill-red-500 text-red-500" : "text-gray-600"} size={20} />
        </Button>
        <Badge className="absolute bottom-4 left-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white border-0 rounded-full px-4 py-2 font-semibold">
          R$ {property.price.toLocaleString()}/mês
        </Badge>
      </div>

      <CardContent className="p-6 flex-grow">
        <Link href={`/listing/${property.id}`}>
          <h3 className="font-bold text-lg mb-3 hover:text-blue-600 transition-colors line-clamp-2">
            {property.title}
          </h3>
        </Link>

        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
          <MapPin size={14} className="mr-2 text-gray-400" />
          <span className="text-sm">{property.location}</span>
        </div>

        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
          <School size={14} className="mr-2 text-blue-500" />
          <span className="text-sm font-medium">
            {property.university} • {property.distance}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex items-center gap-1">
            <BedDouble size={14} className="text-gray-400" />
            <span className="text-xs font-medium">{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath size={14} className="text-gray-400" />
            <span className="text-xs font-medium">{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Ruler size={14} className="text-gray-400" />
            <span className="text-xs font-medium">{property.area}m²</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {property.features.slice(0, 2).map((feature, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="rounded-full px-2 py-1 text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300"
            >
              {feature}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 mt-auto">
        <Link href={`/listing/${property.id}`} className="w-full">
          <Button
            variant="outline"
            className="w-full h-11 rounded-2xl border-gray-200 hover:bg-gray-50 font-medium dark:border-gray-700 dark:hover:bg-gray-800"
          >
            Ver detalhes
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
