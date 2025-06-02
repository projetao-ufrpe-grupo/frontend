"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bath,
  BedDouble,
  Calendar,
  CheckCircle2,
  Info,
  MapPin,
  MessageSquare,
  Ruler,
  School,
  Share2,
  Star,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import InterestedUsers from "./interested-users"

// Dados simulados de uma propriedade específica
const property = {
  id: "1",
  title: "Apartamento próximo à USP",
  description:
    "Apartamento de 2 quartos, totalmente mobiliado, a apenas 5 minutos a pé da USP. Localizado em uma área tranquila e segura, perfeito para estudantes. O apartamento possui uma sala espaçosa, cozinha completa, área de serviço e varanda. Condomínio com portaria 24h, academia e área de lazer.",
  price: 1200,
  location: "Rua das Acácias, 123 - Butantã, São Paulo - SP",
  university: "USP",
  distance: "500m",
  bedrooms: 2,
  bathrooms: 1,
  area: 65,
  images: ["/images/apartment1.png", "/images/apartment1.png", "/images/apartment1.png", "/images/apartment1.png"],
  features: [
    "Mobiliado",
    "Internet fibra",
    "Lavanderia",
    "Portaria 24h",
    "Próximo a comércios",
    "Transporte público próximo",
  ],
  type: "Apartamento",
  availableFrom: "01/06/2023",
  landlord: {
    id: "101",
    name: "Carlos Silva",
    rating: 4.8,
    responseTime: "2 horas",
    memberSince: "Março 2020",
    avatar: "/images/user-profile.png",
  },
}

