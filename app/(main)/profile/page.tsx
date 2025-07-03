"use client"

import { useState } from "react"
import UserProfilePage from "../user/[id]/page"

// Dados simulados do usuário
const userData = {
  name: "Maria Silva",
  email: "maria.silva@email.com",
  phone: "(11) 98765-4321",
  bio: "Estudante de Engenharia na USP, procurando um lugar tranquilo para morar próximo à universidade. Gosto de estudar em ambientes calmos e de socializar nos fins de semana.",
  avatar: "",
  university: "USP",
  course: "Engenharia Civil",
  semester: "5º",
  location: "São Paulo, SP",
  targetLocation: "Butantã, São Paulo - SP",
  budget: "R$ 800 - R$ 1.200",
  moveInDate: "Junho 2023",
  interests: ["Esportes", "Música", "Leitura", "Cinema", "Viagens", "Tecnologia"],
  preferences: {
    roommates: true,
    pets: true,
    smoking: false,
    furnished: true,
  },
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [profile, setProfile] = useState(userData)
  const [newInterest, setNewInterest] = useState("")

  const handleSave = () => {
    setIsEditing(false)
    // Aqui seria feita a chamada para salvar os dados no backend
  }

  const addInterest = () => {
    if (newInterest && !profile.interests.includes(newInterest)) {
      setProfile({
        ...profile,
        interests: [...profile.interests, newInterest],
      })
      setNewInterest("")
    }
  }

  const removeInterest = (interest: string) => {
    setProfile({
      ...profile,
      interests: profile.interests.filter((i) => i !== interest),
    })
  }

  return (
    <>
      <UserProfilePage params={{ id: "1" }} />
    </>
  )
}
