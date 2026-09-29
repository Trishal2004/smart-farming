import api from './api';

export const soilReportService = {
  createSoilReport: async (seasonId, requestData) => {
    const response = await api.post(`/seasons/${seasonId}/soil-reports`, requestData);
    return response.data;
  },

  getSoilReportsBySeasonId: async (seasonId) => {
    const response = await api.get(`/seasons/${seasonId}/soil-reports`);
    return response.data;
  },

  getSoilReportById: async (id) => {
    const response = await api.get(`/soil-reports/${id}`);
    return response.data;
  },

  updateSoilReport: async (id, requestData) => {
    const response = await api.put(`/soil-reports/${id}`, requestData);
    return response.data;
  },

  deleteSoilReport: async (id) => {
    const response = await api.delete(`/soil-reports/${id}`);
    return response.data;
  }
};
