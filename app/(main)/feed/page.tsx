"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, LayoutGrid, List, Search } from "lucide-react"
import { useState } from "react"
import FilterSidebar from "./filter-sidebar"
import PropertyCard from "./property-card"

// Dados simulados de propriedades
const properties = [
  {
    id: "1",
    title: "Apartamento próximo à USP",
    description: "Apartamento de 2 quartos, mobiliado, a 5 minutos da USP",
    price: 1200,
    location: "Butantã, São Paulo - SP",
    university: "USP",
    distance: "500m",
    bedrooms: 2,
    bathrooms: 1,
    area: 65,
    images: ["/placeholder.svg?height=300&width=500"],
    features: ["Mobiliado", "Internet", "Lavanderia"],
    type: "Apartamento",
  },
  {
    id: "2",
    title: "Kitnet moderna perto da UFMG",
    description: "Kitnet reformada com ótima localização, próxima ao campus Pampulha",
    price: 800,
    location: "Pampulha, Belo Horizonte - MG",
    university: "UFMG",
    distance: "800m",
    bedrooms: 1,
    bathrooms: 1,
    area: 30,
    images: ["/placeholder.svg?height=300&width=500"],
    features: ["Mobiliado", "Segurança 24h", "Academia"],
    type: "Kitnet",
  },
  {
    id: "3",
    title: "Casa compartilhada para estudantes da UFRJ",
    description: "Quartos individuais em casa compartilhada, ambiente tranquilo para estudos",
    price: 700,
    location: "Ilha do Fundão, Rio de Janeiro - RJ",
    university: "UFRJ",
    distance: "1.2km",
    bedrooms: 1,
    bathrooms: 2,
    area: 20,
    images: ["/placeholder.svg?height=300&width=500"],
    features: ["Quarto individual", "Cozinha compartilhada", "Área de estudos"],
    type: "Quarto",
  },
  {
    id: "4",
    title: "Apartamento espaçoso próximo à UNICAMP",
    description: "Apartamento de 3 quartos, ideal para compartilhar com outros estudantes",
    price: 1800,
    location: "Barão Geraldo, Campinas - SP",
    university: "UNICAMP",
    distance: "1km",
    bedrooms: 3,
    bathrooms: 2,
    area: 90,
    images: ["/placeholder.svg?height=300&width=500"],
    features: ["Varanda", "Garagem", "Área de lazer"],
    type: "Apartamento",
  },
  {
    id: "5",
    title: "Studio moderno próximo à PUC",
    description: "Studio completo, recém reformado, a poucos minutos da PUC",
    price: 1500,
    location: "Consolação, São Paulo - SP",
    university: "PUC-SP",
    distance: "400m",
    bedrooms: 1,
    bathrooms: 1,
    area: 40,
    images: ["/placeholder.svg?height=300&width=500"],
    features: ["Mobiliado", "Portaria 24h", "Academia"],
    type: "Studio",
  },
  {
    id: "6",
    title: "Quarto em república próximo à UFPE",
    description: "Quarto individual em república estabelecida, ambiente amigável",
    price: 600,
    location: "Cidade Universitária, Recife - PE",
    university: "UFPE",
    distance: "600m",
    bedrooms: 1,
    bathrooms: 2,
    area: 15,
    images: ["/placeholder.svg?height=300&width=500"],
    features: ["Internet", "Limpeza semanal", "Área comum"],
    type: "Quarto",
  },
]

// Universidades populares
const popularUniversities = ["USP", "UFRJ", "UFMG", "UNICAMP", "UnB", "UFPE", "PUC"]

