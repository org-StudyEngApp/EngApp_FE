import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const PAYMENT_API_URL = `${API_BASE_URL}/api/v1/payment`;

// Create axios instance for payment
const paymentApi = axios.create({
  baseURL: PAYMENT_API_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Setup interceptors for authentication
paymentApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

paymentApi.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect on 401 for check-premium/features endpoints to avoid redirect loop
    if (error.response?.status === 401) {
      const url = error.config?.url || '';
      if (!url.includes('/check-premium') && !url.includes('/features')) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        window.location.href = '/dang-nhap';
      }
    }
    
    const normalizedError = {
      status: error.response?.status,
      message: error.response?.data?.message || error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.',
      data: error.response?.data,
    };
    
    return Promise.reject(normalizedError);
  }
);

const paymentService = {
  /**
   * Tạo payment URL để redirect user đến VNPay
   * @param {Object} paymentData - { subscriptionType: 'PREMIUM_MONTHLY' | 'PREMIUM_YEARLY', bankCode?: string }
   * @returns {Promise<Object>} - { paymentUrl, transactionCode, message }
   */
  createPayment: async (paymentData) => {
    try {
      const response = await paymentApi.post('/create', paymentData);
      return response.data;
    } catch (error) {
      console.error('Create payment error:', error);
      throw error;
    }
  },

  /**
   * Lấy chi tiết giao dịch theo transaction code
   * @param {string} transactionCode 
   * @returns {Promise<Object>} Transaction details
   */
  getTransaction: async (transactionCode) => {
    try {
      const response = await paymentApi.get(`/transaction/${transactionCode}`);
      return response.data;
    } catch (error) {
      console.error('Get transaction error:', error);
      throw error;
    }
  },

  /**
   * Lấy lịch sử giao dịch của user
   * @param {number} page - Page number (default: 0)
   * @param {number} size - Page size (default: 10)
   * @returns {Promise<Object>} Paginated transaction history
   */
  getTransactionHistory: async (page = 0, size = 10) => {
    try {
      const response = await paymentApi.get('/history', {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error('Get transaction history error:', error);
      throw error;
    }
  },

  /**
   * Lấy thông tin subscription của user hiện tại
   * @returns {Promise<Object>} Subscription details
   */
  getSubscription: async () => {
    try {
      const response = await paymentApi.get('/subscription');
      return response.data;
    } catch (error) {
      console.error('Get subscription error:', error);
      throw error;
    }
  },

  /**
   * Kiểm tra user có premium không
   * @returns {Promise<Object>} - { isPremium: boolean }
   */
  checkPremium: async () => {
    try {
      const response = await paymentApi.get('/check-premium');
      console.log('Check premium response:', response.data); // Debug log
      
      // Đảm bảo response có structure đúng
      if (response.data && typeof response.data.isPremium === 'boolean') {
        return response.data;
      }
      
      // Fallback nếu response không đúng format
      console.warn('Invalid check-premium response:', response.data);
      return { isPremium: false };
      
    } catch (error) {
      console.error('Check premium error:', error);
      // Trả về false thay vì throw để tránh crash app
      return { isPremium: false };
    }
  },

  /**
   * Hủy subscription (tắt auto-renew)
   * @returns {Promise<Object>} Success message
   */
  cancelSubscription: async () => {
    try {
      const response = await paymentApi.post('/subscription/cancel');
      return response.data;
    } catch (error) {
      console.error('Cancel subscription error:', error);
      throw error;
    }
  },

  /**
   * Kiểm tra quyền truy cập các tính năng
   * @returns {Promise<Object>} - { canUseTranslation, canAccessTest, canReadArticle, canDownloadAudio }
   */
  checkFeatures: async () => {
    try {
      const response = await paymentApi.get('/features');
      return response.data;
    } catch (error) {
      console.error('Check features error:', error);
      throw error;
    }
  },
};

export default paymentService;
