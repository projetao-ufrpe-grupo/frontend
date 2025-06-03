"use client"

import { useState } from "react"
import { ChatSidebar } from "./chat-sidebar"
import { ChatArea } from "./chat-area"
import type { Contact } from "./types"
import { MessageCircle } from "lucide-react"

export default function ChatsPage() {
  const [activeContact, setActiveContact] = useState<Contact | null>(null)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <div className="container py-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <MessageCircle className="h-8 w-8 text-blue-500" />
          Conversas
        </h1>
        <p className="text-muted-foreground">Suas conversas com proprietários e interessados</p>
      </div>

      <div className="flex h-[calc(100vh-12rem)] overflow-hidden rounded-2xl border">
        {/* Chat sidebar - lista de contatos */}
        <ChatSidebar
          activeContact={activeContact}
          setActiveContact={setActiveContact}
          isMobileSidebarOpen={isMobileSidebarOpen}
          setIsMobileSidebarOpen={setIsMobileSidebarOpen}
        />

        {/* Área principal de chat */}
        <ChatArea activeContact={activeContact} setIsMobileSidebarOpen={setIsMobileSidebarOpen} />
      </div>
    </div>
  )
}
