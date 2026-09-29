import api from './api';

export const profitService = {
  getProfitSummary: async (seasonId) => {
    const response = await api.get(`/seasons/${seasonId}/profit`);
    return response.data;
  }
};
