/**
 * Token utilities - Quản lý token một cách tập trung
 */

const TOKEN_KEY = 'accessToken';

export const tokenUtils = {
  /**
   * Lấy token từ localStorage
   * @returns {string|null} Token hoặc null nếu không tồn tại
   */
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  /**
   * Lưu token vào localStorage
   * @param {string} token - Token cần lưu
   */
  setToken: (token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  /**
   * Xóa token khỏi localStorage
   */
  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  /**
   * Kiểm tra xem token có tồn tại và hợp lệ không
   * @returns {boolean}
   */
  hasValidToken: () => {
    const token = tokenUtils.getToken();
    return token && token.trim() !== '' && token !== 'null' && token !== 'undefined';
  },

  /**
   * Lấy Authorization header với Bearer token
   * @returns {object|null}
   */
  getAuthHeader: () => {
    const token = tokenUtils.getToken();
    if (token && tokenUtils.hasValidToken()) {
      return { Authorization: `Bearer ${token}` };
    }
    return null;
  }
};

export default tokenUtils;
