export interface User {
  id: string;
  name: string;
  email: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  lastName: string;
  biografia: string;
  curso: string;
  fotoPerfil: string;
  semestre: number;
  roles: string[];
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
  passwordConfirm: string;
  tipoUsuario: string;
}

export interface LoginUserPayload {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresIn: {
    token: number;
    refreshToken: number;
  };
}

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
  availableFrom: string; // Data de disponibilidade do imóvel
  images: string[]; // URLs das imagens do anúncio
  description?: string; // Descrição do anúncio, opcional
  features?: string[]; // Lista de recursos adicionais do imóvel
  imovel_id: string; // ID do imóvel relacionado
  anunciante_id: string; // ID do anunciante (LOCADOR)
  // Expansões para facilitar no front:
  imovel?: Property;
  anunciante?: User; // usar User aqui
}