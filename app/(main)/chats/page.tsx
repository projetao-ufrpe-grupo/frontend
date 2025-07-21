"use client"

import { MessageCircle } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { ChatArea } from "./chat-area"
import { ChatSidebar } from "./chat-sidebar"
import type { Contact } from "./types"

export default function ChatsPage() {
  const [activeContact, setActiveContact] = useState<Contact | null>(null)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const searchParams = useSearchParams()
  const selectedUserId = searchParams.get("user")

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
          selectedUserId={selectedUserId || undefined}
        />

        {/* Área principal de chat */}
        <ChatArea activeContact={activeContact} setIsMobileSidebarOpen={setIsMobileSidebarOpen} />
      </div>
    </div>
  )
}
