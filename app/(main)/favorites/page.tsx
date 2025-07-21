"use client";

import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/use-favorites";
import { anuncioService } from "@/lib/services/anuncio.service";
import { Frown, Heart, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import PropertyCard from "../feed/property-card";

export default function FavoritesPage() {
  const { favorites, isLoaded } = useFavorites();
  const [favoriteProperties, setFavoriteProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        setLoading(true);
        const response = await anuncioService.favoritos();
        setFavoriteProperties(response.data);
      } catch (error) {
        console.error("Erro ao buscar favoritos:", error);
        setFavoriteProperties([]);
      } finally {
        setLoading(false);
      }
    };

    if (isLoaded) {
      fetchFavorites();
    }
  }, [isLoaded]);

  return (
    <div className="container py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Heart className="h-8 w-8 text-blue-500" />
          Meus Favoritos
        </h1>
        <p className="text-muted-foreground">
          Imóveis que você salvou para ver mais tarde
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-muted-foreground">Carregando seus favoritos...</p>
        </div>
      ) : favoriteProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              viewMode="grid"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted/30 p-4 rounded-full mb-4">
            <Frown className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">
            Você ainda não tem favoritos
          </h2>
          <p className="text-muted-foreground max-w-md mb-6">
            Adicione imóveis aos seus favoritos clicando no ícone de coração em
            cada anúncio para encontrá-los facilmente mais tarde.
          </p>
          <Link href="/feed">
            <Button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white">
              <Search size={16} />
              Explorar imóveis
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
