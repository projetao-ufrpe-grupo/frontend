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

export async function getListingsTags(): Promise<ApiResponse<string[]>> {
  try {
    const response = await api.get<ApiResponse<string[]>>('/listings/tags');

    const validTags = Array.isArray(response.data.data)
      ? response.data.data.filter((tag): tag is string => typeof tag === 'string')
      : [];

    return {
      data: validTags.length > 0 ? validTags : FEATURES_MOCK,
      status: response.data.status,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Erro ao buscar tags. Usando mock.', error);
    return {
      data: FEATURES_MOCK,
      status: 200,
      message: 'Retornando mock por falha na API',
    };
  }
}