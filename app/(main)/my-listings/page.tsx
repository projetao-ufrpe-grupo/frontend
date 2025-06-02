"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PlusCircle, Eye, EyeOff, MessageSquare, Calendar, AlertCircle } from "lucide-react"

// Dados simulados de anúncios do usuário
const myListings = [
  {
    id: "1",
    title: "Apartamento próximo à USP",
    description: "Apartamento de 2 quartos, mobiliado, a 5 minutos da USP",
    price: 1200,
    location: "Butantã, São Paulo - SP",
    university: "USP",
    status: "active",
    views: 45,
    inquiries: 5,
    createdAt: "10/04/2023",
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: "2",
    title: "Kitnet moderna perto da UFMG",
    description: "Kitnet reformada com ótima localização, próxima ao campus Pampulha",
    price: 800,
    location: "Pampulha, Belo Horizonte - MG",
    university: "UFMG",
    status: "active",
    views: 32,
    inquiries: 3,
    createdAt: "15/04/2023",
    image: "/placeholder.svg?height=300&width=500",
  },
  {
    id: "3",
    title: "Quarto em república próximo à UFPE",
    description: "Quarto individual em república estabelecida, ambiente amigável",
    price: 600,
    location: "Cidade Universitária, Recife - PE",
    university: "UFPE",
    status: "inactive",
    views: 12,
    inquiries: 0,
    createdAt: "20/03/2023",
    image: "/placeholder.svg?height=300&width=500",
  },
]

// Dados simulados de agendamentos
const appointments = [
  {
    id: "101",
    propertyId: "1",
    propertyTitle: "Apartamento próximo à USP",
    studentName: "Ana Silva",
    date: "15/05/2023",
    time: "14:00",
    status: "confirmed",
  },
  {
    id: "102",
    propertyId: "1",
    propertyTitle: "Apartamento próximo à USP",
    studentName: "Pedro Santos",
    date: "16/05/2023",
    time: "10:30",
    status: "pending",
  },
  {
    id: "103",
    propertyId: "2",
    propertyTitle: "Kitnet moderna perto da UFMG",
    studentName: "Mariana Costa",
    date: "18/05/2023",
    time: "16:00",
    status: "confirmed",
  },
]

export default function MyListingsPage() {
  const [activeListings, setActiveListings] = useState(myListings.filter((listing) => listing.status === "active"))
  const [inactiveListings, setInactiveListings] = useState(
    myListings.filter((listing) => listing.status === "inactive"),
  )

  const toggleListingStatus = (id: string, currentStatus: string) => {
    if (currentStatus === "active") {
      const listing = activeListings.find((l) => l.id === id)
      if (listing) {
        listing.status = "inactive"
        setActiveListings(activeListings.filter((l) => l.id !== id))
        setInactiveListings([...inactiveListings, listing])
      }
    } else {
      const listing = inactiveListings.find((l) => l.id === id)
      if (listing) {
        listing.status = "active"
        setInactiveListings(inactiveListings.filter((l) => l.id !== id))
        setActiveListings([...activeListings, listing])
      }
    }
  }

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Meus anúncios</h1>
          <p className="text-muted-foreground">Gerencie seus imóveis anunciados</p>
        </div>
        <Link href="/create-listing">
          <Button className="flex items-center gap-2">
            <PlusCircle size={18} />
            Novo anúncio
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="listings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="listings">Anúncios</TabsTrigger>
          <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
          <TabsTrigger value="messages">Mensagens</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Anúncios ativos ({activeListings.length})</h2>
            {activeListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeListings.map((listing) => (
                  <Card key={listing.id}>
                    <div className="aspect-video relative">
                      <Image
                        src={listing.image || "/placeholder.svg"}
                        alt={listing.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                      <Badge className="absolute top-2 right-2 bg-green-500">Ativo</Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{listing.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-muted-foreground line-clamp-2">{listing.description}</p>
                      <div className="flex justify-between">
                        <span className="font-medium">R$ {listing.price}/mês</span>
                        <span className="text-muted-foreground">{listing.university}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <Eye size={16} className="text-muted-foreground" />
                          <span>{listing.views} visualizações</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare size={16} className="text-muted-foreground" />
                          <span>{listing.inquiries} contatos</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                      <div className="grid grid-cols-2 gap-2 w-full">
                        <Link href={`/listing/${listing.id}`}>
                          <Button variant="outline" className="w-full">
                            Ver
                          </Button>
                        </Link>
                        <Link href={`/edit-listing/${listing.id}`}>
                          <Button variant="outline" className="w-full">
                            Editar
                          </Button>
                        </Link>
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full text-muted-foreground"
                        onClick={() => toggleListingStatus(listing.id, "active")}
                      >
                        <EyeOff size={16} className="mr-2" />
                        Desativar
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground mb-4">Você não possui anúncios ativos no momento</p>
                  <Link href="/create-listing">
                    <Button>Criar anúncio</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {inactiveListings.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Anúncios inativos ({inactiveListings.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inactiveListings.map((listing) => (
                  <Card key={listing.id}>
                    <div className="aspect-video relative">
                      <Image
                        src={listing.image || "/placeholder.svg"}
                        alt={listing.title}
                        fill
                        className="object-cover rounded-t-lg opacity-70"
                      />
                      <Badge className="absolute top-2 right-2 bg-gray-500">Inativo</Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{listing.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-muted-foreground line-clamp-2">{listing.description}</p>
                      <div className="flex justify-between">
                        <span className="font-medium">R$ {listing.price}/mês</span>
                        <span className="text-muted-foreground">{listing.university}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                      <div className="grid grid-cols-2 gap-2 w-full">
                        <Link href={`/listing/${listing.id}`}>
                          <Button variant="outline" className="w-full">
                            Ver
                          </Button>
                        </Link>
                        <Link href={`/edit-listing/${listing.id}`}>
                          <Button variant="outline" className="w-full">
                            Editar
                          </Button>
                        </Link>
                      </div>
                      <Button
                        variant="default"
                        className="w-full"
                        onClick={() => toggleListingStatus(listing.id, "inactive")}
                      >
                        <Eye size={16} className="mr-2" />
                        Ativar
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="appointments">
          <h2 className="text-xl font-semibold mb-4">Agendamentos de visitas</h2>
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="font-medium">{appointment.propertyTitle}</h3>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar size={16} className="text-muted-foreground" />
                          <span>
                            {appointment.date} às {appointment.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">Estudante:</span>
                          <Link href={`/user/student-id`} className="text-primary hover:underline">
                            {appointment.studentName}
                          </Link>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {appointment.status === "confirmed" ? (
                          <Badge className="bg-green-500">Confirmado</Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-500 border-amber-500">
                            Pendente
                          </Badge>
                        )}

                        <div className="flex gap-2">
                          {appointment.status === "pending" && <Button size="sm">Confirmar</Button>}
                          <Button variant="outline" size="sm">
                            <MessageSquare size={16} className="mr-2" />
                            Mensagem
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Você não possui agendamentos de visitas no momento</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="messages">
          <h2 className="text-xl font-semibold mb-4">Mensagens</h2>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Você não possui mensagens não lidas no momento</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
