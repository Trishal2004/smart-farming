import api from './api';

export const diaryService = {
  getActivitiesBySeasonId: async (seasonId) => {
    const response = await api.get(`/seasons/${seasonId}/activities`);
    return response.data;
  },

  addActivity: async (seasonId, activityData) => {
    const response = await api.post(`/seasons/${seasonId}/activities`, activityData);
    return response.data;
  },

  updateActivity: async (id, activityData) => {
    const response = await api.put(`/activities/${id}`, activityData);
    return response.data;
  },

  deleteActivity: async (id) => {
    const response = await api.delete(`/activities/${id}`);
    return response.data;
  }
};
