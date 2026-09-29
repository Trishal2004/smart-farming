import api from './api';

export const cropService = {
  recommendCrop: async (data) => {
    const response = await api.post(`/ai/crop-recommendation`, data);
    return response.data;
  }
};
