import axios from 'axios';

// Base URLs
const AUTH_API_URL = 'http://localhost:8080/api/v1/auth';
const USER_API_URL = 'http://localhost:8080/api/v1';

// Create axios instances with default configs
const authApi = axios.create({
  baseURL: AUTH_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

const userApi = axios.create({
  baseURL: USER_API_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Helper function to add auth token to requests
const setupInterceptors = (api) => {
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    }
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');
        
        // Chỉ chuyển hướng nếu KHÔNG đang ở trang đăng nhập
        const currentPath = window.location.pathname;
        if (currentPath !== '/dang-nhap' && currentPath !== '/login') {
          window.location.href = '/dang-nhap';
        }
      }

      // Thêm xử lý lỗi email trùng lặp
      if (error.response && error.response.status === 500) {
        const responseData = error.response.data || {};
        const errorMessage = responseData.message || responseData.error || '';
        
        if (errorMessage.toLowerCase().includes('email') || 
            errorMessage.toLowerCase().includes('duplicate') || 
            errorMessage.toLowerCase().includes('trùng')) {
          error.isEmailDuplicate = true;
          error.friendlyMessage = 'Email đã tồn tại trong hệ thống. Vui lòng sử dụng email khác.';
        }
      }

      return Promise.reject(error);
    }
  );
};

// Apply interceptors to both API instances
setupInterceptors(authApi);
setupInterceptors(userApi);

// Helper function to extract profile data from nested objects
// Modified to prioritize direct fields as seen in Postman response
const extractProfileData = (data, field, defaultValue = '') => {
  if (!data) return defaultValue;
  
  // Directly access the field first (as seen in Postman)
  if (data[field] !== undefined && data[field] !== null) {
    return data[field];
  }
  
  // Fallback to other possible nested locations
  const nestedValue = data.user?.[field] || 
                     data.account?.[field] || 
                     data.user?.account?.[field];
                     
  return nestedValue !== undefined && nestedValue !== null ? nestedValue : defaultValue;
};

// Helper function to update user in localStorage
const updateLocalUserData = (currentUser, newData) => {
  if (!currentUser) return null;
  
  const updatedUser = {
    ...currentUser,
    ...newData,
    // Ensure fullName is consistent with first and last name
    fullName: `${newData.firstName || currentUser.firstName || ''} ${newData.lastName || currentUser.lastName || ''}`.trim() || 
              newData.fullName || currentUser.fullName || currentUser.username
  };
  
  localStorage.setItem('user', JSON.stringify(updatedUser));
  
  // Debug log - remove in production
  console.log('Updated user data in localStorage:', updatedUser);
  
  return updatedUser;
};

