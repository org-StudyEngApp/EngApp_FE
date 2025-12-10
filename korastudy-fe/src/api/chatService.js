import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const chatService = {
  sendMessage: async (message) => {
    try {
      const response = await api.post('/api/v1/chat', { message });
      return response.data;
    } catch (error) {
      console.error('Error sending message to chat:', error);
      throw error;
    }
  },
};
