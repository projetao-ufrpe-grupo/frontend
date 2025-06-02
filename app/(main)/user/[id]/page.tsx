"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Building2, Check, Clock, Mail, MapPin, MessageSquare, School, UserPlus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

// Dados simulados do usuário
const userData = {
  id: "123",
  name: "João Santos",
  email: "joao.santos@email.com",
  bio: "Estudante de Ciência da Computação na UFMG, apaixonado por tecnologia e música. Procurando um lugar tranquilo para morar e estudar.",
  avatar: "/placeholder.svg?height=200&width=200",
  university: "UFMG",
  course: "Ciência da Computação",
  semester: "7º",
  location: "Belo Horizonte, MG",
  targetLocation: "Pampulha, Belo Horizonte - MG",
  interests: ["Tecnologia", "Música", "Esportes", "Jogos", "Cinema"],
  friendStatus: "none", // 'none', 'pending', 'friends'
  properties: [
    {
      id: "1",
      title: "Kitnet moderna perto da UFMG",
      price: 800,
      location: "Pampulha, Belo Horizonte - MG",
      image: "/placeholder.svg?height=300&width=500",
    },
  ],
}

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const [user, setUser] = useState(userData)

  const handleFriendRequest = () => {
    setUser({
      ...user,
      friendStatus: user.friendStatus === "none" ? "pending" : "none",
    })
  }

  const getFriendButton = () => {
    switch (user.friendStatus) {
      case "none":
        return (
          <Button onClick={handleFriendRequest} className="flex items-center gap-2">
            <UserPlus size={18} />
            Conectar
          </Button>
        )
      case "pending":
        return (
          <Button variant="outline" disabled className="flex items-center gap-2">
            <Clock size={18} />
            Solicitação enviada
          </Button>
        )
      case "friends":
        return (
          <Button variant="outline" className="flex items-center gap-2">
            <Check size={18} />
            Conectado
          </Button>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section com padrão hexagonal */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
        {/* Padrão hexagonal de fundo */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Hexágonos decorativos */}
        <div className="absolute inset-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute opacity-10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            >
              <div className="w-16 h-16 bg-white/20 transform rotate-45" />
            </div>
          ))}
        </div>

        {/* Conteúdo do perfil */}
        <div className="relative z-10 container py-16 text-center text-white">
          <Avatar className="h-32 w-32 mx-auto mb-6 ring-4 ring-green-400 ring-offset-4 ring-offset-transparent">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="text-2xl bg-white text-blue-600">{user.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <h1 className="text-4xl font-bold mb-2">{user.name}</h1>

          {/* Informações principais */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-blue-100 mb-8">
            <div className="flex items-center gap-2">
              <Building2 size={18} />
              <span>{user.university}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <span>{user.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={18} />
              <span>{user.email}</span>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex justify-center gap-4">
            {getFriendButton()}
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => {
                window.location.href = `/chats?user=${user.id}`
              }}
            >
              <MessageSquare size={18} />
              Mensagem
            </Button>
          </div>
        </div>
      </div>

      {/* Conteúdo das abas */}
      <div className="container py-8">
        <Tabs defaultValue="about">
          <TabsList className="mb-6">
            <TabsTrigger value="about">Sobre</TabsTrigger>
            <TabsTrigger value="interests">Interesses</TabsTrigger>
            <TabsTrigger value="listings">Anúncios</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>Sobre {user.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-muted-foreground">{user.bio}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Informações acadêmicas</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50">
                      <School className="text-primary" size={20} />
                      <div>
                        <p className="font-medium">Universidade</p>
                        <p className="text-muted-foreground">{user.university}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50">
                      <BookOpen className="text-primary" size={20} />
                      <div>
                        <p className="font-medium">Curso</p>
                        <p className="text-muted-foreground">{user.course}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50">
                      <BookOpen className="text-primary" size={20} />
                      <div>
                        <p className="font-medium">Semestre</p>
                        <p className="text-muted-foreground">{user.semester}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50">
                      <MapPin className="text-primary" size={20} />
                      <div>
                        <p className="font-medium">Região de interesse</p>
                        <p className="text-muted-foreground">{user.targetLocation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interests">
            <Card>
              <CardHeader>
                <CardTitle>Interesses e Hobbies</CardTitle>
                <CardDescription>Interesses em comum podem ser o início de uma boa amizade</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {user.interests.map((interest, index) => (
                    <Badge key={index} variant="secondary" className="p-3 text-sm">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings">
            <Card>
              <CardHeader>
                <CardTitle>Anúncios de {user.name.split(" ")[0]}</CardTitle>
              </CardHeader>
              <CardContent>
                {user.properties.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {user.properties.map((property) => (
                      <Card key={property.id} className="overflow-hidden">
                        <div className="aspect-video relative">
                          <Image
                            src={property.image || "/placeholder.svg"}
                            alt={property.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{property.title}</h3>
                          <div className="flex justify-between items-center mb-4">
                            <span className="text-primary font-medium text-lg">R$ {property.price}/mês</span>
                            <span className="text-sm text-muted-foreground">{property.location}</span>
                          </div>
                          <Link href={`/listing/${property.id}`}>
                            <Button variant="outline" className="w-full">
                              Ver detalhes
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    {user.name.split(" ")[0]} não possui anúncios no momento.
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
