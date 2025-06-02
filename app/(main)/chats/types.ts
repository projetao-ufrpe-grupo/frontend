export interface Contact {
  id: string
  name: string
  avatar: string
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  online: boolean
}

export interface Message {
  id: string
  senderId: string
  text: string
  timestamp: string
  read: boolean
  isMe: boolean
}
