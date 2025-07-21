import api from "../axios"
import { authService } from "./auth.service"

export interface ChatMessage {
  id: number
  fromUserId: string
  fromUserName: string
  toUserId: string
  toUserName: string
  content: string
  type: string
  date: string
}

export interface ChatConversation {
  totalPages: number
  totalElements: number
  first: boolean
  pageable: {
    pageNumber: number
    pageSize: number
    offset: number
    sort: {
      sorted: boolean
      empty: boolean
      unsorted: boolean
    }
    paged: boolean
    unpaged: boolean
  }
  size: number
  content: ChatMessage[]
  number: number
  sort: {
    sorted: boolean
    empty: boolean
    unsorted: boolean
  }
  numberOfElements: number
  last: boolean
  empty: boolean
}

export interface Contact {
  id: string
  name: string
  avatar?: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  online: boolean
}

class ChatService {
  private ws: WebSocket | null = null
  private messageHandlers: ((message: ChatMessage) => void)[] = []

  async getConversation(fromUserId: string, toUserId: string): Promise<ChatConversation> {
    const response = await api.get<ChatConversation>(
      `/chat/conversation?fromUserId=${fromUserId}&toUserId=${toUserId}&page=0&size=999`,
    )
    return response.data
  }

  async getContacts(userId: string): Promise<Contact[]> {
    try {
      return []
    } catch (error) {
      console.error("Error fetching contacts:", error)
      return []
    }
  }

  connectWebSocket(onMessage: (message: ChatMessage) => void): void {
    const tokens = authService.getAuthTokens()
    if (!tokens) {
      throw new Error("No auth token available")
    }

    const wsUrl = `ws://backend-production-e2c0.up.railway.app/ws/${tokens.token}`

    this.ws = new WebSocket(wsUrl)

    this.ws.onopen = () => {
      console.log("WebSocket connected")
    }

    this.ws.onmessage = (event) => {
      try {
        const message: ChatMessage = JSON.parse(event.data)
        onMessage(message)
        // Notifica todos os handlers registrados
        this.messageHandlers.forEach((handler) => handler(message))
      } catch (error) {
        console.error("Error parsing WebSocket message:", error)
      }
    }

    this.ws.onclose = () => {
      console.log("WebSocket disconnected")
      // Tentar reconectar após 3 segundos
      setTimeout(() => {
        if (this.ws?.readyState === WebSocket.CLOSED) {
          this.connectWebSocket(onMessage)
        }
      }, 3000)
    }

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error)
    }
  }

  sendMessage(to: string, content: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket is not connected")
    }

    const message = {
      to,
      content,
      type: "private",
    }

    this.ws.send(JSON.stringify(message))
  }

  addMessageHandler(handler: (message: ChatMessage) => void): void {
    this.messageHandlers.push(handler)
  }

  removeMessageHandler(handler: (message: ChatMessage) => void): void {
    this.messageHandlers = this.messageHandlers.filter((h) => h !== handler)
  }

  disconnect(): void {
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
    this.messageHandlers = []
  }

  formatMessageTime(dateString: string): string {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 1) {
      return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 24) {
      return date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 48) {
      return "Ontem"
    } else if (diffInHours < 168) {
      // 7 dias
      return date.toLocaleDateString("pt-BR", { weekday: "short" })
    } else {
      return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })
    }
  }
}

export const chatService = new ChatService()
