"use client";

import { updateAdStatus } from "@/lib/services/ad.service";
import { anuncioService } from "@/lib/services/anuncio.service";
import { authService } from "@/lib/services/auth.service";
import { Anuncio } from "@/lib/services/types";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertCircle,
  Calendar,
  Eye,
  EyeOff,
  MessageSquare,
  PlusCircle,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import SafeImage from "@/components/listing/safe-image";

// Dados simulados de agendamentos
const appointments = [
  {
    id: "101",
    propertyId: "1",
    propertyTitle: "Apartamento próximo à USP",
    studentName: "Ana Silva",
    date: "15/05/2023",
    time: "14:00",
    status: "confirmed",
  },
  {
    id: "102",
    propertyId: "1",
    propertyTitle: "Apartamento próximo à USP",
    studentName: "Pedro Santos",
    date: "16/05/2023",
    time: "10:30",
    status: "pending",
  },
  {
    id: "103",
    propertyId: "2",
    propertyTitle: "Kitnet moderna perto da UFMG",
    studentName: "Mariana Costa",
    date: "18/05/2023",
    time: "16:00",
    status: "confirmed",
  },
];

export default function MyListingsPage() {
  const [activeListings, setActiveListings] = useState<Anuncio[]>([]);
  const [inactiveListings, setInactiveListings] = useState<Anuncio[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const fetchUserAndListings = async () => {
      try {
        setIsLoading(true);

        // Buscar usuário atual
        const user = await authService.getCurrentUser();
        setCurrentUser(user);

        // Buscar anúncios do usuário
        const response = await anuncioService.listarPorUsuario(user.id);

        if (response.data) {
          // Separar anúncios ativos e inativos
          const active = response.data.filter(
            (listing: Anuncio) => !listing.pausado
          );
          const inactive = response.data.filter(
            (listing: Anuncio) => listing.pausado
          );

          setActiveListings(active);
          setInactiveListings(inactive);
        }
      } catch (error) {
        console.error("Erro ao carregar anúncios:", error);
        toast.error("Erro ao carregar seus anúncios");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAndListings();
  }, []);

  const toggleListingStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateAdStatus(id);

      // Atualizar estado local
      if (currentStatus) {
        const listing = activeListings.find((l) => l.id === id);
        if (listing) {
          listing.pausado = true;
          setActiveListings(activeListings.filter((l) => l.id !== id));
          setInactiveListings([...inactiveListings, listing]);
        }
      } else {
        const listing = inactiveListings.find((l) => l.id === id);
        if (listing) {
          listing.pausado = false;
          setInactiveListings(inactiveListings.filter((l) => l.id !== id));
          setActiveListings([...activeListings, listing]);
        }
      }

      toast.success("Status do anúncio atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast.error("Erro ao atualizar status do anúncio");
    }
  };

  if (isLoading) {
    return (
      <div className="container py-6">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-muted-foreground">Carregando seus anúncios...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Meus anúncios</h1>
          <p className="text-muted-foreground">
            Gerencie seus imóveis anunciados
          </p>
        </div>
        <Link href="/create-listing">
          <Button className="flex items-center gap-2">
            <PlusCircle size={18} />
            Novo anúncio
          </Button>
        </Link>
      </div>

      <Tabs defaultValue="listings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="listings">Anúncios</TabsTrigger>
          <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
          <TabsTrigger value="messages">Mensagens</TabsTrigger>
        </TabsList>

        <TabsContent value="listings" className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">
              Anúncios ativos ({activeListings.length})
            </h2>
            {activeListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeListings.map((listing) => (
                  <Card key={listing.id}>
                    <div className="aspect-video relative">
                      <SafeImage
                        fotos={listing.fotos}
                        alt={listing.descricao}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                      <Badge className="absolute top-2 right-2 bg-green-500">
                        Ativo
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-1">
                        {listing.tipo}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-muted-foreground line-clamp-2">
                        {listing.descricao}
                      </p>
                      <div className="flex justify-between">
                        <span className="font-medium">
                          R$ {listing.aluguel}/mês
                        </span>
                        <span className="text-muted-foreground">
                          {listing.enderecoCompleto}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-1">
                          <span>
                            {listing.qtdQuartos} quarto
                            {listing.qtdQuartos > 1 ? "s" : ""}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>
                            {listing.qtdBanheiros} banheiro
                            {listing.qtdBanheiros > 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                      <div className="grid grid-cols-2 gap-2 w-full">
                        <Link href={`/listing/${listing.id}`}>
                          <Button variant="outline" className="w-full">
                            Ver
                          </Button>
                        </Link>
                        <Link href={`/listing/${listing.id}/edit`}>
                          <Button variant="outline" className="w-full">
                            Editar
                          </Button>
                        </Link>
                      </div>
                      <Button
                        variant="ghost"
                        className="w-full text-muted-foreground"
                        onClick={() =>
                          toggleListingStatus(listing.id, listing.pausado)
                        }
                      >
                        <EyeOff size={16} className="mr-2" />
                        Pausar anúncio
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Você não possui anúncios ativos no momento
                  </p>
                  <Link href="/create-listing">
                    <Button>Criar anúncio</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>

          {inactiveListings.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Anúncios inativos ({inactiveListings.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {inactiveListings.map((listing) => (
                  <Card key={listing.id}>
                    <div className="aspect-video relative">
                      <SafeImage
                        fotos={listing.fotos}
                        alt={listing.descricao}
                        fill
                        className="object-cover rounded-t-lg opacity-70"
                      />
                      <Badge className="absolute top-2 right-2 bg-gray-500">
                        Inativo
                      </Badge>
                    </div>
                    <CardHeader>
                      <CardTitle className="line-clamp-1">
                        {listing.tipo}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-muted-foreground line-clamp-2">
                        {listing.descricao}
                      </p>
                      <div className="flex justify-between">
                        <span className="font-medium">
                          R$ {listing.aluguel}/mês
                        </span>
                        <span className="text-muted-foreground">
                          {listing.enderecoCompleto}
                        </span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-2">
                      <div className="grid grid-cols-2 gap-2 w-full">
                        <Link href={`/listing/${listing.id}`}>
                          <Button variant="outline" className="w-full">
                            Ver
                          </Button>
                        </Link>
                        <Link href={`/listing/${listing.id}/edit`}>
                          <Button variant="outline" className="w-full">
                            Editar
                          </Button>
                        </Link>
                      </div>
                      <Button
                        variant="default"
                        className="w-full"
                        onClick={() =>
                          toggleListingStatus(listing.id, listing.pausado)
                        }
                      >
                        <Eye size={16} className="mr-2" />
                        Ativar
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="appointments">
          <h2 className="text-xl font-semibold mb-4">
            Agendamentos de visitas
          </h2>
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-1">
                        <h3 className="font-medium">
                          {appointment.propertyTitle}
                        </h3>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar
                            size={16}
                            className="text-muted-foreground"
                          />
                          <span>
                            {appointment.date} às {appointment.time}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">Estudante:</span>
                          <Link
                            href={`/user/student-id`}
                            className="text-primary hover:underline"
                          >
                            {appointment.studentName}
                          </Link>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {appointment.status === "confirmed" ? (
                          <Badge className="bg-green-500">Confirmado</Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-amber-500 border-amber-500"
                          >
                            Pendente
                          </Badge>
                        )}

                        <div className="flex gap-2">
                          {appointment.status === "pending" && (
                            <Button size="sm">Confirmar</Button>
                          )}
                          <Button variant="outline" size="sm">
                            <MessageSquare size={16} className="mr-2" />
                            Mensagem
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">
                  Você não possui agendamentos de visitas no momento
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="messages">
          <h2 className="text-xl font-semibold mb-4">Mensagens</h2>
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-8">
              <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Você não possui mensagens não lidas no momento
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
