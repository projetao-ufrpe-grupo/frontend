import api from '../axios';
import type { ApiResponse, Ad, User } from './types'; // ajuste o caminho conforme seu projeto

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
