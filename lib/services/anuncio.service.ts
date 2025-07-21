import api from '../axios';
import { Anuncio, ApiResponse} from './types';

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

  async search(filters: {
    tipo?: string;
    areaMin?: number;
    areaMax?: number;
    precoTotalMin?: number;
    precoTotalMax?: number;
    caracteristicas?: string[];
    nome?: string;
  }): Promise<ApiResponse<Anuncio[]>> {
    const response = await api.get<Anuncio[]>('/anuncios/search', {
      params: filters,
    });
    return { data: response.data, status: response.status };
  }

  async listarPorUsuario(usuarioId: string): Promise<ApiResponse<Anuncio[]>> {
    const response = await api.get<Anuncio[]>(`/anuncios/anunciante/${usuarioId}`);
    return { data: response.data, status: response.status };
  }

  async buscarPorId(id: string): Promise<ApiResponse<Anuncio>> {
    const response = await api.get<Anuncio>(`/anuncios/${id}`);
    return { data: response.data, status: response.status };
  }

  async atualizar(
    id: string,
    payload: Partial<CriarAnuncioPayload>,
    fotos?: File[]
  ): Promise<ApiResponse<Anuncio>> {
    // Primeiro atualiza os dados principais do anúncio
    const response = await api.put<Anuncio>(`/anuncios/${id}`, payload);

    // Se houver fotos novas, adiciona uma a uma
    if (fotos && fotos.length > 0) {
      for (const foto of fotos) {
        await this.adicionarFoto(id, foto);
      }
    }

    return { data: response.data, status: response.status };
  }

  async adicionarFoto(anuncioId: string, foto: File): Promise<ApiResponse<void>> {
      const formData = new FormData();
      formData.append('fotos', foto); // Must match exactly what backend expects

      try {
        const response = await api.post(`/anuncios/${anuncioId}/fotos`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return { data: response.data, status: response.status };
      } catch (error) {
        const err = error as any;
        console.error('Error adding photo:', {
          anuncioId,
          fileName: foto.name,
          error: err?.response?.data || err?.message
        });
        throw error;
      }
    }

  async excluirFoto(anuncioId: string, fotoId: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/anuncios/${anuncioId}/fotos/${fotoId}`);
    return { data: undefined, status: response.status };
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

  async comentar(id: string, comentario: string, comentarioPaiId: string | null) {
    const response = await api.post(`/api/anuncios/${id}/comentarios`, {
      texto: comentario,
      comentarioPaiId: comentarioPaiId,
    });
    return { data: response.data, status: response.status };
  }

  async listarComentarios(id: string) {
    const response = await api.get(`/api/anuncios/${id}/comentarios`);
    return { data: response.data, status: response.status };
  }

  async excluirComentario(id: string, comentarioId: string) {
    const response = await api.delete(`/api/anuncios/${id}/comentarios/${comentarioId}`);
    return { data: response.data, status: response.status };
  }
}

export const anuncioService = new AnuncioService();