// Main auth service object
const authService = {
  // Register new user
  register: async (userData) => {
    try {
      const registrationData = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword
      };

      const response = await authApi.post('/register', registrationData);
      console.log('Registration successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        const message = error.response.data?.message || 'Đăng ký thất bại';
        throw new Error(message);
      } else if (error.request) {
        throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
      } else {
        throw new Error('Đã xảy ra lỗi khi đăng ký');
      }
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      console.log('Attempting login with:', credentials.username);
      const response = await authApi.post('/login', {
        username: credentials.username,
        password: credentials.password
      });
      
      console.log('Login response received:', response.data);
      
      if (!response.data) {
        throw new Error('Invalid response from server');
      }
      
      // Store token
      const token = response.data.token || response.data.accessToken;
      if (token) {
        localStorage.setItem('accessToken', token);
      }
      
      // Get user ID - có thể là account ID hoặc user ID
      const userId = response.data.id || response.data.userId || response.data.accountId;
      if (!userId) {
        throw new Error('User ID không tồn tại trong response');
      }
      
      const basicUserData = {
        id: userId, // Lưu ID chính (có thể là account ID)
        userId: response.data.userId, // Lưu riêng user ID nếu có
        accountId: response.data.id || response.data.accountId, // Lưu riêng account ID
        username: response.data.username || credentials.username,
        roles: response.data.roles || ['USER'],
      };
      
      // Fetch complete profile data
      try {
        console.log('Fetching profile data for user:', userId);
        const profileResponse = await userApi.get(`/user/profile/${userId}`);
        console.log('Profile data received:', profileResponse.data);
        
        // Store raw profile data for debugging
        localStorage.setItem('userProfileRaw', JSON.stringify(profileResponse.data));
        
        const profileData = profileResponse.data;
        
        // Extract user data from profile response, ensuring we have the right IDs
        const userData = {
          ...basicUserData,
          // Keep both IDs for compatibility
          id: userId, // Primary ID (the one that works for API calls)
          userId: profileData.userId || basicUserData.userId,
          accountId: profileData.accountId || basicUserData.accountId,
          email: profileData.email || response.data.email || '',
          firstName: profileData.firstName || response.data.firstName || '',
          lastName: profileData.lastName || response.data.lastName || '',
          phoneNumber: profileData.phoneNumber || response.data.phoneNumber || '',
          gender: profileData.gender || response.data.gender || '',
          avatar: profileData.avatar || response.data.avatar || null,
          dateOfBirth: profileData.dateOfBirth || response.data.dateOfBirth || '',
          fullName: `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() || 
                    response.data.fullName || credentials.username,
          stats: {
            totalTests: 0,
            averageScore: 0,
            studyStreak: 0,
            totalStudyHours: 0
          },
          preferences: {
            testLevel: 'TOPIK I',
            interfaceLanguage: 'Vietnamese'
          },
          testHistory: [],
          badges: []
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('User data stored with IDs - Primary ID:', userData.id, 'User ID:', userData.userId, 'Account ID:', userData.accountId);
        
        return { token, user: userData };
      } catch (profileError) {
        console.error('Failed to fetch profile data:', profileError);
        
        // Fallback: use data from login response
        const userData = {
          ...basicUserData,
          email: response.data.email || '',
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          phoneNumber: response.data.phoneNumber || '',
          gender: response.data.gender || '',
          avatar: response.data.avatar || null,
          dateOfBirth: response.data.dateOfBirth || '',
          fullName: response.data.fullName || credentials.username,
          stats: {
            totalTests: 0,
            averageScore: 0,
            studyStreak: 0,
            totalStudyHours: 0
          },
          preferences: {
            testLevel: 'TOPIK I',
            interfaceLanguage: 'Vietnamese'
          }
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        console.warn('Using basic user data as profile fetch failed. Primary ID:', userData.id);
        
        return { token, user: userData };
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        const message = error.response.data?.message || 'Đăng nhập thất bại';
        throw new Error(message);
      } else if (error.request) {
        throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
      } else {
        throw new Error('Đã xảy ra lỗi khi đăng nhập');
      }
    }
  },

  // Logout user
  logout: async () => {
    try {
      await authApi.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userProfileRaw'); // Also remove debug data
    }
  },

  // Get current user from localStorage and refresh data if needed
  getCurrentUser: () => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) {
        return null;
      }
      
      const parsedUser = JSON.parse(userString);
      
      // Always fetch fresh profile data on page load
      if (parsedUser?.id) {
        console.log('Refreshing user data on page load for ID:', parsedUser.id);
        
        // Fetch profile asynchronously but return current user immediately
        (async () => {
          try {
            const profileResponse = await userApi.get(`/user/profile/${parsedUser.id}`);
            if (profileResponse.data) {
              console.log('Fresh profile data received:', profileResponse.data);
              
              // Store raw data for debugging
              localStorage.setItem('userProfileRaw', JSON.stringify(profileResponse.data));
              
              const profileData = profileResponse.data;
              
              // Update user with fresh profile data, matching flat structure
              const updatedUser = {
                ...parsedUser,
                email: profileData.email || parsedUser.email || '',
                firstName: profileData.firstName || parsedUser.firstName || '',
                lastName: profileData.lastName || parsedUser.lastName || '',
                phoneNumber: profileData.phoneNumber || parsedUser.phoneNumber || '',
                gender: profileData.gender || parsedUser.gender || '',
                avatar: profileData.avatar || parsedUser.avatar || null,
                dateOfBirth: profileData.dateOfBirth || parsedUser.dateOfBirth || '',
                fullName: `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() || 
                          parsedUser.fullName || parsedUser.username
              };
              
              localStorage.setItem('user', JSON.stringify(updatedUser));
              console.log('User data updated with fresh profile');
              
              // Force a UI update by dispatching a custom event
              window.dispatchEvent(new CustomEvent('userProfileUpdated', { 
                detail: updatedUser 
              }));
            }
          } catch (error) {
            console.error('Failed to refresh profile data:', error);
          }
        })();
      }
      
      return parsedUser;
    } catch (error) {
      console.error('Error parsing user data:', error);
      localStorage.removeItem('user');
      return null;
    }
  },

  // Get authentication token
  getToken: () => {
    return localStorage.getItem('accessToken');
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('accessToken');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Refresh authentication token
  refreshToken: async () => {
    try {
      const response = await authApi.post('/refresh');
      if (response.data.token || response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.token || response.data.accessToken);
        return response.data.token || response.data.accessToken;
      }
      throw new Error('Failed to refresh token');
    } catch (error) {
      authService.logout();
      throw error;
    }
  },

  // Send password reset request
  forgotPassword: async (email) => {
    try {
      const response = await authApi.post('/forgot-password', { email });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data?.message || 'Gửi email thất bại');
      }
      throw error;
    }
  },

