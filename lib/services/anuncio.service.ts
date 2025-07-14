import api from '../axios';
import { Anuncio, ApiResponse } from './types';

interface CriarAnuncioPayload {
  aluguel: number;
  condominio: number;
  caucao: number;
  duracaoMinimaContrato: number;
  area: number;
  descricao: string;
  tipo: string;
  dataDisponibilidade: string;
  qtdQuartos: number;
  qtdBanheiros: number;
  cep: string;
  cidade: string;
  estado: string;
  logradouro: string;
  numero: string;
  bairro: string;
  complemento: string;
  caracteristicas: string[];
}

class AnuncioService {
  async criar(payload: CriarAnuncioPayload, fotos: File[]): Promise<ApiResponse<Anuncio>> {
    const formData = new FormData();
    const requestBlob = new Blob([JSON.stringify(payload)], {
      type: 'application/json'
    });
    formData.append('request', requestBlob);
    
    fotos.forEach((foto) => {
      formData.append('fotos', foto);
    });

    const response = await api.post<Anuncio>('/anuncios', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return { data: response.data, status: response.status };
  }

  async listar(): Promise<ApiResponse<Anuncio[]>> {
    const response = await api.get<Anuncio[]>('/anuncios');
    return { data: response.data, status: response.status };
  }

  async buscarPorId(id: string): Promise<ApiResponse<Anuncio>> {
    const response = await api.get<Anuncio>(`/anuncios/${id}`);
    return { data: response.data, status: response.status };
  }

  async atualizar(id: string, payload: Partial<CriarAnuncioPayload>, fotos?: File[]): Promise<ApiResponse<Anuncio>> {
    const formData = new FormData();
    const requestBlob = new Blob([JSON.stringify(payload)], {
      type: 'application/json'
    });
    formData.append('request', requestBlob);
    
    if (fotos) {
      fotos.forEach((foto) => {
        formData.append('fotos', foto);
      });
    }

    const response = await api.put<Anuncio>(`/anuncios/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return { data: response.data, status: response.status };
  }

  async excluir(id: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/anuncios/${id}`);
    return { data: undefined, status: response.status };
  }

  async favoritar(id: string): Promise<ApiResponse<void>> {
    const response = await api.post(`/account/favoritar/${id}`);
    return response.data;
  }

  async favoritos(): Promise<ApiResponse<Anuncio[]>> {
    const response = await api.get(`/account/favoritos`);
    return { data: response.data, status: response.status };
  }
}

export const anuncioService = new AnuncioService(); 