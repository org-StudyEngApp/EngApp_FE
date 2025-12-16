/**
 * Utility functions for handling avatar URLs
 */

/**
 * Validate if a URL is valid
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Clean and normalize avatar URL
 * @param {string} url - Avatar URL to clean
 * @returns {string|null} - Cleaned URL or null if invalid
 */
export const cleanAvatarUrl = (url) => {
  if (!url) return null;
  
  try {
    // Remove any extra whitespace
    url = url.trim();
    
    // Decode URL if it's encoded (fix double-encoding issue)
    try {
      // Try to decode once
      const decoded = decodeURIComponent(url);
      // Check if it was actually encoded by comparing
      if (decoded !== url && isValidUrl(decoded)) {
        console.log('Avatar URL was encoded, decoded to:', decoded);
        url = decoded;
      }
    } catch (e) {
      // If decode fails, use original URL
      console.log('URL decode not needed or failed, using original');
    }
    
    // Check if URL is valid
    if (!isValidUrl(url)) {
      console.warn('Invalid avatar URL:', url);
      return null;
    }
    
    // Return the cleaned URL
    return url;
  } catch (e) {
    console.error('Error cleaning avatar URL:', e);
    return null;
  }
};

/**
 * Get avatar display URL with fallback
 * @param {object} user - User object
 * @returns {string|null} - Avatar URL or null to show initials
 */
export const getAvatarUrl = (user) => {
  if (!user || !user.avatar) return null;
  
  const cleanUrl = cleanAvatarUrl(user.avatar);
  
  if (!cleanUrl) {
    console.warn('Avatar URL is invalid, will show initials instead');
    return null;
  }
  
  return cleanUrl;
};
