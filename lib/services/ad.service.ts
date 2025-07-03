import api from '../axios';
import type { ApiResponse, Ad, User } from './types'; // ajuste o caminho conforme seu projeto
import { FEATURES_MOCK } from '@/components/features.mock';

export async function updateAdStatus(adId: string, active: boolean): Promise<ApiResponse<Ad>> {
  const response = await api.patch<ApiResponse<Ad>>(`/ads/${adId}/status`, { active });
  return response.data;
}

export async function getInterestedUsers(adId: string): Promise<ApiResponse<User[]>> {
  const response = await api.get<ApiResponse<User[]>>(`/ads/${adId}/interested`);
  return response.data; // retorna ApiResponse com data: User[]
}

export async function getAdById(adId: string): Promise<ApiResponse<Ad>> {
  const response = await api.get<ApiResponse<Ad>>(`/ads/${adId}`);
  return response.data; // retorna ApiResponse com data: Ad
}

interface Caracteristica {
  value: string
  description: string
}

export async function getListingsTags(): Promise<ApiResponse<Caracteristica[]>> {
  try {
    const response = await api.get<ApiResponse<Caracteristica[]>>('/enums/caracteristicas-imovel')

    return {
      data: response.data.data,
      status: response.data.status,
      message: response.data.message,
    }
  } catch (error) {
    console.error('Erro ao buscar tags. Usando mock.', error)
    return {
      data: FEATURES_MOCK, // certifique-se de que isso tenha o mesmo formato
      status: 200,
      message: 'Retornando mock por falha na API',
    }
  }
}
