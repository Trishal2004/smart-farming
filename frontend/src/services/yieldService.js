import api from './api';

export const yieldService = {
  predictYield: async (data) => {
    const response = await api.post(`/ai/yield-prediction`, data);
    return response.data;
  }
};
