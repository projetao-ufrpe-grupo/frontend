"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authService } from "@/lib/services/auth.service";
import { UserInfo } from "@/lib/services/types";
import {
  BookOpen,
  Building2,
  Check,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  School,
  UserPlus,
} from "lucide-react";
import { useEffect, useState, use } from "react";
import { toast } from "sonner";

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [user, setUser] = useState<UserInfo | null>(null);
  const [friendStatus, setFriendStatus] = useState<
    "none" | "pending" | "friends"
  >("none");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authService.getUserById(id);
        const userInfo: UserInfo = {
          ...response,
          lastName: "",
          biografia: "",
          fotoPerfil: "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setUser(userInfo);
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
        toast.error("Erro ao carregar informações do usuário");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleFriendRequest = () => {
    setFriendStatus(friendStatus === "none" ? "pending" : "none");
  };

  const getFriendButton = () => {
    switch (friendStatus) {
      case "none":
        return (
          <Button
            onClick={handleFriendRequest}
            className="flex items-center gap-2"
          >
            <UserPlus size={18} />
            Conectar
          </Button>
        );
      case "pending":
        return (
          <Button
            variant="outline"
            disabled
            className="flex items-center gap-2 bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300"
          >
            <Clock size={18} />
            Solicitação enviada
          </Button>
        );
      case "friends":
        return (
          <Button variant="outline" className="flex items-center gap-2">
            <Check size={18} />
            Conectado
          </Button>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Carregando...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Usuário não encontrado
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
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23ffffff' fillOpacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
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
          <Avatar className="h-32 w-32 mx-auto mb-6 ring-4 ring-green-400 ring-offset-4 ring-offset-transparent">
            <AvatarImage
              src={user.fotoPerfil || "/placeholder.svg"}
              alt={user.name}
            />
            <AvatarFallback className="text-2xl bg-white text-blue-600">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <h1 className="text-4xl font-bold mb-2">
            {user.name} {user.lastName}
          </h1>

          <div className="flex flex-wrap justify-center items-center gap-6 text-blue-100 mb-8">
            <div className="flex items-center gap-2">
              <Building2 size={18} />
              <span>{user.universidade || "Universidade não informada"}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <span>Localização não informada</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail size={18} />
              <span>{user.email}</span>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            {getFriendButton()}
            <Button
              variant="outline"
              className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => {
                window.location.href = `/chats?user=${user.id}`;
              }}
            >
              <MessageSquare size={18} />
              Enviar mensagem
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <Tabs defaultValue="about">
          <TabsList className="mb-6">
            <TabsTrigger value="about">Sobre</TabsTrigger>
            <TabsTrigger value="interests">Interesses</TabsTrigger>
            <TabsTrigger value="listings">Anúncios</TabsTrigger>
          </TabsList>

          <TabsContent value="about">
            <Card>
              <CardHeader>
                <CardTitle>Sobre {user.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-muted-foreground">
                    {user.biografia || "Biografia não informada"}
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">
                    Informações acadêmicas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50">
                      <School className="text-primary" size={20} />
                      <div>
                        <p className="font-medium">Universidade</p>
                        <p className="text-muted-foreground">
                          {user.universidade || "Não informada"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50">
                      <BookOpen className="text-primary" size={20} />
                      <div>
                        <p className="font-medium">Curso</p>
                        <p className="text-muted-foreground">
                          {user.curso || "Não informado"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50">
                      <BookOpen className="text-primary" size={20} />
                      <div>
                        <p className="font-medium">Semestre</p>
                        <p className="text-muted-foreground">
                          {user.semestre
                            ? `${user.semestre}º`
                            : "Não informado"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-accent/50">
                      <MapPin className="text-primary" size={20} />
                      <div>
                        <p className="font-medium">Região de interesse</p>
                        <p className="text-muted-foreground">
                          {user.regiaoDeInteresse || "Não informada"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="interests">
            <Card>
              <CardHeader>
                <CardTitle>Interesses e Hobbies</CardTitle>
                <CardDescription>
                  Interesses em comum podem ser o início de uma boa amizade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  <p className="text-muted-foreground">
                    Interesses não informados
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="listings">
            <Card>
              <CardHeader>
                <CardTitle>Anúncios de {user.name.split(" ")[0]}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  {user.name.split(" ")[0]} não possui anúncios no momento.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
