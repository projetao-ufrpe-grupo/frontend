"use client"

import ListingForm from "@/components/listing/listing-form"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { getAdById } from "@/lib/services/ad.service" // ajuste o caminho conforme necessário
import { ApiResponse, Ad } from "@/lib/services/types" // ajuste os tipos conforme sua estrutura
import { anuncioService } from "@/lib/services/anuncio.service"

function mapApiResponseToAd(apiData: any): Ad {
  // Converte o tipo do backend para o formato usado no frontend
  const convertPropertyType = (backendType: string): string => {
    const typeMap: Record<string, string> = {
      'APARTAMENTO': 'apartment',
      'CASA': 'house',
      'QUARTO': 'room',
      'KITNET': 'studio',
      'STUDIO': 'studio'
    };
    
    return typeMap[backendType?.toUpperCase()] || 'apartment';
  };

  return {
    id: apiData.id || "",
    title: "", // Campo não presente no backend - pode ser necessário ajustar
    description: apiData.descricao || "",
    aluguel: apiData.aluguel || 0,
    condominio: apiData.condominio || 0,
    caucao: apiData.caucao || 0,
    universidade: "USP", // Valor padrão
    duracao_minima_contrato: apiData.duracaoMinimaContrato || 6,
    pausado: apiData.pausado || false,
    anunciante_id: apiData.anunciante?.id || "",
    imovel_id: apiData.id || "",
    features: apiData.caracteristicas || [],
    images: apiData.fotos?.map((foto: any) => ({
      id: foto.id, // Função para IDs temporários se necessário
      dadosBase64: foto.dadosBase64 || ''
    })) || [],
    availableFrom: apiData.dataDisponibilidade || new Date().toISOString(),
    imovel: {
      tipo: convertPropertyType(apiData.tipo), // Usa a função de conversão
      logradouro: extrairLogradouro(apiData.enderecoCompleto),
      numero: extrairNumero(apiData.enderecoCompleto),
      complemento: "",
      bairro: extrairBairro(apiData.enderecoCompleto),
      cidade: extrairCidade(apiData.enderecoCompleto),
      estado: extractEstado(apiData.enderecoCompleto),
      cep: apiData.cep || "",
      qtd_quartos: apiData.qtdQuartos || 0,
      qtd_banheiros: apiData.qtdBanheiros || 0,
      area: apiData.area || 0,
      descricao: apiData.descricao || ""
    },
    created_at: new Date().toISOString()
  };
}

function extrairLogradouro(endereco: string): string {
  if (!endereco) return "";
  return endereco.split(',')[0]?.trim() || "";
}

function extrairNumero(endereco: string): string {
  if (!endereco) return "";
  const partes = endereco.split(',');
  if (partes.length < 1) return "";
  return partes[1]?.split('-')[0]?.replace(/\D/g, '').trim() || "";
}

function extrairBairro(endereco: string): string {
  if (!endereco) return "";
  const partes = endereco.split('-');
  if (partes.length < 1) return "";
  return partes[0]?.split(',')[1]?.trim() || "";
}

function extrairCidade(endereco: string): string {
  if (!endereco) return "";
  const partes = endereco.split('-');
  if (partes.length < 2) return "";
  return partes[1]?.split(',')[0]?.trim() || "";
}

function extractEstado(enderecoCompleto: string): string {
  if (!enderecoCompleto) return "";
  
  // Padrão: "Rua, 123 - Bairro, Cidade - SP"
  const partes = enderecoCompleto.split(' - ');
  
  // Pega a última parte (estado) e remove espaços extras
  const estado = partes[partes.length - 1]?.trim();
  
  // Verifica se é uma sigla válida de 2 caracteres
  return estado?.length === 2 ? estado : "";
}

const mockAdData: Ad = {
  id: "123abc456def",
  title: "Apartamento moderno próximo à USP",
  description: "Excelente apartamento recém-reformado com 2 quartos, varanda gourmet e vista para o parque.",
  aluguel: 2500,
  condominio: 800,
  caucao: 3000,
  universidade: "USP",
  duracao_minima_contrato: 12,
  pausado: false,
  anunciante_id: "locador123",
  imovel_id: "imovel123",
  features: ["Mobiliado", "Ar condicionado", "Varanda", "Portaria 24h"],
  images: [
  ],
  availableFrom: "2023-12-01T00:00:00.000Z",
  imovel: {
    tipo: "apartment",
    logradouro: "Rua Professor Luciano Gualberto",
    numero: "380",
    complemento: "Bloco B - Apt 94",
    bairro: "Butantã",
    cidade: "São Paulo",
    estado: "SP",
    cep: "05508-010",
    qtd_quartos: 2,
    qtd_banheiros: 2,
    area: 65,
    descricao: "Apartamento com piso laminado, cozinha americana e armários embutidos"
  },
  created_at: "2023-11-15T10:30:00.000Z",

};

export default function EditListingPage() {
  const { id } = useParams();
  const [data, setData] = useState<Ad | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const loadAd = async () => {
      try {
        setLoading(true);
        const response = await getAdById(id as string);
        
        // Debug: verifique a estrutura da resposta
        console.log("API Response:", response);
        
        const mappedData = mapApiResponseToAd(response);
        // Debug: verifique os dados mapeados
        console.log("Mapped Data:", mappedData);
        setData(mappedData);
      } catch (err) {
        console.error("Failed to load ad:", err);
        setError("Não foi possível carregar o anúncio.");
      } finally {
        setLoading(false);
      }
    };

    loadAd();
  }, [id]);

  if (loading) return <p>Carregando...</p>
  if (error) return <p>{error}</p>
  if (!data) return <p>Não foi possível carregar o anúncio.</p>

  return <ListingForm mode="edit" initialData={data} />
}