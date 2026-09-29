import api from './api';

export const seasonService = {
  getAllSeasons: async (farms) => {
    let allSeasons = [];
    for (const farm of farms) {
      const response = await api.get(`/seasons/farm/${farm.id}`);
      const farmSeasons = response.data.map(s => {
        let season = s.seasonName;
        let crop = '';
        let year = '';
        if (s.seasonName && s.seasonName.includes('|')) {
           const parts = s.seasonName.split('|').map(p => p.trim());
           season = parts[0] || '';
           crop = parts[1] || '';
           year = parts[2] || '';
        }
        return {
          ...s,
          farmId: farm.id,
          farmName: farm.name,
          season,
          crop,
          year,
          startDate: s.startDate,
          endDate: s.expectedEndDate,
          status: s.status
        };
      });
      allSeasons = [...allSeasons, ...farmSeasons];
    }
    return allSeasons;
  },

  createSeason: async (farmId, seasonData) => {
    const payload = {
      seasonName: `${seasonData.season} | ${seasonData.crop} | ${seasonData.year}`,
      startDate: seasonData.startDate,
      expectedEndDate: seasonData.endDate,
      status: seasonData.status
    };
    const response = await api.post(`/seasons/farm/${farmId}`, payload);
    return response.data;
  },

  updateSeason: async (id, seasonData) => {
    const payload = {
      seasonName: `${seasonData.season} | ${seasonData.crop} | ${seasonData.year}`,
      startDate: seasonData.startDate,
      expectedEndDate: seasonData.endDate,
      status: seasonData.status
    };
    const response = await api.put(`/seasons/${id}`, payload);
    return response.data;
  },

  deleteSeason: async (id) => {
    await api.delete(`/seasons/${id}`);
    return true;
  }
};
