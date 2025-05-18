import axios from 'axios';

const API_URL = 'http://localhost:8080/api/admin';

export const adminService = {
  // Authentication
  login: async (email, password) => {
    return axios.post(`${API_URL}/login`, { email, password });
  },

  // User Management
  getAllUsers: async () => {
    return axios.get(`${API_URL}/users`);
  },
  deleteUser: async (userId) => {
    return axios.delete(`${API_URL}/users/${userId}`);
  },

  // Vendor Management
  getAllVendors: async () => {
    return axios.get(`${API_URL}/vendors`);
  },
  getVendorById: async (vendorId) => {
    return axios.get(`${API_URL}/vendors/${vendorId}`);
  },
  approveVendor: async (vendorId) => {
    return axios.put(`${API_URL}/vendors/${vendorId}/approve`);
  },
  rejectVendor: async (vendorId) => {
    return axios.put(`${API_URL}/vendors/${vendorId}/reject`);
  },
  deleteVendor: async (vendorId) => {
    return axios.delete(`${API_URL}/vendors/${vendorId}`);
  },

  // Couple Management
  getAllCouples: async () => {
    return axios.get(`${API_URL}/couples`);
  },
  getCoupleById: async (coupleId) => {
    return axios.get(`${API_URL}/couples/${coupleId}`);
  },
  deleteCouple: async (coupleId) => {
    return axios.delete(`${API_URL}/couples/${coupleId}`);
  }
};
