"use client"

import SafeImage from "@/components/listing/safe-image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { useFavorites } from "@/hooks/use-favorites"
import { formatCurrency } from "@/lib/utils"
import { Heart, MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface PropertyCardProps {
  property: {
    id: string
    aluguel: number
    condominio: number
    caucao: number
    duracaoMinimaContrato: number
    descricao: string
    tipo: string
    qtdQuartos: number
    qtdBanheiros: number
    area: number
    enderecoCompleto: string
    caracteristicas: string[]
    fotos: {        // ← Formato atualizado
      id: string
      dadosBase64: string
    }[]
    anunciante: {
      id: string
      name: string
    }
  }
  viewMode: "grid" | "list"
}

export default function PropertyCard({ property, viewMode }: PropertyCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorited = isFavorite(property.id)

  if (viewMode === "list") {
    return (
      <Card className="overflow-hidden rounded-3xl border-0 bg-white/80 backdrop-blur-sm shadow-lg ring-1 ring-gray-900/5 hover:shadow-xl transition-all duration-300 dark:bg-gray-800/80 dark:ring-gray-100/10">
        <div className="flex flex-col lg:flex-row">
          <div className="relative w-full lg:w-80 h-64 lg:h-auto">
            <Link href={`/listing/${property.id}`}>
              <SafeImage
                fotos={property.fotos}
                alt={`${property.tipo} em ${property.enderecoCompleto}`}
                className="object-cover"
              />
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
              {formatCurrency(property.aluguel)}
            </Badge>
          </div>

          <div className="flex flex-col flex-1 p-8">
            <Link href={`/listing/${property.id}`}>
              <h3 className="font-bold text-xl mb-3 hover:text-blue-600 transition-colors line-clamp-2">
                {property.descricao}
              </h3>
            </Link>

            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
              <MapPin size={16} className="mr-2 text-gray-400" />
              <span className="text-sm">{property.enderecoCompleto}</span>
            </div>

            <div className="flex items-center text-gray-600 dark:text-gray-400 mb-4">
              <Badge variant="secondary" className="rounded-full">
                {property.qtdQuartos} {property.qtdQuartos === 1 ? "Quarto" : "Quartos"}
              </Badge>
              <Badge variant="secondary" className="rounded-full">
                {property.qtdBanheiros} {property.qtdBanheiros === 1 ? "Banheiro" : "Banheiros"}
              </Badge>
              <Badge variant="secondary" className="rounded-full">
                {property.area}m²
              </Badge>
              <Badge variant="secondary" className="rounded-full">
                {property.tipo}
              </Badge>
            </div>

            <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed">{property.descricao}</p>

            <div className="flex flex-wrap gap-2 mb-6">
              {property.caracteristicas.slice(0, 3).map((feature, index) => (
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
    <Card className="overflow-hidden rounded-3xl border-0 bg-white/80 backdrop-blur-sm shadow-lg ring-1 ring-gray-900/5 hover:shadow-xl transition-all duration-300 dark:bg-gray-800/80 dark:ring-gray-100/10">
      <Link href={`/listing/${property.id}`}>
        <div className="relative">
          <div className="aspect-[4/3] relative">
            <SafeImage
              fotos={property.fotos}
              alt={property.descricao}
              className="object-cover"
              priority={true} // Para a primeira imagem da lista
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
            onClick={(e) => {
              e.preventDefault()
              toggleFavorite(property.id)
            }}
            aria-label={favorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Heart className={favorited ? "fill-red-500 text-red-500" : "text-gray-600"} size={20} />
          </Button>
          <Badge className="absolute bottom-4 left-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white border-0 rounded-full px-4 py-2 font-semibold">
            {formatCurrency(property.aluguel)}
          </Badge>
        </div>
      </Link>

      <CardHeader>
        <div className="flex justify-between items-start gap-4">
          <div>
            <Link href={`/listing/${property.id}`}>
              <h3 className="text-lg font-semibold hover:text-blue-600 transition-colors">{property.descricao}</h3>
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400">{property.enderecoCompleto}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {formatCurrency(property.aluguel)}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              + {formatCurrency(property.condominio)} (Condomínio)
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="secondary" className="rounded-full">
            {property.qtdQuartos} {property.qtdQuartos === 1 ? "Quarto" : "Quartos"}
          </Badge>
          <Badge variant="secondary" className="rounded-full">
            {property.qtdBanheiros} {property.qtdBanheiros === 1 ? "Banheiro" : "Banheiros"}
          </Badge>
          <Badge variant="secondary" className="rounded-full">
            {property.area}m²
          </Badge>
          <Badge variant="secondary" className="rounded-full">
            {property.tipo}
          </Badge>
        </div>

        {property.caracteristicas.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {property.caracteristicas.map((feature, index) => (
              <Badge key={index} variant="outline" className="rounded-full">
                {feature}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Anunciante: {property.anunciante.name}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Contrato mínimo: {property.duracaoMinimaContrato} meses
        </div>
      </CardFooter>
    </Card>
  )
}
