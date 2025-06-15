import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'https://api.rentalstudendapp.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    // Tratamento específico para erro 401 (Não autorizado)
    if (error.response?.status === 401) {
      // Redireciona para login se token for inválido/expirado
      if (typeof window !== "undefined") {
        // Evita mostrar toast na página de login
        if (!window.location.pathname.includes("/login")) {
          toast.error("Sessão expirada. Por favor, faça login novamente.");
        }
        window.location.href = "/login";
      }
    } else {
      // Mostra mensagem de erro genérica para outros erros
      const message = error.response?.data?.message ?? 'Ocorreu um erro inesperado';
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

export default api; 