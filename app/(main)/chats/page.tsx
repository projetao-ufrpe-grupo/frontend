"use client"

import { useState } from "react"
import { ChatSidebar } from "./chat-sidebar"
import { ChatArea } from "./chat-area"
import type { Contact } from "./types"

export default function ChatsPage() {
  const [activeContact, setActiveContact] = useState<Contact | null>(null)
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
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
  )
}
