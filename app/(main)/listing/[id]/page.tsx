"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { anuncioService } from "@/lib/services/anuncio.service"
import { formatCurrency } from "@/lib/utils"
import {
  Bath,
  BedDouble,
  Calendar,
  CheckCircle2,
  MapPin,
  MessageSquare,
  Ruler,
  Share2,
  Loader2
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState, use } from "react"
import InterestedUsers from "./interested-users"
import { getInterestedUsers } from "@/lib/services/ad.service"
import { UserInfo } from "@/lib/services/types"

interface Anuncio {
  id: string;
  descricao: string;
  enderecoCompleto: string;
  qtdQuartos: number;
  qtdBanheiros: number;
  area: number;
  dataDisponibilidade: string;
  fotos?: { id: string; dadosBase64: string }[];
  caracteristicas: string[];
  duracaoMinimaContrato: number;
  caucao: number;
  aluguel: number;
  condominio: number;
  anunciante: {
    id: string;
    name: string;
  };
}

export default function ListingPage({ params }: { params: Promise<{ id: string }> }) {
  // Unwrap the params promise using use()
  const { id } = use(params)
  const [interestedUsers, setInterestedUsers] = useState<UserInfo[]>([])
  const [anuncio, setAnuncio] = useState<Anuncio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchData = async () => {
      try {
        const [anuncioData, users] = await Promise.all([
          anuncioService.buscarPorId(id),
          getInterestedUsers(id)
        ])
        
        if (!anuncioData.data) {
          throw new Error("Anúncio não encontrado")
        }

        setAnuncio(anuncioData.data)
        setInterestedUsers(users || [])
      } catch (err) {
        console.error("Error:", err)
        setError(err instanceof Error ? err.message : "Ocorreu um erro")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-10 text-center">
        <h2 className="text-2xl font-bold text-red-500">{error}</h2>
        <Link href="/" className="text-blue-500 hover:underline mt-4 inline-block">
          Voltar para a página inicial
        </Link>
      </div>
    )
  }

  if (!anuncio) {
    return (
      <div className="container py-10 text-center">
        <h2 className="text-2xl font-bold">Anúncio não encontrado</h2>
        <Link href="/" className="text-blue-500 hover:underline mt-4 inline-block">
          Voltar para a página inicial
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
          {anuncio.descricao}
        </h1>
        <div className="flex items-center text-muted-foreground mb-6">
          <MapPin size={20} className="mr-2" />
          <span className="text-lg">{anuncio.enderecoCompleto}</span>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 rounded-full text-base">
            <BedDouble size={16} />
            {anuncio.qtdQuartos} {anuncio.qtdQuartos > 1 ? "quartos" : "quarto"}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 rounded-full text-base">
            <Bath size={16} />
            {anuncio.qtdBanheiros} {anuncio.qtdBanheiros > 1 ? "banheiros" : "banheiro"}
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 rounded-full text-base">
            <Ruler size={16} />
            {anuncio.area}m²
          </Badge>
          <Badge variant="secondary" className="flex items-center gap-2 px-4 py-2 rounded-full text-base">
            <Calendar size={16} />
            Disponível a partir de {new Date(anuncio.dataDisponibilidade).toLocaleDateString('pt-BR')}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-10">
            <Carousel className="w-full">
              <CarouselContent>
                {anuncio.fotos?.map((foto: { id: string; dadosBase64: string }, index: number) => (
                  <CarouselItem key={foto.id}> {/* Melhor usar foto.id como key */}
                    <div className="aspect-video relative rounded-3xl overflow-hidden">
                      <Image
                        src={`data:image/jpeg;base64,${foto.dadosBase64}`} // Adiciona prefixo Base64
                        alt={`Foto do anúncio`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
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
                <p className="text-muted-foreground leading-relaxed text-lg">{anuncio.descricao}</p>
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
                        {anuncio.qtdQuartos} {anuncio.qtdQuartos > 1 ? "quartos" : "quarto"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center dark:bg-blue-900/20">
                      <Bath className="text-blue-500" size={24} />
                    </div>
                    <div>
                      <p className="font-medium text-lg">
                        {anuncio.qtdBanheiros} {anuncio.qtdBanheiros > 1 ? "banheiros" : "banheiro"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center dark:bg-blue-900/20">
                      <Ruler className="text-blue-500" size={24} />
                    </div>
                    <div>
                      <p className="font-medium text-lg">{anuncio.area}m²</p>
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
                    <span className="text-lg">Contrato mínimo de {anuncio.duracaoMinimaContrato} meses</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center dark:bg-green-900/20">
                      <CheckCircle2 size={20} className="text-green-500" />
                    </div>
                    <span className="text-lg">Caução de {formatCurrency(anuncio.caucao)}</span>
                  </li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="features">
              <h2 className="text-2xl font-bold mb-6">Características</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {anuncio.caracteristicas.map((feature: string, index: number) => (
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
                <h3 className="text-xl font-bold mb-4">Endereço</h3>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center dark:bg-blue-900/20">
                    <MapPin size={20} className="text-blue-500" />
                  </div>
                  <span className="text-lg">{anuncio.enderecoCompleto}</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-8">
          <Card className="overflow-hidden rounded-3xl border-0 bg-white/80 backdrop-blur-sm shadow-lg ring-1 ring-gray-900/5 dark:bg-gray-800/80 dark:ring-gray-100/10">
            <CardContent className="pt-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                  {formatCurrency(anuncio.aluguel)}/mês
                </div>
                <p className="text-muted-foreground">+ {formatCurrency(anuncio.condominio)} (condomínio)</p>
              </div>

              <div className="space-y-4">
                <Button className="w-full h-12 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 font-medium dark:text-whtite">
                  Agendar visita
                </Button>
                <Button
                  variant="outline"
                  className="w-full h-12 rounded-2xl flex items-center gap-2 font-medium"
                  onClick={() => {
                    window.location.href = `/chats?user=${anuncio.anunciante.id}`
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
                <Link href={`/user/${anuncio.anunciante.id}`} className="font-semibold text-lg hover:text-blue-600">
                  {anuncio.anunciante.name}
                </Link>
              </div>

              <Button variant="outline" className="w-full h-12 rounded-2xl font-medium">
                <Link href={`/user/${anuncio.anunciante.id}`} className="w-full">
                  Ver perfil
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Lista de Usuários Interessados */}
          <Card>
            <CardContent className="pt-8 flex-1 flex flex-col">
              {interestedUsers.length > 0 ? (
                <InterestedUsers interestedUsers={interestedUsers} />
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Nenhum usuário interessado ainda
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
