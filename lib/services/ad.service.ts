// Funções de serviço para gerenciar anúncios, incluindo criação, listagem, atualização e exclusão de anúncios

import api from '../axios';

export async function updateAdStatus(adId: string, active: boolean) {
  const response = await api.patch(`/ads/${adId}/status`, { active });
  return response.data;
}

