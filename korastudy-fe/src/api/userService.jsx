import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const USER_API_URL = `${API_BASE_URL}/api/v1/user`;

// Create axios instance with default configs
const userApi = axios.create({
  baseURL: USER_API_URL,
  timeout: 30000, // Increase timeout for file uploads
});

// Add auth token to requests
userApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
userApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/dang-nhap';
    }
    return Promise.reject(error);
  }
);

const userService = {
  /**
   * Upload avatar for user
   * @param {number} userId - User ID
   * @param {File} file - Image file to upload
   * @returns {Promise} Response with avatarUrl
   */
  uploadAvatar: async (userId, file) => {
    try {
      // Validate file
      if (!file) {
        throw new Error('Vui lòng chọn một file ảnh');
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        throw new Error('Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP)');
      }

      // Validate file size (max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error('Kích thước file không được vượt quá 5MB');
      }

      // Create FormData
      const formData = new FormData();
      formData.append('file', file);

      console.log('Uploading avatar for user:', userId);

      // Send request
      const response = await userApi.post(`/profile/${userId}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Avatar upload response:', response.data);
      
      // Decode avatar URL if needed
      if (response.data.avatarUrl) {
        try {
          const decodedUrl = decodeURIComponent(response.data.avatarUrl);
          console.log('Original avatar URL:', response.data.avatarUrl);
          console.log('Decoded avatar URL:', decodedUrl);
          response.data.avatarUrl = decodedUrl;
        } catch (e) {
          console.log('Avatar URL decode not needed');
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Avatar upload error:', error);
      
      // Handle error messages
      if (error.response) {
        const message = error.response.data?.message || 'Không thể tải lên ảnh đại diện';
        throw new Error(message);
      } else if (error.message) {
        throw error;
      } else {
        throw new Error('Đã xảy ra lỗi khi tải lên ảnh đại diện');
      }
    }
  },

  /**
   * Update user profile
   * @param {number} userId - User ID
   * @param {Object} profileData - Profile data to update
   * @returns {Promise} Response with updated profile
   */
  updateProfile: async (userId, profileData) => {
    try {
      console.log('Updating profile for user:', userId, profileData);

      const response = await userApi.put(`/profile/${userId}`, profileData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Profile update response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Profile update error:', error);
      
      // Handle error messages
      if (error.response) {
        const message = error.response.data?.message || 'Không thể cập nhật thông tin cá nhân';
        
        // Check for specific errors
        if (error.response.status === 500) {
          const errorMessage = message.toLowerCase();
          if (errorMessage.includes('email') || 
              errorMessage.includes('duplicate') || 
              errorMessage.includes('trùng')) {
            throw new Error('Email đã tồn tại trong hệ thống. Vui lòng sử dụng email khác.');
          }
        }
        
        throw new Error(message);
      } else if (error.message) {
        throw error;
      } else {
        throw new Error('Đã xảy ra lỗi khi cập nhật thông tin cá nhân');
      }
    }
  },

  /**
   * Get user profile
   * @param {number} userId - User ID
   * @returns {Promise} Response with user profile
   */
  getUserProfile: async (userId) => {
    try {
      const response = await userApi.get(`/profile/${userId}`);
      console.log('Get profile response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },
};

export default userService;
