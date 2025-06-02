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
import { ArrowLeft, ArrowRight, Camera, Check, DollarSign, Home, MapPin, Plus, Upload, X } from "lucide-react"
import { useState } from "react"

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

export default function CreateListingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    type: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    furnished: false,
    pets: false,
    smoking: false,
    price: "",
    description: "",
    features: [] as string[],
    photos: [] as string[],
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-3">Que tipo de imóvel você quer anunciar?</h2>
              <p className="text-muted-foreground text-lg">Selecione a opção que melhor descreve seu imóvel</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { value: "apartment", label: "Apartamento", description: "Unidade em prédio residencial" },
                { value: "house", label: "Casa", description: "Casa independente" },
                { value: "room", label: "Quarto", description: "Quarto em casa ou apartamento compartilhado" },
                { value: "studio", label: "Kitnet/Studio", description: "Ambiente integrado" },
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
                      <Home className="text-white" size={32} />
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
              <h2 className="text-3xl font-bold mb-3">Onde está localizado seu imóvel?</h2>
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
              <h2 className="text-3xl font-bold mb-3">Detalhes do imóvel</h2>
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
              <h2 className="text-3xl font-bold mb-3">Qual o valor do aluguel?</h2>
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
              <h2 className="text-3xl font-bold mb-3">Adicione fotos do imóvel</h2>
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
              <h2 className="text-3xl font-bold mb-3">Revise seu anúncio</h2>
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
          {/* Sidebar com Steps Verticais */}
          <div className="w-80 flex-shrink-0">
            <div className="sticky top-8">
              <div className="mb-8">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent mb-2">
                  Criar Anúncio
                </h1>
                <p className="text-muted-foreground">
                  Passo {currentStep} de {steps.length}
                </p>
              </div>

              <div className="mb-8">
                <Progress value={progress} className="h-2 rounded-full" />
              </div>

              {/* Steps Verticais */}
              <div className="space-y-4">
                {steps.map((step, index) => {
                  const Icon = step.icon
                  const isActive = currentStep === step.id
                  const isCompleted = currentStep > step.id
                  const isUpcoming = currentStep < step.id

                  return (
                    <div key={step.id} className="flex items-start gap-4">
                      {/* Linha conectora */}
                      {index < steps.length - 1 && (
                        <div className="absolute left-6 mt-12 w-0.5 h-8 bg-gray-200 dark:bg-gray-700" />
                      )}

                      {/* Ícone do step */}
                      <div
                        className={`relative z-10 w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                          isCompleted
                            ? "bg-green-500 text-white shadow-lg"
                            : isActive
                              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg"
                              : "bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600"
                        }`}
                      >
                        {isCompleted ? <Check size={20} /> : <Icon size={20} />}
                      </div>

                      {/* Conteúdo do step */}
                      <div className="flex-1 min-w-0">
                        <div
                          className={`font-semibold ${
                            isActive
                              ? "text-blue-600 dark:text-blue-400"
                              : isCompleted
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-400 dark:text-gray-600"
                          }`}
                        >
                          {step.title}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">{step.description}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="flex-1">
            <Card className="rounded-3xl border-0 bg-white/80 backdrop-blur-sm shadow-lg ring-1 ring-gray-900/5 dark:bg-gray-800/80 dark:ring-gray-100/10">
              <CardContent className="p-12">
                {renderStepContent()}

                {/* Botões de navegação */}
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
                    <Button className="h-12 px-8 rounded-2xl font-medium bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600">
                      <Check size={18} className="mr-2" />
                      Publicar Anúncio
                    </Button>
                  ) : (
                    <Button
                      onClick={nextStep}
                      className="h-12 px-8 rounded-2xl font-medium bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
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
