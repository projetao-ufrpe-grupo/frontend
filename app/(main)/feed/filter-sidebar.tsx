"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Filter } from "lucide-react"

interface FilterSidebarProps {
  onApply?: () => void
}

export default function FilterSidebar({ onApply }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [distanceRange, setDistanceRange] = useState([0, 5])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Filter size={20} className="text-primary" />
        <h2 className="text-lg font-semibold">Filtros</h2>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-medium">Universidade</h3>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecione uma universidade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="usp">USP</SelectItem>
            <SelectItem value="unicamp">UNICAMP</SelectItem>
            <SelectItem value="ufrj">UFRJ</SelectItem>
            <SelectItem value="ufmg">UFMG</SelectItem>
            <SelectItem value="unb">UnB</SelectItem>
            <SelectItem value="puc">PUC</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-medium">Tipo de imóvel</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="apartment" />
            <Label htmlFor="apartment">Apartamento</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="house" />
            <Label htmlFor="house">Casa</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="room" />
            <Label htmlFor="room">Quarto</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="studio" />
            <Label htmlFor="studio">Studio</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="kitnet" />
            <Label htmlFor="kitnet">Kitnet</Label>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-medium">Preço mensal</h3>
        <div className="flex justify-between text-sm">
          <span>R${priceRange[0]}</span>
          <span>R${priceRange[1]}</span>
        </div>
        <Slider defaultValue={[0, 2000]} min={0} max={5000} step={100} onValueChange={setPriceRange} />
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-medium">Distância máxima</h3>
        <div className="flex justify-between text-sm">
          <span>{distanceRange[0]} km</span>
          <span>{distanceRange[1]} km</span>
        </div>
        <Slider defaultValue={[0, 5]} min={0} max={15} step={0.5} onValueChange={setDistanceRange} />
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-medium">Características</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="furnished" />
            <Label htmlFor="furnished">Mobiliado</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="internet" />
            <Label htmlFor="internet">Internet</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="parking" />
            <Label htmlFor="parking">Estacionamento</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="laundry" />
            <Label htmlFor="laundry">Lavanderia</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="security" />
            <Label htmlFor="security">Segurança 24h</Label>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h3 className="font-medium">Avaliação</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className="flex items-center space-x-2">
              <Checkbox id={`rating-${rating}`} />
              <Label htmlFor={`rating-${rating}`} className="flex items-center">
                {Array(rating)
                  .fill(0)
                  .map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                {Array(5 - rating)
                  .fill(0)
                  .map((_, i) => (
                    <span key={i} className="text-gray-300">
                      ★
                    </span>
                  ))}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button variant="outline" className="flex-1">
          Limpar
        </Button>
        <Button className="flex-1" onClick={onApply}>
          Aplicar
        </Button>
      </div>
    </div>
  )
}
