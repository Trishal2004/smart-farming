import api from './api';

export const expenseService = {
  getExpensesBySeasonId: async (seasonId) => {
    const response = await api.get(`/seasons/${seasonId}/expenses`);
    return response.data;
  },

  addExpense: async (seasonId, expenseData) => {
    const response = await api.post(`/seasons/${seasonId}/expenses`, expenseData);
    return response.data;
  },

  updateExpense: async (id, expenseData) => {
    const response = await api.put(`/expenses/${id}`, expenseData);
    return response.data;
  },

  deleteExpense: async (id) => {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  }
};
