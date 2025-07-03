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
}

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  passwordConfirm: string;
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