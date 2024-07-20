// src/middleware/axiosInterceptor.js

import axios from 'axios';
import { store } from '../redux/store';

// Create Axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

// Function to get stored token
const getStoredToken = async () => {
  const state = store.getState();
  return state.UserData?.token || null;
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await getStoredToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      config.headers['Content-Type'] = 'multipart/form-data';
      return config;
    } catch (error) {
      console.error('Error in token retrieval:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    console.error('Error in request interceptor:', error);
    return Promise.reject(error);
  }
);

// Response interceptor (if needed)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle response errors
    console.error('Response error:', error);
    return Promise.reject(error);
  }
);

export default api;