import api from './api';

export const harvestService = {
  getHarvestsBySeasonId: async (seasonId) => {
    const response = await api.get(`/seasons/${seasonId}/harvests`);
    return response.data;
  },

  addHarvest: async (seasonId, harvestData) => {
    const response = await api.post(`/seasons/${seasonId}/harvests`, harvestData);
    return response.data;
  },

  updateHarvest: async (id, harvestData) => {
    const response = await api.put(`/harvests/${id}`, harvestData);
    return response.data;
  },

  deleteHarvest: async (id) => {
    const response = await api.delete(`/harvests/${id}`);
    return response.data;
  }
};
