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
  fotoPerfil: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
  avatar?: string;
  universidade?: string;
  curso?: string;
  semestre?: number;
  regiaoDeInteresse?: string;
  interesses?: string[];
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

export interface UpdateUserProfilePayload {
  email?: string;
  name?: string;
  password?: string;
  semestre?: number;
  tipoUsuario?: string;
  biografia?: string;
  curso?: string;
  regiaoDeInteresse?: string;
  interesses?: string[];
}

export interface Anuncio {
  id: string;
  aluguel: number;
  condominio: number;
  caucao: number;
  duracaoMinimaContrato: number;
  pausado: boolean;
  descricao: string;
  tipo: string;
  qtdQuartos: number;
  qtdBanheiros: number;
  area: number;
  dataDisponibilidade: string;
  enderecoCompleto: string;
  caracteristicas: string[];
  fotosBase64: string[];
  anunciante: {
    id: string;
    name: string;
  };
}
