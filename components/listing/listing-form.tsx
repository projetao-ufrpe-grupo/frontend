"use client"

import { TagCardsSelector } from "@/components/listing/listing-tags-selector"
import { StateSelect } from "@/components/states"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import api from "@/lib/axios"
import { anuncioService } from "@/lib/services/anuncio.service"
import { Ad, Foto } from "@/lib/services/types"
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
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"


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

interface FormData {
  // Dados do Imóvel (Property)
  id: string;
  tipo: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  qtd_quartos: string;
  qtd_banheiros: string;
  area: string;
  
  // Dados do Anúncio (Ad)
  title: string;
  aluguel: string;
  condominio: string;
  caucao: string;
  universidade: string;
  duracao_minima_contrato: string;
  description: string;
  features: string[];
  images: Foto[];
  availableFrom: string;
}

type ListingFormProps = {
  mode?: 'create' | 'edit'
  initialData?: Ad
}

export default function ListingForm({ mode = 'create', initialData }: ListingFormProps) {
  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState<FormData>({
  
    // Dados do Imóvel
    id: initialData?.id ?? "",
    tipo: initialData?.imovel?.tipo ?? "",
    logradouro: initialData?.imovel?.logradouro ?? "",
    numero: initialData?.imovel?.numero ?? "",
    complemento: initialData?.imovel?.complemento ?? "",
    bairro: initialData?.imovel?.bairro ?? "",
    cidade: initialData?.imovel?.cidade ?? "",
    estado: initialData?.imovel?.estado ?? "",
    cep: initialData?.imovel?.cep ?? "",
    qtd_quartos: initialData?.imovel?.qtd_quartos?.toString() ?? "0",
    qtd_banheiros: initialData?.imovel?.qtd_banheiros?.toString() ?? "1",
    area: initialData?.imovel?.area?.toString() ?? "",

    // Dados do Anúncio
    title: initialData?.title ?? "",
    aluguel: initialData?.aluguel?.toString() ?? "",
    condominio: initialData?.condominio?.toString() ?? "0",
    caucao: initialData?.caucao?.toString() ?? "0",
    universidade: initialData?.universidade ?? "USP",
    duracao_minima_contrato: initialData?.duracao_minima_contrato?.toString() ?? "6",
    description: initialData?.description ?? initialData?.imovel?.descricao ?? "",
    features: initialData?.features ? [...initialData.features] : [],
    images: initialData?.images ? [...initialData.images] : [],
    availableFrom: initialData?.availableFrom 
      ? new Date(initialData.availableFrom).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0]
  });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const [newFeature, setNewFeature] = useState("")

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

  // Função para formatar o tipo de imóvel de forma mais amigável
function formatPropertyType(type: string): string {
  const types: Record<string, string> = {
    apartment: 'Apartamento',
    house: 'Casa',
    room: 'Quarto',
    studio: 'Kitnet/Studio'
  };
  return types[type] || type;
}

