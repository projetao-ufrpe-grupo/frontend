"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { id } from "date-fns/locale"
import {
  ArrowLeft,
  ArrowRight,
  Bed,
  Building,
  Building2,
  Camera,
  Check,
  DollarSign,
  Eye,
  Home,
  House,
  Info,
  MapPin,
  Plus,
  Upload,
  X
} from "lucide-react"
import { useState } from "react"
import { Ad } from "@/lib/services/types"
import api from "@/lib/axios"

const steps = [
  {
    id: 1,
    title: "Tipo de Imóvel",
    description: "Selecione o tipo do seu imóvel",
    icon: Home,
  },
  {
    id: 2,
    title: "Localização",
    description: "Onde está localizado?",
    icon: MapPin,
  },
  {
    id: 3,
    title: "Detalhes",
    description: "Características do imóvel",
    icon: Home,
  },
  {
    id: 4,
    title: "Preço",
    description: "Defina o valor do aluguel",
    icon: DollarSign,
  },
  {
    id: 5,
    title: "Fotos",
    description: "Adicione fotos do imóvel",
    icon: Camera,
  },
  {
    id: 6,
    title: "Revisão",
    description: "Revise e publique",
    icon: Check,
  },
]

type ListingFormProps = {
  mode?: 'create' | 'edit'
  initialData?: Ad
}