export default function FeedPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [timeFilter, setTimeFilter] = useState("all")
  const [openFilter, setOpenFilter] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 15

  // Função para gerar os números de página visíveis
  const getVisiblePages = () => {
    const pages = []
    const maxVisible = 8

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      if (currentPage <= 4) {
        for (let i = 2; i <= 5; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 3) {
        pages.push("...")
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        pages.push("...")
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push("...")
        pages.push(totalPages)
      }
    }

    return pages
  }

  return (
    <div className="min-h-screen">
      {/* Header Section Simplificado */}
      <div className="container py-8">
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mx-auto mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Busque por universidade, bairro ou cidade..."
              className="h-12 pl-12 pr-4 rounded-2xl border-gray-200 bg-white shadow-sm ring-1 ring-gray-900/5 placeholder:text-gray-500 focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
          <Sheet open={openFilter} onOpenChange={setOpenFilter}>
            <SheetTrigger asChild>
              <Button className="h-12 px-8 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-sm font-medium dark:text-white transition-all duration-200">
                <Filter className="h-5 w-5 mr-2" />
                Filtrar
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[400px] sm:w-[500px] rounded-l-3xl">
              <SheetHeader className="mb-8">
                <SheetTitle className="text-2xl font-bold">Filtros</SheetTitle>
              </SheetHeader>
              <FilterSidebar onApply={() => setOpenFilter(false)} />
            </SheetContent>
          </Sheet>
        </div>

        {/* Popular Universities */}
        <div className="mx-auto mb-8">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">Universidades populares:</p>
          <div className="flex flex-wrap gap-3">
            {popularUniversities.map((uni) => (
              <Badge
                key={uni}
                variant="outline"
                className="px-4 py-2 rounded-full border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 cursor-pointer transition-all duration-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-blue-900/20 dark:hover:border-blue-700"
              >
                {uni}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container pb-12">
        <Tabs defaultValue="all" className="w-full">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
            <TabsList className="grid w-full lg:w-auto grid-cols-4 lg:grid-cols-4 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800">
              <TabsTrigger
                value="all"
                className="rounded-xl font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white"
              >
                Todos
              </TabsTrigger>
              <TabsTrigger
                value="apartment"
                className="rounded-xl font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white"
              >
                Apartamentos
              </TabsTrigger>
              <TabsTrigger
                value="room"
                className="rounded-xl font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white"
              >
                Quartos
              </TabsTrigger>
              <TabsTrigger
                value="house"
                className="rounded-xl font-medium data-[state=active]:bg-blue-600 data-[state=active]:text-white dark:data-[state=active]:bg-blue-600 dark:data-[state=active]:text-white"
              >
                Casas
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-4">
              <ToggleGroup
                type="single"
                value={timeFilter}
                onValueChange={(value) => value && setTimeFilter(value)}
                className="rounded-2xl bg-gray-100 dark:bg-gray-800 p-1"
              >
                <ToggleGroupItem
                  value="all"
                  size="sm"
                  className={`rounded-xl font-medium ${
                    timeFilter === "all"
                      ? "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  Tudo
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="today"
                  size="sm"
                  className={`rounded-xl font-medium ${
                    timeFilter === "today"
                      ? "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  Hoje
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="week"
                  size="sm"
                  className={`rounded-xl font-medium ${
                    timeFilter === "week"
                      ? "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  Semana
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="month"
                  size="sm"
                  className={`rounded-xl font-medium ${
                    timeFilter === "month"
                      ? "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                >
                  Mês
                </ToggleGroupItem>
              </ToggleGroup>

              <div className="flex rounded-2xl bg-gray-100 dark:bg-gray-800 p-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  className={`rounded-xl ${
                    viewMode === "grid"
                      ? "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  className={`rounded-xl ${
                    viewMode === "list"
                      ? "bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
                      : "hover:bg-gray-200 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div>
            <TabsContent value="all" className="mt-0">
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    : "flex flex-col gap-6"
                }
              >
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} viewMode={viewMode} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="apartment" className="mt-0">
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    : "flex flex-col gap-6"
                }
              >
                {properties
                  .filter((p) => p.type === "Apartamento" || p.type === "Studio")
                  .map((property) => (
                    <PropertyCard key={property.id} property={property} viewMode={viewMode} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="room" className="mt-0">
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    : "flex flex-col gap-6"
                }
              >
                {properties
                  .filter((p) => p.type === "Quarto" || p.type === "Kitnet")
                  .map((property) => (
                    <PropertyCard key={property.id} property={property} viewMode={viewMode} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="house" className="mt-0">
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    : "flex flex-col gap-6"
                }
              >
                {properties
                  .filter((p) => p.type === "Casa")
                  .map((property) => (
                    <PropertyCard key={property.id} property={property} viewMode={viewMode} />
                  ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>

        {/* Paginação Moderna */}
        <div className="mt-16 mb-8">
          <nav className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 h-11 px-4 rounded-2xl border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <ChevronsLeft className="h-4 w-4" />
                <span className="hidden md:inline font-medium">Primeira</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-2 h-11 px-4 rounded-2xl border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="font-medium">Anterior</span>
              </Button>
            </div>

            <div className="flex items-center gap-2">
              {getVisiblePages().map((page, index) => (
                <div key={index}>
                  {page === "..." ? (
                    <div className="flex h-11 w-11 items-center justify-center text-gray-400 font-medium">...</div>
                  ) : (
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page as number)}
                      className={`w-11 h-11 rounded-2xl font-medium ${
                        currentPage === page
                          ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                          : "border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                      }`}
                    >
                      {page}
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 h-11 px-4 rounded-2xl border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <span className="font-medium">Próxima</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 h-11 px-4 rounded-2xl border-gray-200 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                <span className="hidden md:inline font-medium">Última</span>
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </div>
  )
}