// Função para formatar o endereço completo
function formatAddress(
  street: string,
  number: string,
  complement: string,
  city: string,
  state: string
  ): string {
      return [
        `${street}, ${number}`,
        complement && `(${complement})`,
        `${city} - ${state}`
      ]
        .filter(Boolean)
        .join(' ');
    }

  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  async function handleSubmit() {
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {

      // Validar campos obrigatórios
      if (!formData.tipo || !formData.logradouro || !formData.cidade || !formData.estado) {
        alert("Por favor, preencha todos os campos obrigatórios (Tipo, Endereço, Cidade e Estado)");
        return;
      }

      // Verificar se o aluguel foi preenchido
      if (!formData.aluguel || parseFloat(formData.aluguel) <= 0) {
        toast.error("O valor do aluguel é obrigatório e deve ser maior que zero");
        return;
      }

      // Verificar se há fotos selecionadas
      if (selectedFiles.length === 0) {
        toast.error("Por favor, selecione pelo menos uma foto do imóvel");
        return;
      }

      // Preparar o payload no formato esperado pela API
      const requestPayload = {
      aluguel: parseFloat(formData.aluguel) || 0,
      condominio: formData.condominio ? parseFloat(formData.condominio) : 0,
      caucao: formData.caucao ? parseFloat(formData.caucao) : 0,
      duracaoMinimaContrato: parseInt(formData.duracao_minima_contrato) || 0,
      area: parseFloat(formData.area) || 0,
      descricao: formData.description,
      tipo: mapTipoImovel(formData.tipo),
      dataDisponibilidade: formData.availableFrom,
      qtdQuartos: parseInt(formData.qtd_quartos) || 0,  // Use consistent naming
      qtdBanheiros: parseInt(formData.qtd_banheiros) || 0, // Remove duplicates
      cep: formData.cep.replace(/\D/g, ''),
      cidade: formData.cidade,
      estado: formData.estado,
      logradouro: formData.logradouro,
      numero: formData.numero,
      bairro: formData.bairro,
      complemento: formData.complemento,
      caracteristicas: formData.features,
    };

      // 4. Criar/Atualizar anúncio
      if (mode === "edit" && initialData?.id) {
        
        await anuncioService.atualizar(initialData.id, requestPayload, selectedFiles);
        alert("Anúncio atualizado com sucesso!");
      } else {
        try {
          console.log("Submitting payload:", requestPayload);
          await anuncioService.criar(requestPayload, selectedFiles);
        } catch (error) {
          if (typeof error === "object" && error !== null && "response" in error) {
            const err = error as { response?: { status?: any; data?: any; headers?: any } };
            console.error("Full error details:", {
              status: err.response?.status,
              data: err.response?.data,
              headers: err.response?.headers
            });
          } else {
            console.error("Full error details:", error);
          }
          toast.error('Erro ao criar anúncio. Por favor, tente novamente.');
          return;
        }
        toast.success('Anúncio criado com sucesso!');
      }

      router.push('/my-listings');
    } catch (error) {
      console.error('Erro ao criar anúncio:', error);
      toast.error('Erro ao criar anúncio. Por favor, tente novamente.');
      if (
        typeof error === "object" &&
        error !== null &&
        "response" in error &&
        (error as any).response?.status === 422
      ) {
        const validationErrors = (error as any).response.data?.items || {};
        console.error('Erros de validação:', validationErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  // Função auxiliar para mapear o tipo do imóvel
  function mapTipoImovel(tipo: string): string {
    const tipoMap: Record<string, string> = {
      'apartment': 'APARTAMENTO',
      'house': 'CASA',
      'room': 'QUARTO',
      'studio': 'KITNET'
    };
    return tipoMap[tipo] || tipo;
  }

  // Função auxiliar para mapear as características
  function mapCaracteristicas(features: string[]): string[] {
    const caracteristicasMap: Record<string, string> = {
      'Mobiliado': 'MOBILIADO',
      'Aceita Pets': 'ACEITA_PETS'
    };

    return features
      .map(feature => caracteristicasMap[feature])
      .filter(feature => feature !== undefined);
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
              <p className="text-muted-foreground text-lg">
                Selecione a opção que melhor descreve seu imóvel
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  value: "apartment",
                  label: "Apartamento",
                  description: "Unidade em prédio residencial",
                  icon: Building,
                },
                {
                  value: "house",
                  label: "Casa",
                  description: "Casa independente",
                  icon: House,
                },
                {
                  value: "room",
                  label: "Quarto",
                  description: "Quarto em casa ou apartamento compartilhado",
                  icon: Bed,
                },
                {
                  value: "studio",
                  label: "Kitnet/Studio",
                  description: "Ambiente integrado",
                  icon: Building2,
                },
              ].map((option) => (
                <Card
                  key={option.value}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 rounded-3xl border-2 ${
                    formData.tipo === option.value
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setFormData({ ...formData, tipo: option.value })}
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
        );

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
              <div className="space-y-6">
                {/* Rua/Avenida */}
                <div>
                  <Label htmlFor="street" className="text-base font-medium">
                    Rua/Avenida*
                  </Label>
                  <Input
                    id="street"
                    placeholder="Nome da rua ou avenida"
                    value={formData.logradouro}
                    onChange={(e) => setFormData({ ...formData, logradouro: e.target.value })}
                    className="h-12 rounded-xl"
                    required
                  />
                </div>

                {/* Número e Bairro lado a lado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="number" className="text-base font-medium">
                      Número*
                    </Label>
                    <Input
                      id="number"
                      placeholder="Número"
                      value={formData.numero}
                      onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
                      className="h-12 rounded-xl"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="bairro" className="text-base font-medium">
                      Bairro*
                    </Label>
                    <Input
                      id="bairro"
                      placeholder="Nome do bairro"
                      value={formData.bairro}
                      onChange={(e) => setFormData({ ...formData, bairro: e.target.value })}
                      className="h-12 rounded-xl"
                      required
                    />
                  </div>
                </div>

                {/* Complemento sozinho */}
                <div>
                  <Label htmlFor="complement" className="text-base font-medium">
                    Complemento
                  </Label>
                  <Input
                    id="complement"
                    placeholder="Apto, bloco, etc."
                    value={formData.complemento}
                    onChange={(e) => setFormData({ ...formData, complemento: e.target.value })}
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="city" className="text-base font-medium">
                    Cidade*
                  </Label>
                  <Input
                    id="city"
                    placeholder="São Paulo"
                    value={formData.cidade}
                    onChange={(e) => setFormData({ ...formData, cidade: e.target.value })}
                    className="h-12 rounded-xl"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="state" className="text-base font-medium">
                    Estado*
                  </Label>
                  <StateSelect 
                    value={formData.estado} 
                    onChange={(value) => setFormData({ ...formData, estado: value })}
                    className="h-12 rounded-xl"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label htmlFor="zipCode" className="text-base font-medium">
                  CEP*
                </Label>
                <Input
                  id="zipCode"
                  placeholder="00000-000"
                  value={formData.cep}
                  onChange={(e) => {
                    // Remove todos os não-dígitos e formata
                    const value = e.target.value.replace(/\D/g, '');
                    const formatted = value.length > 5 
                      ? `${value.slice(0, 5)}-${value.slice(5, 8)}` 
                      : value;
                    
                    setFormData({...formData, cep: formatted});
                  }}
                  className={`h-12 rounded-xl ${
                    formData.cep.replace(/\D/g, '').length !== 8 && formData.cep ? 'border-red-500' : ''
                  }`}
                  maxLength={9}
                />
                {formData.cep && formData.cep.replace(/\D/g, '').length !== 8 && (
                  <p className="text-sm text-red-500 mt-1">O CEP deve conter exatamente 8 dígitos</p>
                )}
              </div>
            </div>
          </div>
        );

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
                    value={formData.qtd_quartos}
                    onValueChange={(value) => setFormData({ ...formData, qtd_quartos: value })}
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
                    value={formData.qtd_banheiros}
                    onValueChange={(value) => setFormData({ ...formData, qtd_banheiros: value })}
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
                    type="number"
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
                <TagCardsSelector
                  initialSelected={formData.features}
                  onSelectionChange={(tags) => 
                    setFormData({...formData, features: tags})
                  }
                />
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
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold mb-3 flex items-center justify-center gap-3">
                <DollarSign className="text-blue-600" size={32} />
                Defina os valores
              </h2>
              <p className="text-muted-foreground text-lg">
                Informe o aluguel e, se aplicável, condomínio e caução
              </p>
            </div>
            <div className="max-w-md mx-auto space-y-6">
              {/* Aluguel (obrigatório) */}
              <div className="space-y-3">
                <Label htmlFor="aluguel" className="text-base font-medium flex items-center">
                  <Check className="mr-2 h-5 w-5 text-green-500" />
                  Valor do Aluguel (R$)*
                </Label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">R$</span>
                  <Input
                    id="aluguel"
                    placeholder="1.200"
                    value={formData.aluguel}
                    onChange={(e) => setFormData({ ...formData, aluguel: e.target.value })}
                    className="h-16 pl-12 text-2xl font-bold rounded-2xl text-center"
                  />
                </div>
              </div>

              {/* Condomínio (opcional) */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="include-condominio"
                    type="checkbox"
                    checked={formData.condominio !== "0"}
                    onChange={(e) => {
                      if (!e.target.checked) {
                        setFormData({ ...formData, condominio: "0" });
                      } else {
                        setFormData({ ...formData, condominio: "" });
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="include-condominio" className="ml-2 text-base font-medium">
                    Incluir Condomínio
                  </Label>
                </div>
                
                {formData.condominio !== "0" && (
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">R$</span>
                    <Input
                      id="condominio"
                      placeholder="300"
                      value={formData.condominio}
                      onChange={(e) => setFormData({ ...formData, condominio: e.target.value })}
                      className="h-12 pl-12 text-xl font-bold rounded-xl"
                    />
                  </div>
                )}
              </div>

              {/* Caução (opcional) */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    id="include-caucao"
                    type="checkbox"
                    checked={formData.caucao !== "0"}
                    onChange={(e) => {
                      if (!e.target.checked) {
                        setFormData({ ...formData, caucao: "0" });
                      } else {
                        setFormData({ ...formData, caucao: "" });
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="include-caucao" className="ml-2 text-base font-medium">
                    Incluir Caução
                  </Label>
                </div>
                
                {formData.caucao !== "0" && (
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-lg">R$</span>
                    <Input
                      id="caucao"
                      placeholder="1.200"
                      value={formData.caucao}
                      onChange={(e) => setFormData({ ...formData, caucao: e.target.value })}
                      className="h-12 pl-12 text-xl font-bold rounded-xl"
                    />
                  </div>
                )}
              </div>

              {/* Descrição */}
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
        );

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
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Upload className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Arraste suas fotos aqui</h3>
                  <p className="text-muted-foreground mb-4">ou clique para selecionar arquivos</p>
                </label>
              </div>

              {selectedFiles.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Fotos selecionadas ({selectedFiles.length}):</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full"
                          onClick={() => {
                            setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
                          }}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {formData.images.length > 0 && (
                <div className="mt-6">
                  <h4 className="font-semibold mb-3">Fotos do imóvel:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={`data:image/jpeg;base64,${image.dadosBase64}`}
                          alt={`Foto ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-8 w-8 rounded-full"
                          onClick={async () => {
                            // Remove a imagem localmente do estado
                            setFormData((prev) => ({
                              ...prev,
                              images: prev.images.filter((_, i) => i !== index),
                            }));
                            
                            // Chama a API para excluir a foto do servidor
                            try {
                              const fotoId = formData.images[index].id; // Supondo que cada imagem tenha um id
                              await anuncioService.excluirFoto(formData.id, fotoId); // Supondo que formData.id seja o anuncioId
                            } catch (error) {
                              console.error("Erro ao excluir foto:", error);
                              // Você pode querer reverter a remoção local se a chamada API falhar
                              // ou mostrar uma mensagem de erro para o usuário
                            }
                          }}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

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
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold">
                      {formatPropertyType(formData.tipo)} em {formData.cidade}
                    </h3>
                    <p className="text-muted-foreground">
                      {formatAddress(
                        formData.logradouro,
                        formData.numero,
                        formData.complemento,
                        formData.cidade,
                        formData.estado
                      )}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{formData.qtd_quartos}</div>
                      <div className="text-sm text-muted-foreground">Quartos</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{formData.qtd_banheiros}</div>
                      <div className="text-sm text-muted-foreground">Banheiros</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{formData.area}m²</div>
                      <div className="text-sm text-muted-foreground">Área</div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      R$ {formData.aluguel}/mês
                    </div>
                    
                    {formData.condominio !== "0" && (
                      <div className="mt-2 text-lg">
                        + Condomínio: R$ {formData.condominio}
                      </div>
                    )}
                    
                    {formData.caucao !== "0" && (
                      <div className="mt-2 text-lg">
                        + Caução: R$ {formData.caucao}
                      </div>
                    )}
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
        );

      default:
        return null;
    }
  }

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container py-10">
        <div className="flex gap-8">
          {/* Sidebar e steps: igual */}
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
                <Progress
                  value={progress}
                  className="h-2 rounded-full [&>div]:bg-gradient-to-r [&>div]:from-blue-500 [&>div]:to-blue-600"
                />
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
                      disabled={isSubmitting}
                      className="h-12 px-8 rounded-2xl font-medium bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white"
                    >
                      {isSubmitting ? (
                        <span>Publicando...</span>
                      ) : (
                        <>
                          <Check size={18} className="mr-2" />
                          Publicar Anúncio
                        </>
                      )}
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