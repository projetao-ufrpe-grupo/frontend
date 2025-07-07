import axios from 'axios';
import { toast } from 'sonner';
import { authService } from './services/auth.service';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'https://backend-production-e2c0.up.railway.app',
  // baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const tokens = authService.getAuthTokens();
    if (tokens?.token) {
      config.headers.Authorization = `Bearer ${tokens.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      if (typeof window !== "undefined") {
        authService.logout(); // Limpa os tokens e informações do usuário
        if (!window.location.pathname.includes("/login")) {
          toast.error("Sessão expirada. Por favor, faça login novamente.");
        }
        window.location.href = "/login";
      }
    } else {
      const message = error.response?.data?.message ?? 'Ocorreu um erro inesperado';
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

export default api; 