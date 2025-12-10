import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../config';

// Khởi tạo Axios instance
const flashcardApi = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/flashcards`,
  timeout: 10000, // optional: timeout 10s
});

//  Interceptor: Gắn token hợp lệ nếu có
flashcardApi.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken');

    if (
      token &&
      token.trim() !== '' &&
      token !== 'null' &&
      token !== 'undefined'
    ) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

// Interceptor: Xử lý lỗi chung & custom toast
flashcardApi.interceptors.response.use(
  response => response,
  error => {
    const isSystemEndpoint = error.config?.url?.includes('/system');
    const isUserEndpoint = error.config?.url?.includes('/user');
    const isUnauthorized = error.response?.status === 401;
    const isNotFound = error.response?.status === 404;

    // Không hiển thị toast cho system endpoint khi 404 hoặc 401
    if (isSystemEndpoint && (isNotFound || isUnauthorized)) {
      console.log('System flashcards not available or unauthorized');
      return Promise.reject(error);
    }

    // Không hiển thị toast cho user endpoint khi 401 (chưa đăng nhập)
    if (isUserEndpoint && isUnauthorized) {
      console.log('User not authenticated for flashcards');
      return Promise.reject(error);
    }

    // Chỉ hiển thị toast cho các lỗi nghiêm trọng
    if (!isNotFound) {
      toast.error(error.response?.data?.message || 'Đã xảy ra lỗi!');
    }

    return Promise.reject(error);
  }
);

//
//  Service các hàm gọi API: Clean code, trả dữ liệu rõ ràng
//
export const flashcardService = {
  // Lấy các bộ của user đang đăng nhập
  getUserSets: async () => {
    try {
      const res = await flashcardApi.get('/user');
      return res.data;
    } catch (error) {
      // Fallback: thử endpoint khác nếu v1 không hoạt động
      if (error.response?.status === 404) {
        console.log('User flashcards endpoint not found, trying alternative...');
        try {
          const altRes = await axios.get(`${API_BASE_URL}/api/flashcards/user`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
          });
          return altRes.data;
        } catch (altError) {
          console.warn('User flashcards not available, returning empty array');
        }
      }
      // Trả về mảng rỗng thay vì throw error để trang không bị crash
      return [];
    }
  },

  //  Lấy các bộ hệ thống (public)
  getSystemSets: async () => {
    try {
      const res = await flashcardApi.get('/system');
      return res.data;
    } catch (error) {
      // Fallback: thử endpoint khác nếu v1 không hoạt động
      if (error.response?.status === 404) {
        console.log('System flashcards endpoint not found, trying alternative...');
        try {
          const altRes = await axios.get(`${API_BASE_URL}/api/flashcards/system`);
          return altRes.data;
        } catch (altError) {
          console.warn('System flashcards not available, returning empty array');
        }
      }
      // Trả về mảng rỗng thay vì throw error để trang không bị crash
      return [];
    }
  },

  //  Lấy chi tiết 1 bộ flashcard
  getFlashcardSet: async (setId) => {
    const res = await flashcardApi.get(`/${setId}`);
    return res.data;
  },

  //  Cập nhật progress (biết/chưa biết)
  updateCardProgress: async (cardId, isKnown) => {
    const res = await flashcardApi.patch('/progress', { cardId, isKnown });
    return res.data;
  },

  //  Tạo bộ flashcard của user
  createFlashcardSet: async (setData) => {
    const apiData = {
      title: setData.title,
      description: setData.description,
      category: setData.category || "Từ vựng",
      cards: setData.words.map(word => ({
        term: word.english || word.korean, // Support both for backward compatibility or transition
        definition: word.vietnamese,
        example: word.example || "",
        imageUrl: word.imageUrl || null,
      })),
    };

    const res = await flashcardApi.post('', apiData);
    toast.success('Tạo bộ flashcard thành công!');
    return res.data;
  },

  //  Tạo bộ flashcard hệ thống (admin)
  createSystemSet: async (setData) => {
    const apiData = {
      title: setData.title,
      description: setData.description,
      category: setData.category || "Từ vựng",
      cards: setData.words.map(word => ({
        term: word.english || word.korean,
        definition: word.vietnamese,
        example: word.example || "",
        imageUrl: word.imageUrl || null,
      })),
    };

    const res = await flashcardApi.post('/system', apiData);
    toast.success('Tạo bộ flashcard hệ thống thành công!');
    return res.data;
  },

  //  Cập nhật bộ flashcard của user
  updateFlashcardSet: async (setId, setData) => {
    const apiData = {
      title: setData.title,
      description: setData.description,
      category: setData.category || "Từ vựng",
      cards: setData.words.map(word => ({
        term: word.english || word.korean,
        definition: word.vietnamese,
        example: word.example || "",
        imageUrl: word.imageUrl || null,
      })),
    };

    const res = await flashcardApi.put(`/${setId}`, apiData);
    toast.success('Cập nhật bộ flashcard thành công!');
    return res.data;
  },

  //  Xóa bộ flashcard của user
  deleteFlashcardSet: async (setId) => {
    try {
      const res = await flashcardApi.delete(`/${setId}`);
      toast.success('Đã xoá bộ flashcard thành công!');
      return res.data;
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error(error.response?.data || 'Bạn không có quyền xoá bộ flashcard này');
      } else {
        toast.error('Không thể xoá bộ flashcard');
      }
      throw error;
    }
  },
};


export default flashcardService;
