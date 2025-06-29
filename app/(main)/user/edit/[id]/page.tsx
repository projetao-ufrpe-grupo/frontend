"use client"

import { useState, useRef, ChangeEvent } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Mail, MapPin, } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Dados simulados do usuário
const userData = {
  id: "123",
  name: "João",
  last_name: "Santos",
  email: "joao.santos@email.com",
  bio: "Estudante de Ciência da Computação na UFMG, apaixonado por tecnologia e música. Procurando um lugar tranquilo para morar e estudar.",
  avatar: "/placeholder.svg?height=200&width=200",
  password: "senha123",
  university: "UFMG",
  course: "Ciência da Computação",
  semester: "7",
  regiao_de_interesse: "Belo Horizonte, MG",
  targetLocation: "Pampulha, Belo Horizonte - MG",
  interests: ["Tecnologia", "Música", "Esportes", "Jogos", "Cinema"],
  friendStatus: "none", // 'none', 'pending', 'friends'
  properties: [
    {
      id: "1",
      title: "Kitnet moderna perto da UFMG",
      price: 800,
      location: "Pampulha, Belo Horizonte - MG",
      image: "/placeholder.svg?height=300&width=500",
    },
  ],
}

export default function ProfilePage() {
  const [user, setUser] = useState(userData)
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result;
        if (typeof result === "string") {
          setUser({ ...user, avatar: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
       <div className="min-h-screen">
      {/* Hero Section com padrão hexagonal */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
        {/* Padrão hexagonal de fundo */}
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        {/* Hexágonos decorativos */}
        <div className="absolute inset-0">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute opacity-10"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            >
              <div className="w-16 h-16 bg-white/20 transform rotate-45" />
            </div>
          ))}
        </div>

        {/* Conteúdo do perfil */}
        <div className="relative z-10 container py-16 text-center text-white">
          <Avatar
            className="h-32 w-32 mx-auto mb-6 ring-4 ring-green-400 ring-offset-4 ring-offset-transparent relative group"
            onMouseEnter={() => setIsHoveringAvatar(true)}
            onMouseLeave={() => setIsHoveringAvatar(false)}
          >
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="text-2xl bg-white text-blue-600">{user.name.charAt(0)}</AvatarFallback>
            {isHoveringAvatar && (
              <button
                type="button"
                className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-white text-sm font-semibold rounded-full transition-opacity duration-200 z-10"
                onClick={() => fileInputRef.current?.click()}
                style={{ cursor: 'pointer' }}
              >
                Alterar imagem
                <span className="text-xs font-normal mt-1" style={{ 'fontSize': '10px' }}>Clique para selecionar</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </Avatar>

          <h1 className="text-4xl font-bold mb-2">{user.name}</h1>

          {/* Informações principais */}
          <div className="flex flex-wrap justify-center items-center gap-6 text-blue-100 mb-8">
            <div className="flex items-center gap-2">
              <Building2 size={18} />
              <span>{user.university}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <span>{user.regiao_de_interesse}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={18} />
              <span>{user.email}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Editar perfil de {user.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form
              className="space-y-4"
              onSubmit={e => {
                e.preventDefault();
                // Apenas atualiza o estado localmente
                setUser({ ...user });
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                    Nome
                  </Label>

                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={user.name}
                    onChange={e => setUser({ ...user, name: e.target.value })}
                    className="h-12 mt-2 rounded-2xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-lg placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="last_name" className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                    Sobrenome
                  </Label>

                  <Input
                    id="last_name"
                    name="last_name"
                    type="text"
                    value={user.last_name}
                    onChange={e => setUser({ ...user, last_name: e.target.value })}
                    className="h-12 mt-2 rounded-2xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-lg placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                    Email
                  </Label>

                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={user.email}
                    onChange={e => setUser({ ...user, email: e.target.value })}
                    className="h-12 mt-2 rounded-2xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-lg placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="bio" className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                    Bio
                  </Label>

                  <Input
                    id="bio"
                    name="bio"
                    type="text"
                    value={user.bio}
                    onChange={e => setUser({ ...user, bio: e.target.value })}
                    className="h-12 mt-2 rounded-2xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-lg placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="course" className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                    Curso
                  </Label>

                  <Input
                    id="course"
                    name="course"
                    type="text"
                    value={user.course}
                    onChange={e => setUser({ ...user, course: e.target.value })}
                    className="h-12 mt-2 rounded-2xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-lg placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="semester" className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                    Semestre
                  </Label>

                  <Input
                    id="semester"
                    name="semester"
                    type="text"
                    value={user.semester}
                    onChange={e => setUser({ ...user, semester: e.target.value })}
                    className="h-12 mt-2 rounded-2xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-lg placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                    Senha
                  </Label>

                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={user.password}
                    onChange={e => setUser({ ...user, password: e.target.value })}
                    className="h-12 mt-2 rounded-2xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-lg placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <Label htmlFor="regiao_de_interesse" className="text-lg font-semibold text-slate-700 dark:text-slate-300">
                    Região de interesse
                  </Label>

                  <Input
                    id="regiao_de_interesse"
                    name="regiao_de_interesse"
                    type="text"
                    value={user.regiao_de_interesse}
                    onChange={e => setUser({ ...user, regiao_de_interesse: e.target.value })}
                    className="h-12 mt-2 rounded-2xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-lg placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Salvar alterações</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