// Update user profile
  updateProfile: async (userData) => {
    try {
      const currentUser = authService.getCurrentUser();
      const userId = currentUser?.id;
      
      if (!userId) {
        throw new Error('User ID not found. Please login again.');
      }

      const requestData = {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        phoneNumber: userData.phoneNumber,
        gender: userData.gender,
        avatar: userData.avatar || null,
        dateOfBirth: userData.dateOfBirth || null
      };

      console.log('Updating profile for user:', userId, requestData);
      
      try {
        const response = await userApi.put(`/user/profile/${userId}`, requestData);
        console.log('Profile updated successfully:', response.data);
        
        // Parse response if it's a string
        let responseData = response.data;
        if (typeof responseData === 'string' && responseData.trim() !== '') {
          try {
            responseData = JSON.parse(responseData);
          } catch (parseError) {
            console.warn('Could not parse response as JSON');
            responseData = {};
          }
        }
        
        // Update local user data
        const updatedUser = updateLocalUserData(currentUser, {
          ...requestData,
          ...responseData
        });
        
        // Force a UI update by dispatching a custom event
        window.dispatchEvent(new CustomEvent('userProfileUpdated', { 
          detail: updatedUser 
        }));
        
        return updatedUser;
      } catch (error) {
        console.error('Error updating profile with axios:', error);
        
        // Xử lý lỗi trùng email
        if (error.response && error.response.status === 500) {
          const status = error.response.status;
          const responseData = error.response.data || {};
          
          // Kiểm tra xem có phải là lỗi trùng email không
          if (status === 500 || status === 400) {
            const errorMessage = 
              responseData.message || 
              responseData.error || 
              error.message || '';
              
            if (errorMessage.toLowerCase().includes('email') || 
                errorMessage.toLowerCase().includes('duplicate') || 
                errorMessage.toLowerCase().includes('trùng')) {
              throw new Error('Email đã tồn tại trong hệ thống. Vui lòng sử dụng email khác.');
            }
          }
          
          throw new Error(responseData.message || `Lỗi cập nhật: ${status}`);
        }
        
        // Nếu không phải lỗi response, thử fallback với fetch API
        console.log('Trying fallback with fetch API');
        
        // ... phần code fetch API giữ nguyên ...
        
      }
    } catch (error) {
      console.error('Profile update error:', error);
      
      // Kiểm tra nếu lỗi có liên quan đến email
      if (error.message && error.message.toLowerCase().includes('email')) {
        throw error; // Giữ nguyên thông báo lỗi email
      }
      
      // If it's just a parsing error, try to update locally
      if (error.message && (
        error.message.includes('Unexpected token') || 
        error.message.includes('JSON')
      )) {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          console.log('Updating user data locally due to JSON error');
          return updateLocalUserData(currentUser, userData);
        }
      }
      
      throw error;
    }
  },

  // Force refresh user profile data
  refreshUserProfile: async () => {
    try {
      const currentUser = authService.getCurrentUser();
      if (!currentUser?.id) return null;
      
      const profileResponse = await userApi.get(`/user/profile/${currentUser.id}`);
      if (profileResponse.data) {
        const profileData = profileResponse.data;
        
        // Update user with fresh profile data
        const updatedUser = {
          ...currentUser,
          email: profileData.email || currentUser.email || '',
          firstName: profileData.firstName || currentUser.firstName || '',
          lastName: profileData.lastName || currentUser.lastName || '',
          phoneNumber: profileData.phoneNumber || currentUser.phoneNumber || '',
          gender: profileData.gender || currentUser.gender || '',
          avatar: profileData.avatar || currentUser.avatar || null,
          dateOfBirth: profileData.dateOfBirth || currentUser.dateOfBirth || '',
          fullName: `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim() || 
                    currentUser.fullName || currentUser.username
        };
        
        localStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('User profile manually refreshed');
        
        // Force a UI update
        window.dispatchEvent(new CustomEvent('userProfileUpdated', { 
          detail: updatedUser 
        }));
        
        return updatedUser;
      }
      
      return currentUser;
    } catch (error) {
      console.error('Error refreshing user profile:', error);
      return null;
    }
  }
};

export default authService;