"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { useState, useEffect } from "react"
import { Caracteristica, getListingsTags } from "@/lib/services/ad.service"

interface FilterSidebarProps {
  onApply?: (filters: any) => void;
}

export default function FilterSidebar({ onApply }: FilterSidebarProps) {
  // Estados para os filtros
  const [filters, setFilters] = useState({
    tipo: undefined as string | undefined,
    precoTotalMin: undefined as number | undefined,
    precoTotalMax: undefined as number | undefined,
    areaMin: undefined as number | undefined,
    areaMax: undefined as number | undefined,
    caracteristicas: [] as string[]
  });

  // Estados para as características
  const [characteristics, setCharacteristics] = useState<Caracteristica[]>([])
  const [loadingCharacteristics, setLoadingCharacteristics] = useState(true)

  // Carrega as características ao montar o componente
  useEffect(() => {
    const loadCharacteristics = async () => {
      try {
        const tags = await getListingsTags()
        setCharacteristics(tags)
      } catch (error) {
        console.error("Failed to load characteristics", error)
      } finally {
        setLoadingCharacteristics(false)
      }
    }

    loadCharacteristics()
  }, [])

  // Manipuladores de eventos
  const handleCheckboxChange = (tipo: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      tipo: checked ? tipo : undefined
    }))
  }

  const toggleCharacteristic = (value: string) => {
    setFilters(prev => ({
      ...prev,
      caracteristicas: prev.caracteristicas.includes(value)
        ? prev.caracteristicas.filter(c => c !== value)
        : [...prev.caracteristicas, value]
    }));
  };

  const handleApply = () => {
    const activeFilters = Object.fromEntries(
      Object.entries({
        ...filters,
        caracteristicas: filters.caracteristicas?.length > 0 
          ? filters.caracteristicas.join(',') 
          : undefined
      }).filter(([_, value]) => value !== undefined)
    );

    if (onApply) onApply(activeFilters);
  };

  const handleReset = () => {
    setFilters({
      tipo: undefined,
      precoTotalMin: undefined,
      precoTotalMax: undefined,
      areaMin: undefined,
      areaMax: undefined,
      caracteristicas: []
    })
    if (onApply) onApply({})
  }

  return (
    <div className="space-y-6">
      {/* Seção Tipo de Imóvel */}
      <div className="space-y-4">
        <h3 className="font-medium">Tipo de imóvel</h3>
        <div className="space-y-2">
          {["APARTAMENTO", "CASA", "QUARTO", "STUDIO", "KITNET"].map((tipo) => (
            <div key={tipo} className="flex items-center space-x-2">
              <Checkbox
                id={`tipo-${tipo}`}
                checked={filters.tipo === tipo}
                onCheckedChange={(checked) => handleCheckboxChange(tipo, !!checked)}
              />
              <Label htmlFor={`tipo-${tipo}`}>
                {tipo.charAt(0) + tipo.slice(1).toLowerCase()}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />
      
      {/* Seção Preço - Slider com duas bolinhas */}
<div className="space-y-4">
  <h3 className="font-medium">Preço mensal (R$)</h3>
  <div className="flex justify-between text-sm mb-4">
    <span>R$ {filters.precoTotalMin || 0}</span>
    <span>R$ {filters.precoTotalMax || 5000}</span>
  </div>
  <Slider
    value={[filters.precoTotalMin || 0, filters.precoTotalMax || 5000]}
    min={0}
    max={5000}
    step={100}
    onValueChange={(value) =>
      setFilters({
        ...filters,
        precoTotalMin: value[0],
        precoTotalMax: value[1],
      })
    }
    className="w-full [&_[role=slider]]:h-4 [&_[role=slider]]:w-4 [&_[role=slider]]:rounded-full [&_[role=slider]]:bg-primary"
  />
</div>

<Separator />

{/* Seção Área - Slider com duas bolinhas */}
<div className="space-y-4">
  <h3 className="font-medium">Área (m²)</h3>
  <div className="flex justify-between text-sm mb-4">
    <span>{filters.areaMin || 0} m²</span>
    <span>{filters.areaMax || 200} m²</span> {/* <-- Corrigido aqui */}
  </div>
  <Slider
    value={[filters.areaMin || 0, filters.areaMax || 200]}
    min={0}
    max={200}
    step={5}
    onValueChange={(value) =>
      setFilters({
        ...filters,
        areaMin: value[0],
        areaMax: value[1],
      })
    }
    className="w-full [&_[role=slider]]:appearance-none
    [&_[role=slider]]:bg-primary
    [&_[role=slider]]:rounded-full
    [&_[role=slider]]:w-4
    [&_[role=slider]]:h-4
    [&_[role=slider]]:border
    [&_[role=slider]]:border-primary
    [&_[role=slider]]:shadow"
  />
</div>

      <Separator />

      {/* Seção Características */}
      <div className="space-y-4">
        <h3 className="font-medium">Características</h3>
        {loadingCharacteristics ? (
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Button
                key={i}
                variant="outline"
                className="h-8 rounded-full animate-pulse"
                disabled
              >
                <div className="h-4 w-16 bg-gray-200 rounded-full" />
              </Button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {characteristics.map((char) => (
              <Button
                key={char.value}
                variant={filters.caracteristicas.includes(char.value) ? "default" : "outline"}
                className={`h-8 rounded-full transition-all ${
                  filters.caracteristicas.includes(char.value)
                    ? "bg-primary hover:bg-primary/90"
                    : "hover:bg-gray-100"
                }`}
                onClick={() => toggleCharacteristic(char.value)}
              >
                {char.description}
              </Button>
            ))}
          </div>
        )}
      </div>

      <Separator />

      {/* Botões de Ação */}
      <div className="flex gap-4 pt-4">
        <Button variant="outline" className="flex-1" onClick={handleReset}>
          Limpar
        </Button>
        <Button className="flex-1" onClick={handleApply}>
          Aplicar
        </Button>
      </div>
    </div>
  )
}