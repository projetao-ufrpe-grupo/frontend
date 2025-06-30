export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: 'LOCADOR' | 'LOCATARIO';
  createdAt: string;
  updatedAt: string;
  avatar?: string; // URL do avatar do usuário, opcional
  university?: string; // Universidade do usuário, opcional
  course?: string; // Curso do usuário, opcional
  bio?: string; // Biografia do usuário, opcional
  rating?: number; // Avaliação do usuário, opcional
  responseTime?: number; // Tempo médio de resposta em horas, opcional
}

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
  userType: 'LOCADOR' | 'LOCATARIO';
}

export interface LoginUserPayload {
  email: string;
  password: string;
}

export type LoginResponse = {
  token: string;
  user: User;
};

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
} 

export interface Property {
  id: string;
  qtd_banheiros: number;
  qtd_quartos: number;
  tipo: string;
  bairro: string;
  cep: string;
  cidade: string;
  complemento?: string;
  descricao?: string;
  estado: string;
  logradouro: string;
  numero: string;
  area: number; // Área em m²
  created_at: string;
  updated_at: string;
}

export interface Ad {
  id: string;
  title: string;
  aluguel?: number;
  caucao?: number;
  condominio?: number;
  universidade: string;
  duracao_minima_contrato: number;
  pausado: boolean;
  created_at: string;
  updated_at: string;
  anunciante_id: string; // que será o User.id onde userType = 'LOCADOR'
  imovel_id: string;
  availableFrom: string; // Data de disponibilidade do imóvel
  images: string[]; // URLs das imagens do anúncio
  description?: string; // Descrição do anúncio, opcional
  furnished?: boolean; // Indica se o imóvel é mobiliado
  pets?: boolean; // Indica se animais de estimação são permitidos
  smoking?: boolean; // Indica se fumar é permitido 
  features?: string[]; // Lista de recursos adicionais do imóvel

  // Expansões para facilitar no front:
  imovel?: Property;
  anunciante?: User; // usar User aqui
}