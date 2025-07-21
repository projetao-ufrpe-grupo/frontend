"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMobile } from "@/hooks/use-mobile"
import { authService } from "@/lib/services/auth.service"
import { chatService, type ChatMessage } from "@/lib/services/chat.service"
import { cn } from "@/lib/utils"
import { Loader2, Menu, Send } from "lucide-react"
import type React from "react"
import { useEffect, useRef, useState } from "react"
import type { Contact, Message } from "./types"

interface ChatAreaProps {
  activeContact: Contact | null
  setIsMobileSidebarOpen: (isOpen: boolean) => void
}

export function ChatArea({ activeContact, setIsMobileSidebarOpen }: ChatAreaProps) {
  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [connected, setConnected] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isMobile = useMobile()

  useEffect(() => {
    if (activeContact) {
      loadMessages()
    }
  }, [activeContact])

  useEffect(() => {
    if (!connected) {
      connectWebSocket()
    }
    return () => {
      // Não desconectar aqui pois outros componentes podem estar usando
    }
  }, [connected])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const connectWebSocket = () => {
    try {
      chatService.connectWebSocket((message: ChatMessage) => {
        handleNewMessage(message)
      })
      setConnected(true)
    } catch (error) {
      console.error("Error connecting to WebSocket:", error)
    }
  }

  const loadMessages = async () => {
    if (!activeContact) return

    try {
      setLoading(true)
      const currentUser = authService.getUserInfo()
      if (!currentUser) return

      const conversation = await chatService.getConversation(currentUser.id, activeContact.id, 0, 50)

      const formattedMessages: Message[] = conversation.content
        .map((msg) => ({
          id: msg.id.toString(),
          senderId: msg.fromUserId,
          text: msg.content,
          timestamp: chatService.formatMessageTime(msg.date),
          read: true,
          isMe: msg.fromUserId === currentUser.id,
          dateTime: new Date(msg.date), // Adicionar data para ordenação
        }))
        // Ordenar por data - mensagens mais antigas primeiro, mais recentes por último
        .sort((a, b) => a.dateTime.getTime() - b.dateTime.getTime())

      setMessages(formattedMessages)
    } catch (error) {
      console.error("Error loading messages:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleNewMessage = (message: ChatMessage) => {
    const currentUser = authService.getUserInfo()
    if (!currentUser || !activeContact) return

    // Verificar se a mensagem é para a conversa ativa
    const isForActiveChat =
      (message.fromUserId === activeContact.id && message.toUserId === currentUser.id) ||
      (message.fromUserId === currentUser.id && message.toUserId === activeContact.id)

    if (isForActiveChat) {
      const newMsg: Message = {
        id: message.id.toString(),
        senderId: message.fromUserId,
        text: message.content,
        timestamp: chatService.formatMessageTime(message.date),
        read: true,
        isMe: message.fromUserId === currentUser.id,
        dateTime: new Date(message.date),
      }

      // Adicionar mensagem diretamente à lista, evitando duplicatas
      setMessages((prev) => {
        // Verificar se a mensagem já existe
        const messageExists = prev.some((msg) => msg.id === newMsg.id)
        if (messageExists) {
          return prev
        }
        // Adicionar no final da lista (mensagens mais recentes embaixo)
        return [...prev, newMsg]
      })
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeContact || sending) return

    const messageToSend = newMessage.trim()
    const currentUser = authService.getUserInfo()
    if (!currentUser) return

    try {
      setSending(true)

      // Criar mensagem temporária para feedback imediato
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        senderId: currentUser.id,
        text: messageToSend,
        timestamp: "Enviando...",
        read: false,
        isMe: true,
        dateTime: new Date(), // Data atual para ordenação
      }

      // Adicionar mensagem temporária no final da lista
      setMessages((prev) => [...prev, tempMessage])

      // Limpar o campo imediatamente
      setNewMessage("")

      // Enviar mensagem
      chatService.sendMessage(activeContact.id, messageToSend)

      // Aguardar um pouco e recarregar para pegar a mensagem real do servidor
      setTimeout(async () => {
        // Remover mensagem temporária e recarregar
        setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id))
        await loadMessages()
      }, 1500)
    } catch (error) {
      console.error("Error sending message:", error)
      // Remover mensagem temporária em caso de erro
      const tempMessage: Message = {
        id: `temp-${Date.now()}`,
        senderId: currentUser.id,
        text: messageToSend,
        timestamp: "Enviando...",
        read: false,
        isMe: true,
        dateTime: new Date(), // Data atual para ordenação
      }
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessage.id))
      // Restaurar mensagem no campo
      setNewMessage(messageToSend)
    } finally {
      setSending(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  if (!activeContact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-accent/20">
        <div className="text-center p-8">
          <h3 className="text-2xl font-semibold mb-2">Suas Conversas</h3>
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
            <p className="text-xs text-muted-foreground">
              {connected ? (activeContact.online ? "Online" : "Offline") : "Conectando..."}
            </p>
          </div>
        </div>
      </div>

      {/* Área de mensagens */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-accent/10">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div key={message.id} className={cn("flex", message.isMe ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[80%] md:max-w-[70%] rounded-lg p-3 relative",
                    message.isMe
                      ? "bg-blue-500 text-white rounded-br-none dark:bg-blue-500 dark:text-white"
                      : "bg-background border rounded-bl-none",
                    // Estilo para mensagem temporária
                    message.id.startsWith("temp-") && "opacity-70",
                  )}
                >
                  <p>{message.text}</p>
                  <div className={cn("text-xs mt-1 flex items-center", message.isMe ? "justify-end" : "justify-start")}>
                    {message.timestamp}
                    {message.id.startsWith("temp-") && <Loader2 className="h-3 w-3 animate-spin ml-1" />}
                  </div>
                </div>
              </div>
            ))}
            {/* Elemento para scroll automático - sempre no final */}
            <div ref={messagesEndRef} />
          </>
        )}
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
            disabled={!connected || sending}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newMessage.trim() || !connected || sending}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
          </Button>
        </form>
      </div>
    </div>
  )
}
