"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Search, Users } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"

// Dados simulados de usuários interessados (lista expandida)
const interestedUsers = [
  {
    id: "1",
    name: "Ana Silva",
    university: "USP",
    course: "Medicina",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "2",
    name: "Pedro Oliveira",
    university: "UNICAMP",
    course: "Engenharia Civil",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "3",
    name: "Mariana Costa",
    university: "UFRJ",
    course: "Arquitetura",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "4",
    name: "Lucas Santos",
    university: "UFMG",
    course: "Direito",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "5",
    name: "Juliana Pereira",
    university: "PUC",
    course: "Psicologia",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "6",
    name: "Rafael Mendes",
    university: "UnB",
    course: "Ciência da Computação",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "7",
    name: "Camila Rocha",
    university: "UFPE",
    course: "Administração",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "8",
    name: "Bruno Ferreira",
    university: "UFSC",
    course: "Engenharia Mecânica",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "9",
    name: "Larissa Martins",
    university: "UNESP",
    course: "Veterinária",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "10",
    name: "Gabriel Lima",
    university: "UFPR",
    course: "Economia",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "11",
    name: "Fernanda Souza",
    university: "UFBA",
    course: "Jornalismo",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "12",
    name: "Thiago Alves",
    university: "UFC",
    course: "Fisioterapia",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "13",
    name: "Isabella Cardoso",
    university: "UFES",
    course: "Design Gráfico",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "14",
    name: "Mateus Ribeiro",
    university: "UFRGS",
    course: "Educação Física",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "15",
    name: "Beatriz Gomes",
    university: "UFMT",
    course: "Nutrição",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "16",
    name: "Diego Nascimento",
    university: "UFPA",
    course: "Engenharia Elétrica",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "17",
    name: "Sophia Barbosa",
    university: "UFGO",
    course: "Farmácia",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "18",
    name: "Henrique Castro",
    university: "UFAL",
    course: "História",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "19",
    name: "Letícia Dias",
    university: "UFMA",
    course: "Enfermagem",
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: "20",
    name: "Arthur Moreira",
    university: "UFPI",
    course: "Matemática",
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

export default function InterestedUsers() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Simular carregamento ao montar o componente
  useState(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)
    return () => clearTimeout(timer)
  })

  const filteredUsers = interestedUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.university.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (isLoading) {
    return (
      <div className="h-[400px] flex flex-col">
        <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
          <Users size={20} className="text-primary" />
          Usuários interessados
        </h3>
        <div className="mb-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar usuários..." className="pl-9" disabled />
          </div>
        </div>
        <div className="space-y-3 flex-1">
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="skeleton h-10 w-10 rounded-full" />
                  <div>
                    <div className="skeleton h-5 w-32 mb-1" />
                    <div className="skeleton h-4 w-24" />
                  </div>
                </div>
                <div className="skeleton h-8 w-8" />
              </div>
            ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-auto max-h-[350px] border rounded-lg p-3 bg-card">
      <h3 className="text-md font-medium mb-2 flex items-center gap-2">
        <Users size={20} className="text-primary" />
        Usuários interessados
      </h3>
      <div className="mb-2">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuários..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <div className="overflow-y-auto pr-2 mt-2" style={{ maxHeight: "220px" }}>
        {filteredUsers.length > 0 ? (
          <div className="space-y-2">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between group">
                <Link href={`/user/${user.id}`} className="flex items-center gap-3 flex-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium group-hover:text-primary transition-colors">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.university} • {user.course}
                    </p>
                  </div>
                </Link>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        className="p-2 rounded-full hover:bg-muted transition-colors"
                        onClick={() => {
                          window.location.href = `/chats?user=${user.id}`
                        }}
                      >
                        <MessageSquare size={16} />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enviar mensagem para {user.name}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-4">Nenhum usuário encontrado</p>
        )}
      </div>
    </div>
  )
}
