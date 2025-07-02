// Funções de autenticação para registro, login, obtenção do usuário atual e logout

import api from '../axios';
import { ApiResponse, LoginResponse, LoginUserPayload, RegisterUserPayload, User, UserInfo } from './types';

interface AuthTokens {
  token: string;
  refreshToken: string;
  expiresIn: {
    token: number;
    refreshToken: number;
  }
}

class AuthService {
  private readonly AUTH_TOKENS_KEY = '@unihome:tokens';
  private readonly USER_INFO_KEY = '@unihome:user';

  async register(userData: RegisterUserPayload): Promise<ApiResponse<User>> {
    const response = await api.post<ApiResponse<User>>('/auth/register', userData);
    return response.data;
  }

  async login(credentials: LoginUserPayload): Promise<ApiResponse<LoginResponse>> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    const { token, refreshToken, expiresIn } = response.data;

    // Salva os tokens no localStorage
    this.setAuthTokens({ token, refreshToken, expiresIn });
    
    // Busca e salva as informações do usuário
    await this.fetchAndSaveUserInfo();
    
    return { data: response.data, status: response.status };
  }

  async getCurrentUser(): Promise<UserInfo> {
    const response = await api.get<UserInfo>('/account/me');
    return response.data;
  }

  private async fetchAndSaveUserInfo(): Promise<void> {
    try {
      const userInfo = await this.getCurrentUser();
      this.setUserInfo(userInfo);
    } catch (error) {
      console.error('Error fetching user info:', error);
      throw error;
    }
  }

  private setAuthTokens(tokens: AuthTokens): void {
    localStorage.setItem(this.AUTH_TOKENS_KEY, JSON.stringify(tokens));
  }

  private setUserInfo(userInfo: UserInfo): void {
    localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo));
  }

  getAuthTokens(): AuthTokens | null {
    const tokens = localStorage.getItem(this.AUTH_TOKENS_KEY);
    return tokens ? JSON.parse(tokens) : null;
  }

  getUserInfo(): UserInfo | null {
    const userInfo = localStorage.getItem(this.USER_INFO_KEY);
    return userInfo ? JSON.parse(userInfo) : null;
  }

  async logout(): Promise<void> {
    localStorage.removeItem(this.AUTH_TOKENS_KEY);
    localStorage.removeItem(this.USER_INFO_KEY);
  }
}

export const authService = new AuthService(); 