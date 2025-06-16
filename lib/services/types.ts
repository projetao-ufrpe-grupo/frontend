export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  userType: 'LOCADOR' | 'LOCATARIO';
  createdAt: string;
  updatedAt: string;
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

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
} 