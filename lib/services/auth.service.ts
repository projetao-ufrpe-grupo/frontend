import api from '../axios';
import { ApiResponse, RegisterUserPayload, User } from './types';

class AuthService {
  async register(userData: RegisterUserPayload): Promise<ApiResponse<User>> {
    const response = await api.post<ApiResponse<User>>('/users/register', userData);
    return response.data;
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const response = await api.get<ApiResponse<User>>('/users/me');
    return response.data;
  }

  async logout(): Promise<void> {
    localStorage.removeItem('token');
  }
}

export const authService = new AuthService(); 