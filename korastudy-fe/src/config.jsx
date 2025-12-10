/**
 * Cấu hình chung cho ứng dụng KoraStudy
 */

// API và Auth config
const resolveEnv = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env;
  }

  if (typeof process !== 'undefined' && process.env) {
    return process.env;
  }

  return {};
};

const runtimeEnv = resolveEnv();

export const API_BASE_URL =
  runtimeEnv.VITE_API_BASE_URL || runtimeEnv.REACT_APP_API_BASE_URL || 'http://localhost:8080';
export const AUTH_TOKEN_KEY = 'accessToken';

// Cài đặt ứng dụng
export const APP_CONFIG = {
  name: 'KoraStudy',
  description: 'Nền tảng học tiếng Hàn hiệu quả',
  version: '1.0.0',
  supportEmail: 'support@korastudy.com'
};

// Cấu hình upload file
export const UPLOAD_CONFIG = {
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif'],
  allowedAudioTypes: ['audio/mpeg', 'audio/wav']
};

// Cấu hình flashcard
export const FLASHCARD_CONFIG = {
  minCardsPerSet: 1,
  maxCardsPerSet: 100,
  defaultCategory: 'Từ vựng'
};

// Cấu hình blog
export const BLOG_CONFIG = {
  postsPerPage: 9,
  maxPostTitleLength: 100,
  maxPostSummaryLength: 300
};