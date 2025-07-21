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
  description: string;
  aluguel: number;
  condominio: number;
  caucao: number;
  universidade: string;
  duracao_minima_contrato: number;
  pausado: boolean;
  anunciante_id: string;
  imovel_id: string;
  features: string[];
  images: Foto[];
  availableFrom: string;
  imovel: {
    tipo: string;
    logradouro: string;
    numero: string;
    complemento: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
    qtd_quartos: number;
    qtd_banheiros: number;
    area: number;
    descricao: string;
  };
  created_at: string;
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
  fotos: Foto[];
  anunciante: {
    id: string;
    name: string;
  };
}

export interface Foto {
  id: string;
  dadosBase64: string;
  arquivo?: File; // opcional, usado para upload
}

export interface Comentario {
  id: string;
  texto: string;
  autor: string;
  criadoEm: string;
  respostas: Comentario[];
}
