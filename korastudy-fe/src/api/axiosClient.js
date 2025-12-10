import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = {
      status: error.response?.status,
      message:
        error.response?.data?.message ||
        error.message ||
        'Đã xảy ra lỗi. Vui lòng thử lại.',
      data: error.response?.data,
    };
    return Promise.reject(normalizedError);
  },
);

export default axiosClient;
