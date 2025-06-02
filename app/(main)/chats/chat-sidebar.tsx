"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Contact } from "./types"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

// Dados de exemplo
const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Ana Silva",
    avatar: "/images/user-profile.png",
    lastMessage: "Olá, gostaria de saber mais sobre o apartamento",
    lastMessageTime: "10:30",
    unreadCount: 2,
    online: true,
  },
  {
    id: "2",
    name: "Carlos Oliveira",
    avatar: "/images/user-profile.png",
    lastMessage: "O imóvel ainda está disponível?",
    lastMessageTime: "Ontem",
    unreadCount: 0,
    online: false,
  },
  {
    id: "3",
    name: "Mariana Costa",
    avatar: "/images/user-profile.png",
    lastMessage: "Podemos agendar uma visita para amanhã?",
    lastMessageTime: "Seg",
    unreadCount: 1,
    online: true,
  },
  {
    id: "4",
    name: "Pedro Santos",
    avatar: "/images/user-profile.png",
    lastMessage: "Obrigado pelas informações!",
    lastMessageTime: "Dom",
    unreadCount: 0,
    online: false,
  },
  {
    id: "5",
    name: "Juliana Mendes",
    avatar: "/images/user-profile.png",
    lastMessage: "Qual o valor do condomínio?",
    lastMessageTime: "Sex",
    unreadCount: 0,
    online: true,
  },
]

interface ChatSidebarProps {
  activeContact: Contact | null
  setActiveContact: (contact: Contact) => void
  isMobileSidebarOpen: boolean
  setIsMobileSidebarOpen: (isOpen: boolean) => void
}

export function ChatSidebar({
  activeContact,
  setActiveContact,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const isMobile = useMobile()

  const filteredContacts = mockContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div
      className={cn(
        "w-full md:w-80 border-r bg-background flex flex-col h-full",
        isMobile && "fixed inset-0 z-40",
        isMobile && !isMobileSidebarOpen && "hidden",
      )}
    >
      {/* Cabeçalho da barra lateral */}
      <div className="p-4 border-b flex items-center justify-between">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
          Conversas
        </h2>
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={() => setIsMobileSidebarOpen(false)} className="rounded-xl">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      {/* Barra de pesquisa */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar conversa..."
            className="pl-10 h-12 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de contatos */}
      <div className="flex-1 overflow-auto">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={cn(
                "flex items-center gap-4 p-4 cursor-pointer hover:bg-accent/50 transition-colors",
                activeContact?.id === contact.id && "bg-accent",
              )}
              onClick={() => {
                setActiveContact(contact)
                if (isMobile) {
                  setIsMobileSidebarOpen(false)
                }
              }}
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                  <AvatarFallback>{contact.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                {contact.online && (
                  <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium truncate">{contact.name}</h3>
                  <span className="text-xs text-muted-foreground">{contact.lastMessageTime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-muted-foreground truncate">{contact.lastMessage}</p>
                  {contact.unreadCount > 0 && (
                    <span className="ml-2 flex-shrink-0 h-5 w-5 bg-blue-500 text-white rounded-full text-xs flex items-center justify-center">
                      {contact.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-muted-foreground">Nenhuma conversa encontrada</div>
        )}
      </div>
    </div>
  )
}
