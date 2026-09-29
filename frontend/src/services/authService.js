import api from './api';

export const authService = {
  login: async (mobileNumber, password) => {
    const response = await api.post('/auth/login', { mobileNumber, password });
    return response.data;
  },

  register: async (fullName, mobileNumber, password) => {
    const response = await api.post('/auth/register', { fullName, mobileNumber, password });
    return response.data;
  }
};
