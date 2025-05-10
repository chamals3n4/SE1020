import axios from 'axios';

const API_URL = 'http://localhost:8080/api/admin';

export const adminService = {
  login: async (email, password) => {
    return axios.post(`${API_URL}/login`, { email, password });
  },
  getAllUsers: async () => {
    return axios.get(`${API_URL}/users`);
  },

  approveVendor: async (vendorId) => {
    return axios.put(`${API_URL}/vendor/${vendorId}/approve`);
  },

  // Additional helper methods for admin dashboard
  getStats: async () => {
    return axios.get(`${API_URL}/stats`);
  },
  getAllVendors: async () => {
    return axios.get(`${API_URL}/vendors`);
  }
};
