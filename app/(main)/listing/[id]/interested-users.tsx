"use client"

import { useState, useEffect, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageSquare, Search, Users, ChevronDown, ChevronUp, X } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { UserInterestResponse, enumsService } from "@/lib/services/enums.service"
import { UserInfo } from "@/lib/services/types"
import { mockedUsers } from "./mocked-users"


export default function InterestedUsers({ interestedUsers }: { interestedUsers: UserInfo[] }) {
  // Add explicit types for state variables
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [usingMockData, setUsingMockData] = useState(interestedUsers.length === 0)
  const [availableTags, setAvailableTags] = useState<UserInterestResponse[]>([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isTagsMenuOpen, setIsTagsMenuOpen] = useState(false)

  // Carrega as tags disponíveis
  useEffect(() => {
    const loadTags = async () => {
      setIsLoading(true)
      try {
        const tags = await enumsService.getUserInterests()
        setAvailableTags(tags)
      } catch (error) {
        console.error("Erro ao carregar tags:", error)
        // Opcional: setErrorState(true)
      } finally {
        setIsLoading(false)
      }
    }
    loadTags()
  }, [])

  // Simular carregamento ao montar o componente
  useEffect(() => {
  setIsLoading(true)
  const timer = setTimeout(() => {
    setIsLoading(false)
    setUsingMockData(interestedUsers.length === 0)
  }, 1500)
  return () => clearTimeout(timer)
}, [interestedUsers])

  // Filtra usuários quando a busca ou tags mudam
  const filteredUsers = useMemo(() => {
  let filtered = usingMockData ? mockedUsers : interestedUsers
  
  if (searchQuery.trim() !== "") {
    filtered = filtered.filter(
      (user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.curso?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.universidade?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }
  
  if (selectedTags.length > 0) {
    filtered = filtered.filter(user => 
      selectedTags.every(tag => 
        user.interesses?.includes(tag)
      )
    )
  }
  
  return filtered
}, [searchQuery, selectedTags, interestedUsers, usingMockData])

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  const clearTags = () => {
    setSelectedTags([])
  }

  if (isLoading) {
    return (
      <div className="h-[400px] flex flex-col">
        <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
          <Users size={20} className="text-primary" />
          Usuários interessados
        </h3>
        {usingMockData && (
          <p className="text-xs text-yellow-600 mb-2">
            Modo de demonstração: utilizando dados mockados
          </p>
        )}
        <div className="mb-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar usuários..." 
              className="pl-9" 
              disabled 
              value=""
            />
          </div>
        </div>
        <div className="space-y-3 flex-1">
          {Array(8).fill(0).map((_, i) => (
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
    <div className="flex flex-col h-auto max-h-[500px] border rounded-lg p-3 bg-card">
      <h3 className="text-md font-medium mb-2 flex items-center gap-2">
        <Users size={20} className="text-primary" />
        Usuários interessados
      </h3>

      {/* Filtro por tags */}
      <div className="mb-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-sm flex items-center gap-1"
              onClick={() => setIsTagsMenuOpen(!isTagsMenuOpen)}
            >
              Filtrar por interesses
              {isTagsMenuOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
            
            {selectedTags.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs flex items-center gap-1 text-muted-foreground"
                onClick={clearTags}
              >
                <X size={14} />
                Limpar filtros
              </Button>
            )}
          </div>

          {isTagsMenuOpen && (
            <div className="p-2 border rounded-lg bg-muted/50">
              <div className="flex flex-wrap gap-2">
                {availableTags.map(tag => (
                  <Badge
                    key={tag.value}
                    variant={selectedTags.includes(tag.value) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-secondary/80 transition-colors"
                    onClick={() => toggleTag(tag.value)}
                  >
                    {tag.description}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Mostrar tags selecionadas */}
          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {selectedTags.map(tag => {
                const tagInfo = availableTags.find(t => t.value === tag)
                return (
                  <Badge
                    key={tag}
                    variant="default"
                    className="flex items-center gap-1"
                  >
                    {tagInfo?.description || tag}
                    <X
                      size={12}
                      className="cursor-pointer hover:opacity-80"
                      onClick={() => toggleTag(tag)}
                    />
                  </Badge>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Campo de busca */}
      <div className="mb-2">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar usuários por nome, curso ou universidade..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de usuários */}
      <div className="overflow-y-auto pr-2" style={{ maxHeight: "300px" }}>
        {filteredUsers.length > 0 ? (
          <div className="space-y-2">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between group py-2">
                <Link href={`/user/${user.id}`} className="flex items-center gap-3 flex-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium group-hover:text-primary transition-colors">
                      {user.name} {user.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.universidade} • {user.curso}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {user.interesses?.slice(0, 3).map(interest => {
                        const tag = availableTags.find(t => t.value === interest)
                        return tag ? (
                          <Badge key={tag.value} variant="outline" className="text-xs h-5">
                            {tag.description}
                          </Badge>
                        ) : null
                      })}
                      {user.interesses && user.interesses.length > 3 && (
                        <Badge variant="outline" className="text-xs h-5">
                          +{user.interesses.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Link
                        href={`/chats?user=${user.id}`}
                        className="p-2 rounded-full hover:bg-muted transition-colors"
                        aria-label={`Enviar mensagem para ${user.name}`}
                      >
                        <MessageSquare size={16} />
                      </Link>
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
          <p className="text-center text-muted-foreground py-4">
            {searchQuery || selectedTags.length > 0 
              ? "Nenhum usuário encontrado com esses critérios" 
              : "Nenhum usuário interessado"}
          </p>
        )}
      </div>
    </div>
  )
}