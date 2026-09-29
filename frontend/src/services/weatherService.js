import api from './api';

export const weatherService = {
  getWeather: async (farmId = null) => {
    const url = farmId ? `/farms/${farmId}/weather` : `/weather`;
    const response = await api.get(url);
    return response.data;
  }
};
