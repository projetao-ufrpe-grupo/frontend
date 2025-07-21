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

      const conversation = await chatService.getConversation(currentUser.id, activeContact.id)

      const formattedMessages: Message[] = conversation.content.map((msg) => ({
        id: msg.id.toString(),
        senderId: msg.fromUserId,
        text: msg.content,
        timestamp: chatService.formatMessageTime(msg.date),
        read: true,
        isMe: msg.fromUserId === currentUser.id,
      }))

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
      }

      setMessages((prev) => [...prev, newMsg])
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeContact) return

    try {
      chatService.sendMessage(activeContact.id, newMessage.trim())
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      // Aqui você pode mostrar uma notificação de erro
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
                    "max-w-[80%] md:max-w-[70%] rounded-lg p-3",
                    message.isMe
                      ? "bg-blue-500 text-white rounded-br-none dark:bg-blue-500 dark:text-white"
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
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="p-3 border-t">
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Digite uma mensagem..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1"
            disabled={!connected}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!newMessage.trim() || !connected}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  )
}
