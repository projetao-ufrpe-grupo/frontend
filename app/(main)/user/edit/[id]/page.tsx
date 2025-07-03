"use client";

import { useState, useRef, ChangeEvent, useEffect, MouseEvent } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authService } from "@/lib/services/auth.service";
import { enumsService } from "@/lib/services/enums.service";
import { UserInfo } from "@/lib/services/types";

export default function ProfilePage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [formUser, setFormUser] = useState<UserInfo | null>(null);
  const [isHoveringAvatar, setIsHoveringAvatar] = useState(false);
  const [userInterests, setUserInterests] = useState<
    { value: string; description: string }[]
  >([]);
  const [selectedInterest, setSelectedInterest] = useState<string>("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const userData = await authService.getCurrentUser();
        console.log(userData,'userData')
        setUser(userData);
        setFormUser(userData); // inicializa o formulário com os dados originais
      } catch (err) {
        setUser(null);
        setFormUser(null);
      }
    }
    async function fetchInterests() {
      try {
        const interests = await enumsService.getUserInterests();
        console.log(interests, "interesses");
        setUserInterests(interests);
      } catch {}
    }
    fetchUser();
    fetchInterests();
  }, []);

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && formUser) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result;
        if (typeof result === "string") {
          // Se quiser salvar avatar localmente no formulário, adicione avatar ao tipo UserInfo
          // setFormUser({ ...formUser, avatar: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!showDropdown) return;
    function handleClickOutside(event: Event) {
      const dropdown = document.getElementById("interesses-dropdown");
      const input = document.getElementById("interesses");
      if (
        dropdown &&
        !dropdown.contains(event.target as Node) &&
        input &&
        !input.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  if (!user || !formUser) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Carregando...
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM36 6V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

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

        <div className="relative z-10 container py-16 text-center text-white">
          <Avatar
            className="h-32 w-32 mx-auto mb-6 ring-4 ring-green-400 ring-offset-4 ring-offset-transparent relative group"
            onMouseEnter={() => setIsHoveringAvatar(true)}
            onMouseLeave={() => setIsHoveringAvatar(false)}
          >
            <AvatarFallback className="text-2xl bg-white text-blue-600">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <h1 className="text-4xl font-bold mb-2">{user.name}</h1>

          <div className="flex flex-wrap justify-center items-center gap-6 text-blue-100 mb-8">
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
              onSubmit={(e) => {
                e.preventDefault();
                setUser(formUser); // só atualiza o user ao salvar
              }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-lg font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Nome
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formUser.name}
                    onChange={(e) =>
                      setFormUser({ ...formUser, name: e.target.value })
                    }
                    className="h-12 mt-2 rounded-2xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-lg placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="lastName"
                    className="text-lg font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Sobrenome
                  </Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formUser.lastName}
                    onChange={(e) =>
                      setFormUser({ ...formUser, lastName: e.target.value })
                    }
                    className="h-12 mt-2 rounded-2xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-lg placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="email"
                    className="text-lg font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formUser.email}
                    onChange={(e) =>
                      setFormUser({ ...formUser, email: e.target.value })
                    }
                    className="h-12 mt-2 rounded-2xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-lg placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="biografia"
                    className="text-lg font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Biografia
                  </Label>
                  <Input
                    id="biografia"
                    name="biografia"
                    type="text"
                    value={formUser.biografia}
                    onChange={(e) =>
                      setFormUser({ ...formUser, biografia: e.target.value })
                    }
                    className="h-12 mt-2 rounded-2xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-lg placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="curso"
                    className="text-lg font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Curso
                  </Label>
                  <Input
                    id="curso"
                    name="curso"
                    type="text"
                    value={formUser.curso}
                    onChange={(e) =>
                      setFormUser({ ...formUser, curso: e.target.value })
                    }
                    className="h-12 mt-2 rounded-2xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-lg placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="semestre"
                    className="text-lg font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Semestre
                  </Label>
                  <Input
                    id="semestre"
                    name="semestre"
                    type="number"
                    value={formUser.semestre}
                    onChange={(e) =>
                      setFormUser({
                        ...formUser,
                        semestre: Number(e.target.value),
                      })
                    }
                    className="h-12 mt-2 rounded-2xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-lg placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="flex flex-col gap-2 relative">
                  <Label
                    htmlFor="interesses"
                    className="text-lg font-semibold text-slate-700 dark:text-slate-300"
                  >
                    Interesses ({selectedInterests.length}/5)
                  </Label>
                  <Input
                    id="interesses"
                    name="interesses"
                    type="text"
                    value={selectedInterests
                      .map(
                        (i) =>
                          userInterests.find((u) => u.value === i)
                            ?.description || i
                      )
                      .join(", ")}
                    readOnly
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="h-12 mt-2 rounded-2xl border-slate-200 dark:border-slate-700 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm text-lg text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 cursor-pointer"
                    placeholder="Selecione os interesses"
                  />
                  {showDropdown && (
                    <div
                      id="interesses-dropdown"
                      className="absolute z-20 mt-14 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-lg max-h-60 overflow-y-auto"
                    >
                      {userInterests.map((interest) => {
                        const isSelected = selectedInterests.includes(interest.value);
                        const isDisabled = !isSelected && selectedInterests.length >= 5;
                        
                        return (
                          <label
                            key={interest.value}
                            className={`flex items-center gap-2 px-4 py-2 cursor-pointer ${
                              isDisabled 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              disabled={isDisabled}
                              onChange={() => {
                                setSelectedInterests((prev) => {
                                  if (prev.includes(interest.value)) {
                                    // Remove if already selected
                                    return prev.filter((i) => i !== interest.value);
                                  } else {
                                    // Add only if under the limit of 5
                                    if (prev.length < 5) {
                                      return [...prev, interest.value];
                                    }
                                    return prev; // Don't add if already at limit
                                  }
                                });
                              }}
                            />
                            <span>{interest.description}</span>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Salvar alterações
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
