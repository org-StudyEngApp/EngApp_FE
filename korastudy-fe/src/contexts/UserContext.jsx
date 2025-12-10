import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../api/authService';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  // Initialize user from localStorage
  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = () => {
    try {
      // Migration: Chuyển token từ authToken sang accessToken nếu cần
      const oldToken = localStorage.getItem('authToken');
      if (oldToken && !localStorage.getItem('accessToken')) {
        localStorage.setItem('accessToken', oldToken);
        localStorage.removeItem('authToken');
        console.log('Migrated token from authToken to accessToken');
      }

      const storedToken = authService.getToken();
      const storedUser = authService.getCurrentUser();

      console.log('Initializing user - token:', storedToken, 'user:', storedUser); // Debug log

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Error initializing user:', error);
      // Clear invalid data
      authService.logout();
    } finally {
      setLoading(false);
    }
  };

    

  const login = async (credentials) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      
      console.log('Login response in UserContext:', response); // Debug log
      
      if (response.user) {
        setUser(response.user);
        setToken(response.token);
        console.log('User set in context:', response.user); // Debug log
        return response;
      } else {
        throw new Error('No user data in response');
      }
    } catch (error) {
      console.error('Login error:', error);
      setUser(null);
      setToken(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };



  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      // Redirect to login page
      window.location.href = '/';
    }
  };

  // Cập nhật thông tin người dùng

  const updateProfile = async (profileData) => {
  try {
    console.log('=== updateProfile in UserContext ===');
    
    // Sử dụng authService.updateProfile() đã cải tiến
    const updatedUser = await authService.updateProfile(profileData);
    console.log('Profile updated via authService:', updatedUser);
    
    // Cập nhật state
    setUser(prev => ({
      ...prev,
      ...updatedUser
    }));
    
    console.log('User state updated with new data');
    return updatedUser;
    
  } catch (error) {
    console.error('Error in UserContext.updateProfile:', error);
    
    // Nếu là lỗi JSON, thử update locally
    if (error.message && (
      error.message.includes('Unexpected token') || 
      error.message.includes('JSON') ||
      error.message.includes('not valid')
    )) {
      console.log('JSON error detected, updating user locally');
      
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        // Update locally
        const updatedUser = {
          ...currentUser,
          ...profileData,
          fullName: `${profileData.firstName || ''} ${profileData.lastName || ''}`.trim()
        };
        
        // Update state và localStorage
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        console.log('Local update completed:', updatedUser);
        return updatedUser;
      }
    }
    
    throw error;
  }
};

  const forgotPassword = async (email) => {
    try {
      const response = await authService.forgotPassword(email);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const isAuthenticated = () => {
    const hasToken = !!token || !!authService.getToken();
    const hasUser = !!user || !!authService.getCurrentUser();
    console.log('isAuthenticated check - hasToken:', hasToken, 'hasUser:', hasUser, 'result:', hasToken && hasUser); // Debug log
    return hasToken && hasUser;
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateProfile,
    forgotPassword,
    isAuthenticated
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};