"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMobile } from "@/hooks/use-mobile"
import { authService } from "@/lib/services/auth.service"
import { chatService, type ChatMessage } from "@/lib/services/chat.service"
import { cn } from "@/lib/utils"
import { Loader2, Search, User, X } from "lucide-react"
import { useEffect, useState } from "react"
import type { Contact } from "./types"

interface ChatSidebarProps {
  activeContact: Contact | null
  setActiveContact: (contact: Contact) => void
  isMobileSidebarOpen: boolean
  setIsMobileSidebarOpen: (isOpen: boolean) => void
  selectedUserId?: string
}

export function ChatSidebar({
  activeContact,
  setActiveContact,
  isMobileSidebarOpen,
  setIsMobileSidebarOpen,
  selectedUserId,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const isMobile = useMobile()

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      if (!isMounted) return

      try {
        setLoading(true)
        const userInfo = authService.getUserInfo()
        if (!userInfo || !isMounted) return

        const conversations = await chatService.getConversations()
        const contactsList: Contact[] = conversations.map((conv: any) => {
          const otherParticipant = conv.participantes.find((p: any) => p.id !== userInfo.id);
          return {
            id: otherParticipant.id,
            name: otherParticipant.nome,
            avatar: otherParticipant.fotoPerfil, // Assuming fotoPerfil exists on participant
            lastMessage: conv.ultimasMensagens.length > 0 ? conv.ultimasMensagens[0].content : "Nenhuma mensagem",
            lastMessageTime: conv.ultimasMensagens.length > 0 ? chatService.formatMessageTime(conv.ultimasMensagens[0].date) : "",
            unreadCount: 0, // This will need to be handled by the backend or a separate mechanism
            online: false, // This will need to be handled by a separate mechanism
          };
        });

        if (isMounted) {
          setContacts(contactsList)
        }
      } catch (error) {
        console.error("Error loading conversations:", error)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadData()

    // Conectar ao WebSocket para receber mensagens em tempo real
    const handleNewMessage = (message: ChatMessage) => {
      if (isMounted) {
        updateContactWithNewMessage(message)
      }
    }

    chatService.addMessageHandler(handleNewMessage)

    return () => {
      isMounted = false
      chatService.removeMessageHandler(handleNewMessage)
    }
  }, [])

  useEffect(() => {
    const createTemporaryContact = async (userId: string) => {
      try {
        const existingContact = contacts.find((c) => c.id === userId)
        if (existingContact) {
          setActiveContact(existingContact)
          return
        }

        const userInfo = await authService.getUserById(userId)
        const newContact: Contact = {
          id: userId,
          name: `${userInfo.name}`,
          avatar: userInfo.fotoPerfil,
          lastMessage: "Iniciar conversa",
          lastMessageTime: "Agora",
          unreadCount: 0,
          online: false,
        }

        setContacts((prev) => {
          const stillExists = prev.find((c) => c.id === userId)
          if (stillExists) {
            return prev
          }
          return [...prev, newContact]
        })
        setActiveContact(newContact)
      } catch (error) {
        console.error("Error creating temporary contact:", error)
      }
    }

    if (selectedUserId) {
      const existingContact = contacts.find((c) => c.id === selectedUserId)
      if (existingContact) {
        setActiveContact(existingContact)
      } else {
        if (!loading) {
          createTemporaryContact(selectedUserId)
        }
      }
    }
  }, [selectedUserId, contacts, loading, setActiveContact, setContacts])

  const updateContactWithNewMessage = (message: ChatMessage) => {
    setContacts((prev) => {
      const updatedContacts = [...prev]
      const currentUser = authService.getUserInfo()

      if (!currentUser) return prev

      const isIncoming = message.fromUserId !== currentUser.id
      const contactId = isIncoming ? message.fromUserId : message.toUserId
      const contactName = isIncoming ? message.fromUserName : message.toUserName

      const existingContactIndex = updatedContacts.findIndex((c) => c.id === contactId)

      if (existingContactIndex >= 0) {
        // Atualizar contato existente
        updatedContacts[existingContactIndex] = {
          ...updatedContacts[existingContactIndex],
          lastMessage: message.content,
          lastMessageTime: chatService.formatMessageTime(message.date),
          unreadCount:
            isIncoming && activeContact?.id !== contactId
              ? updatedContacts[existingContactIndex].unreadCount + 1
              : updatedContacts[existingContactIndex].unreadCount,
        }

        // Mover para o topo apenas se não estiver já no topo
        if (existingContactIndex !== 0) {
          const contact = updatedContacts.splice(existingContactIndex, 1)[0]
          updatedContacts.unshift(contact)
        }
      } else {
        // Criar novo contato apenas se não existir
        const newContact: Contact = {
          id: contactId,
          name: contactName,
          avatar: isIncoming ? message.fromUserAvatar : message.toUserAvatar,
          lastMessage: message.content,
          lastMessageTime: chatService.formatMessageTime(message.date),
          unreadCount: isIncoming ? 1 : 0,
          online: false,
        }
        updatedContacts.unshift(newContact)
      }

      return updatedContacts
    })
  }

  const filteredContacts = contacts.filter((contact) => contact.name?.toLowerCase().includes(searchQuery?.toLowerCase()))

  if (loading) {
    return (
      <div
        className={cn(
          "w-full md:w-80 border-r bg-background flex flex-col h-full",
          isMobile && "fixed inset-0 z-40",
          isMobile && !isMobileSidebarOpen && "hidden",
        )}
      >
        <div className="p-4 border-b flex items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </div>
    )
  }

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
        <div className="flex items-center gap-2">
          <User className="h-8 w-8 text-blue-500" />
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
            Conversas
          </h2>
        </div>
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
                // Zerar contador de não lidas quando selecionar o contato
                setContacts((prev) => prev.map((c) => (c.id === contact.id ? { ...c, unreadCount: 0 } : c)))
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
          <div className="p-4 text-center text-muted-foreground">
            {searchQuery ? "Nenhuma conversa encontrada" : "Nenhuma conversa ainda"}
          </div>
        )}
      </div>
    </div>
  )
}
