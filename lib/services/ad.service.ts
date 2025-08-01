import api from '../axios';
import type { ApiResponse, Ad, UserInfo } from './types'; // ajuste o caminho conforme seu projeto

export async function updateAdStatus(adId: string): Promise<ApiResponse<Ad>> {
  const response = await api.patch<ApiResponse<Ad>>(`/anuncios/${adId}/toggle-pause`);
  return response.data;
}

export async function getInterestedUsers(adId: string): Promise<UserInfo[]> {
  const response = await api.get(`/anuncios/${adId}/favoritos`);
  return response.data
}

export async function getAdById(adId: string): Promise<ApiResponse<Ad>> {
  const response = await api.get<ApiResponse<Ad>>(`/anuncios/${adId}`);
  return response.data; // retorna ApiResponse com data: Ad
}

export interface Caracteristica {
  value: string
  description: string
}

export async function getListingsTags(): Promise<Caracteristica[]> {
  try {
    const response = await api.get<Caracteristica[]>('/enums/caracteristicas-imovel');
    console.log('Resposta da instância api:', response);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar tags:', error);
    return [];
  }
}