export default function ListingForm({ mode = 'create', initialData }: ListingFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    id: initialData?.id ?? "",
    type: initialData?.imovel?.tipo ?? "",
    address: initialData?.imovel
      ? `${initialData.imovel.logradouro}, ${initialData.imovel.numero}${initialData.imovel.complemento ? `, ${initialData.imovel.complemento}` : ""}`
      : "",
    city: initialData?.imovel?.cidade ?? "",
    state: initialData?.imovel?.estado ?? "",
    zipCode: initialData?.imovel?.cep ?? "",
    bedrooms: initialData?.imovel?.qtd_quartos?.toString() ?? "",
    bathrooms: initialData?.imovel?.qtd_banheiros?.toString() ?? "",
    area: initialData?.imovel?.area?.toString() ?? "",
    furnished: initialData?.furnished ?? false,
    pets: initialData?.pets ?? false,
    smoking: initialData?.smoking ?? false,
    price: initialData?.aluguel?.toString() ?? "",
    description: initialData?.description ?? initialData?.imovel?.descricao ?? "",
    features: initialData?.features ?? [],
    photos: initialData?.images ?? [],
  })

  const [newFeature, setNewFeature] = useState("")

  const progress = (currentStep / steps.length) * 100

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const addFeature = () => {
    if (newFeature && !formData.features.includes(newFeature)) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature],
      })
      setNewFeature("")
    }
  }

  const removeFeature = (feature: string) => {
    setFormData({
      ...formData,
      features: formData.features.filter((f) => f !== feature),
    })
  }

  async function handleSubmit() {
    try {
      // 1. Preparar dados do imóvel para API
      const addressParts = formData.address.split(",").map(s => s.trim())
      const propertyPayload = {
        tipo: formData.type,
        logradouro: addressParts[0] || "",
        numero: addressParts[1] || "",
        complemento: addressParts[2] || "",
        cidade: formData.city,
        estado: formData.state,
        cep: formData.zipCode,
        qtd_quartos: parseInt(formData.bedrooms) || 0,
        qtd_banheiros: parseInt(formData.bathrooms) || 0,
        area: parseFloat(formData.area) || 0,
        descricao: formData.description,
      }

      // 2. Criar ou atualizar imóvel no backend
      let propertyId = ""
      if (mode === "edit" && initialData?.imovel_id) {
        await api.put(`/properties/${initialData.imovel_id}`, propertyPayload)
        propertyId = initialData.imovel_id
      } else {
        const res = await api.post("/properties", propertyPayload)
        propertyId = res.data.data.id
      }

      // 3. Preparar dados do anúncio
      const adPayload = {
        title: `Aluguel de ${formData.type} em ${formData.city}`,
        aluguel: parseFloat(formData.price) || 0,
        description: formData.description,
        images: formData.photos,
        features: formData.features,
        imovel_id: propertyId,
        universidade: "USP", // exemplo fixo, adapte conforme sua lógica
        duracao_minima_contrato: 6,
        pausado: false,
        availableFrom: new Date().toISOString(),
      }

      // 4. Criar ou atualizar anúncio no backend
      if (mode === "edit" && initialData?.id) {
        await api.put(`/ads/${initialData.id}`, adPayload)
        alert("Anúncio atualizado com sucesso!")
      } else {
        await api.post("/ads", adPayload)
        alert("Anúncio criado com sucesso!")
      }

      // Aqui você pode redirecionar ou resetar o form, se quiser

    } catch (error) {
      console.error(error)
      alert("Ocorreu um erro ao salvar o anúncio.")
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3">
                <Home className="text-blue-600" size={32} />
                Que tipo de imóvel você quer anunciar?
              </h2>
              <p className="text-muted-foreground text-lg">Selecione a opção que melhor descreve seu imóvel</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { value: "apartment", label: "Apartamento", description: "Unidade em prédio residencial", icon: Building },
                { value: "house", label: "Casa", description: "Casa independente", icon: House },
                { value: "room", label: "Quarto", description: "Quarto em casa ou apartamento compartilhado", icon: Bed },
                { value: "studio", label: "Kitnet/Studio", description: "Ambiente integrado", icon: Building2 },
              ].map((option) => (
                <Card
                  key={option.value}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 rounded-3xl border-2 ${
                    formData.type === option.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setFormData({ ...formData, type: option.value })}
                >
                  <CardContent className="p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                      <option.icon className="text-white" size={32} />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{option.label}</h3>
                    <p className="text-muted-foreground">{option.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3">
                <MapPin className="text-blue-600" size={32} />
                Onde está localizado seu imóvel?
              </h2>
              <p className="text-muted-foreground text-lg">Forneça o endereço completo</p>
            </div>
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="space-y-3">
                <Label htmlFor="address" className="text-base font-medium">
                  Endereço completo
                </Label>
                <Input
                  id="address"
                  placeholder="Rua, número, complemento"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="h-12 rounded-xl"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="city" className="text-base font-medium">
                    Cidade
                  </Label>
                  <Input
                    id="city"
                    placeholder="São Paulo"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="state" className="text-base font-medium">
                    Estado
                  </Label>
                  <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="Selecione o estado" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="SP">São Paulo</SelectItem>
                      <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                      <SelectItem value="MG">Minas Gerais</SelectItem>
                      <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="zipCode" className="text-base font-medium">
                  CEP
                </Label>
                <Input
                  id="zipCode"
                  placeholder="00000-000"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                  className="h-12 rounded-xl"
                />
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3">
                <Info className="text-blue-600" size={32} />
                Detalhes do imóvel
              </h2>
              <p className="text-muted-foreground text-lg">Descreva as características principais</p>
            </div>
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="bedrooms" className="text-base font-medium">
                    Quartos
                  </Label>
                  <Select
                    value={formData.bedrooms}
                    onValueChange={(value) => setFormData({ ...formData, bedrooms: value })}
                  >
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="0" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {[0, 1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="bathrooms" className="text-base font-medium">
                    Banheiros
                  </Label>
                  <Select
                    value={formData.bathrooms}
                    onValueChange={(value) => setFormData({ ...formData, bathrooms: value })}
                  >
                    <SelectTrigger className="h-12 rounded-xl">
                      <SelectValue placeholder="0" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="area" className="text-base font-medium">
                    Área (m²)
                  </Label>
                  <Input
                    id="area"
                    placeholder="50"
                    value={formData.area}
                    onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">Características</Label>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="furnished"
                      checked={formData.furnished}
                      onCheckedChange={(checked) => setFormData({ ...formData, furnished: checked as boolean })}
                      className="h-5 w-5 rounded-md"
                    />
                    <Label htmlFor="furnished" className="text-base">
                      Mobiliado
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="pets"
                      checked={formData.pets}
                      onCheckedChange={(checked) => setFormData({ ...formData, pets: checked as boolean })}
                      className="h-5 w-5 rounded-md"
                    />
                    <Label htmlFor="pets" className="text-base">
                      Aceita animais
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="smoking"
                      checked={formData.smoking}
                      onCheckedChange={(checked) => setFormData({ ...formData, smoking: checked as boolean })}
                      className="h-5 w-5 rounded-md"
                    />
                    <Label htmlFor="smoking" className="text-base">
                      Permite fumar
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">Comodidades adicionais</Label>
                <div className="flex gap-3">
                  <Input
                    placeholder="Ex: Academia, Piscina, Garagem"
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    className="h-12 rounded-xl"
                  />
                  <Button type="button" onClick={addFeature} className="h-12 w-12 rounded-xl">
                    <Plus size={18} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.features.map((feature, index) => (
                    <Badge
                      key={index}
                      className="flex items-center gap-2 p-2 rounded-full bg-blue-50 text-blue-700 border-0 dark:bg-blue-900/20 dark:text-blue-300"
                    >
                      {feature}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 p-0 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800"
                        onClick={() => removeFeature(feature)}
                      >
                        <X size={12} />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3">
                <DollarSign className="text-blue-600" size={32} />
                Qual o valor do aluguel?
              </h2>
              <p className="text-muted-foreground text-lg">Defina um preço competitivo para seu imóvel</p>
            </div>
            <div className="max-w-md mx-auto space-y-6">
              <div className="space-y-3">
                <Label htmlFor="price" className="text-base font-medium">
                  Valor mensal (R$)
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">R$</span>
                  <Input
                    id="price"
                    placeholder="1.200"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="h-16 pl-12 text-2xl font-bold rounded-2xl text-center"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="description" className="text-base font-medium">
                  Descrição do imóvel
                </Label>
                <Textarea
                  id="description"
                  placeholder="Descreva seu imóvel, destacando os pontos positivos e diferenciais..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  className="rounded-xl"
                />
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3">
                <Camera className="text-blue-600" size={32} />
                Adicione fotos do imóvel
              </h2>
              <p className="text-muted-foreground text-lg">Fotos de qualidade atraem mais interessados</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <div className="border-2 border-dashed border-gray-300 rounded-3xl p-12 text-center hover:border-blue-400 transition-colors">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                  <Upload className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-semibold mb-2">Arraste suas fotos aqui</h3>
                <p className="text-muted-foreground mb-4">ou clique para selecionar arquivos</p>
                <Button variant="outline" className="rounded-2xl">
                  Selecionar fotos
                </Button>
              </div>
            </div>
          </div>
        )

      case 6:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3">
                <Eye className="text-blue-600" size={32} />
                Revise seu anúncio
              </h2>
              <p className="text-muted-foreground text-lg">Confira todas as informações antes de publicar</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <Card className="rounded-3xl border-0 bg-white/80 backdrop-blur-sm shadow-lg ring-1 ring-gray-900/5 dark:bg-gray-800/80 dark:ring-gray-100/10">
                <CardContent className="p-8 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Tipo: {formData.type}</h3>
                    <p className="text-muted-foreground">
                      {formData.address}, {formData.city} - {formData.state}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{formData.bedrooms}</div>
                      <div className="text-sm text-muted-foreground">Quartos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{formData.bathrooms}</div>
                      <div className="text-sm text-muted-foreground">Banheiros</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{formData.area}m²</div>
                      <div className="text-sm text-muted-foreground">Área</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">R$ {formData.price}/mês</div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Descrição:</h4>
                    <p className="text-muted-foreground">{formData.description}</p>
                  </div>
                  {formData.features.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Comodidades:</h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.features.map((feature, index) => (
                          <Badge key={index} className="rounded-full">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container py-10">
        <div className="flex gap-8">
          {/* Sidebar e steps: igual */}

          {/* Conteúdo Principal */}
          <div className="flex-1">
            <Card className="rounded-3xl border-0 bg-white/80 backdrop-blur-sm shadow-lg ring-1 ring-gray-900/5 dark:bg-gray-800/80 dark:ring-gray-100/10">
              <CardContent className="p-12">
                {renderStepContent()}

                {/* Botões navegação */}
                <div className="flex justify-between mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="h-12 px-8 rounded-2xl font-medium"
                  >
                    <ArrowLeft size={18} className="mr-2" />
                    Anterior
                  </Button>

                  {currentStep === steps.length ? (
                    <Button
                      onClick={handleSubmit}
                      className="h-12 px-8 rounded-2xl font-medium bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
                    >
                      <Check size={18} className="mr-2" />
                      Publicar Anúncio
                    </Button>
                  ) : (
                    <Button
                      onClick={nextStep}
                      className="h-12 px-8 rounded-2xl font-medium bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
                    >
                      Próximo
                      <ArrowRight size={18} className="ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

