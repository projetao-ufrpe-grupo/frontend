"use client"

import type React from "react"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Menu, Send } from "lucide-react"
import type { Contact, Message } from "./types"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

// Dados de exemplo
const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "m1",
      senderId: "1",
      text: "Olá, gostaria de saber mais sobre o apartamento que você anunciou",
      timestamp: "10:25",
      read: true,
      isMe: false,
    },
    {
      id: "m2",
      senderId: "user",
      text: "Olá Ana! Claro, o apartamento tem 2 quartos, 1 banheiro, cozinha americana e sala de estar. Fica a 10 minutos da estação de metrô.",
      timestamp: "10:27",
      read: true,
      isMe: true,
    },
    {
      id: "m3",
      senderId: "1",
      text: "Parece ótimo! Qual o valor do aluguel e do condomínio?",
      timestamp: "10:28",
      read: true,
      isMe: false,
    },
    {
      id: "m4",
      senderId: "user",
      text: "O aluguel é R$ 1.800 e o condomínio R$ 400, que inclui água e gás.",
      timestamp: "10:29",
      read: true,
      isMe: true,
    },
    {
      id: "m5",
      senderId: "1",
      text: "Perfeito! Podemos agendar uma visita?",
      timestamp: "10:30",
      read: false,
      isMe: false,
    },
  ],
  "2": [
    {
      id: "m1",
      senderId: "2",
      text: "O imóvel ainda está disponível?",
      timestamp: "Ontem",
      read: true,
      isMe: false,
    },
  ],
  "3": [
    {
      id: "m1",
      senderId: "3",
      text: "Olá, vi seu anúncio e me interessei pelo apartamento",
      timestamp: "Seg",
      read: true,
      isMe: false,
    },
    {
      id: "m2",
      senderId: "user",
      text: "Olá Mariana! O apartamento ainda está disponível. Gostaria de mais informações?",
      timestamp: "Seg",
      read: true,
      isMe: true,
    },
    {
      id: "m3",
      senderId: "3",
      text: "Sim, podemos agendar uma visita para amanhã?",
      timestamp: "Seg",
      read: false,
      isMe: false,
    },
  ],
  "4": [
    {
      id: "m1",
      senderId: "user",
      text: "Olá Pedro, segue as informações que você pediu sobre o apartamento.",
      timestamp: "Dom",
      read: true,
      isMe: true,
    },
    {
      id: "m2",
      senderId: "4",
      text: "Obrigado pelas informações!",
      timestamp: "Dom",
      read: true,
      isMe: false,
    },
  ],
  "5": [
    {
      id: "m1",
      senderId: "5",
      text: "Olá, gostaria de saber mais sobre o apartamento",
      timestamp: "Sex",
      read: true,
      isMe: false,
    },
    {
      id: "m2",
      senderId: "user",
      text: "Olá Juliana! O que gostaria de saber?",
      timestamp: "Sex",
      read: true,
      isMe: true,
    },
    {
      id: "m3",
      senderId: "5",
      text: "Qual o valor do condomínio?",
      timestamp: "Sex",
      read: true,
      isMe: false,
    },
  ],
}

interface ChatAreaProps {
  activeContact: Contact | null
  setIsMobileSidebarOpen: (isOpen: boolean) => void
}

export function ChatArea({ activeContact, setIsMobileSidebarOpen }: ChatAreaProps) {
  const [newMessage, setNewMessage] = useState("")
  const isMobile = useMobile()

  const messages = activeContact ? mockMessages[activeContact.id] || [] : []

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeContact) return

    // Em uma aplicação real, aqui você enviaria a mensagem para o backend
    console.log(`Enviando mensagem para ${activeContact.name}: ${newMessage}`)

    // Limpa o campo de mensagem
    setNewMessage("")
  }

  if (!activeContact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-accent/20">
        <div className="text-center p-8">
          <h3 className="text-2xl font-semibold mb-2">Bem-vindo ao Chat</h3>
          <p className="text-muted-foreground">Selecione uma conversa para começar a enviar mensagens</p>
          {isMobile && (
            <Button className="mt-4" onClick={() => setIsMobileSidebarOpen(true)}>
              Ver conversas
            </Button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Cabeçalho do chat */}
      <div className="p-3 border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setIsMobileSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Avatar>
            <AvatarImage src={activeContact.avatar || "/placeholder.svg"} alt={activeContact.name} />
            <AvatarFallback>{activeContact.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium">{activeContact.name}</h3>
            <p className="text-xs text-muted-foreground">{activeContact.online ? "Online" : "Offline"}</p>
          </div>
        </div>
      </div>

      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-accent/10">
        {messages.map((message) => (
          <div key={message.id} className={cn("flex", message.isMe ? "justify-end" : "justify-start")}>
            <div
              className={cn(
                "max-w-[80%] md:max-w-[70%] rounded-lg p-3",
                message.isMe
                  ? "bg-primary text-primary-foreground rounded-br-none"
                  : "bg-background border rounded-bl-none",
              )}
            >
              <p>{message.text}</p>
              <div className={cn("text-xs mt-1 flex items-center", message.isMe ? "justify-end" : "justify-start")}>
                {message.timestamp}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Área de input */}
      <div className="p-3 border-t">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Digite uma mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={!newMessage.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