export default function ListingPage({ params }: { params: { id: string } }) {
  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
          {property.title}
        </h1>
        <div className="flex items-center text-muted-foreground mb-6">
          <MapPin size={20} className="mr-2" />
          <span className="text-lg">{property.location}</span>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 rounded-full text-base">
            <School size={16} />
            {property.university} • {property.distance}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 rounded-full text-base">
            <BedDouble size={16} />
            {property.bedrooms} {property.bedrooms > 1 ? "quartos" : "quarto"}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 rounded-full text-base">
            <Bath size={16} />
            {property.bathrooms} {property.bathrooms > 1 ? "banheiros" : "banheiro"}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 rounded-full text-base">
            <Ruler size={16} />
            {property.area}m²
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 rounded-full text-base">
            <Calendar size={16} />
            Disponível a partir de {property.availableFrom}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-10">
            <Carousel className="w-full">
              <CarouselContent>
                {property.images.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-video relative rounded-3xl overflow-hidden">
                      <Image
                        src={image || "/placeholder.svg"}
                        alt={`${property.title} - imagem ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          </div>

          <Tabs defaultValue="details">
            <TabsList className="mb-8 grid w-full grid-cols-3 h-14 rounded-2xl bg-gray-100 dark:bg-gray-800 p-1">
              <TabsTrigger value="details" className="rounded-xl font-medium">
                Detalhes
              </TabsTrigger>
              <TabsTrigger value="features" className="rounded-xl font-medium">
                Características
              </TabsTrigger>
              <TabsTrigger value="location" className="rounded-xl font-medium">
                Localização
              </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">Sobre este imóvel</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">{property.description}</p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Informações gerais</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center dark:bg-blue-900/20">
                      <BedDouble className="text-blue-500" size={24} />
                    </div>
                    <div>
                      <p className="font-medium text-lg">
                        {property.bedrooms} {property.bedrooms > 1 ? "quartos" : "quarto"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center dark:bg-blue-900/20">
                      <Bath className="text-blue-500" size={24} />
                    </div>
                    <div>
                      <p className="font-medium text-lg">
                        {property.bathrooms} {property.bathrooms > 1 ? "banheiros" : "banheiro"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center dark:bg-blue-900/20">
                      <Ruler className="text-blue-500" size={24} />
                    </div>
                    <div>
                      <p className="font-medium text-lg">{property.area}m²</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-4">Regras do imóvel</h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center dark:bg-green-900/20">
                      <CheckCircle2 size={20} className="text-green-500" />
                    </div>
                    <span className="text-lg">Contrato mínimo de 6 meses</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center dark:bg-green-900/20">
                      <CheckCircle2 size={20} className="text-green-500" />
                    </div>
                    <span className="text-lg">Caução de 2 meses</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center dark:bg-amber-900/20">
                      <Info size={20} className="text-amber-500" />
                    </div>
                    <span className="text-lg">Não é permitido animais</span>
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="features">
              <h2 className="text-2xl font-bold mb-6">Características</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center dark:bg-blue-900/20">
                      <CheckCircle2 size={18} className="text-blue-500" />
                    </div>
                    <span className="text-lg">{feature}</span>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="location">
              <h2 className="text-2xl font-bold mb-6">Localização</h2>
              <div className="aspect-video bg-muted rounded-3xl flex items-center justify-center mb-6">
                <p className="text-muted-foreground text-lg">Mapa da localização</p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-4">Proximidades</h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center dark:bg-blue-900/20">
                      <School size={20} className="text-blue-500" />
                    </div>
                    <span className="text-lg">USP - 500m (5 minutos a pé)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center dark:bg-blue-900/20">
                      <MapPin size={20} className="text-blue-500" />
                    </div>
                    <span className="text-lg">Ponto de ônibus - 200m</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center dark:bg-blue-900/20">
                      <MapPin size={20} className="text-blue-500" />
                    </div>
                    <span className="text-lg">Supermercado - 400m</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center dark:bg-blue-900/20">
                      <MapPin size={20} className="text-blue-500" />
                    </div>
                    <span className="text-lg">Farmácia - 300m</span>
                  </li>
                </ul>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-8">
          <Card className="overflow-hidden rounded-3xl border-0 bg-white/80 backdrop-blur-sm shadow-lg ring-1 ring-gray-900/5 dark:bg-gray-800/80 dark:ring-gray-100/10">
            <CardContent className="pt-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                  R$ {property.price.toLocaleString()}/mês
                </div>
                <p className="text-muted-foreground">+ condomínio e contas</p>
              </div>

              <div className="space-y-4">
                <Button className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 font-medium dark:text-whtite">
                  Agendar visita
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-2xl flex items-center gap-2 font-medium"
                  onClick={() => {
                    window.location.href = `/chats?user=${property.landlord.id}`
                  }}
                >
                  <MessageSquare size={18} />
                  Enviar mensagem
                </Button>
                <Button variant="ghost" className="w-full h-12 rounded-2xl flex items-center gap-2 font-medium">
                  <Share2 size={18} />
                  Compartilhar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden rounded-3xl border-0 bg-white/80 backdrop-blur-sm shadow-lg ring-1 ring-gray-900/5 dark:bg-gray-800/80 dark:ring-gray-100/10">
            <CardContent className="pt-8">
              <div className="mb-6">
                <Link href={`/user/${property.landlord.id}`} className="font-semibold text-lg hover:text-blue-600">
                  {property.landlord.name}
                </Link>
                <div className="text-muted-foreground">Membro desde {property.landlord.memberSince}</div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Avaliação:</span>
                  <span className="font-medium flex items-center gap-1">
                    <Star size={16} fill="#FFD700" />
                    {property.landlord.rating}/5
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tempo de resposta:</span>
                  <span className="font-medium">{property.landlord.responseTime}</span>
                </div>
              </div>

              <Button variant="outline" className="w-full h-12 rounded-2xl font-medium">
                <Link href={`/user/${property.landlord.id}`} className="w-full">
                  Ver perfil
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Lista de Usuários Interessados */}
          <Card>
            <CardContent className="pt-8 flex-1 flex flex-col">
              <InterestedUsers />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
