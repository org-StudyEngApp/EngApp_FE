import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080') + '/api/v1';

// Tạo axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor để thêm token vào headers
api.interceptors.request.use(
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

// Response interceptor để handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    if (error.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('token');
      window.location.href = '/dang-nhap';
    }
    return Promise.reject(error);
  }
);

export const examService = {
  // Lấy danh sách tất cả bài thi - ENDPOINT ĐÚNG
  getAllExams: async () => {
    try {
      console.log('Calling API: GET /exams'); // Debug log
      const response = await api.get('/exams'); // Endpoint đúng như trong Postman
      console.log('API Response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error fetching exams:', error);
      throw error;
    }
  },

  // Lấy danh sách bài thi theo loại
  getExamsByType: async (examType) => {
    try {
      console.log(`Calling API: GET /exams?examType=${examType}`);
      const response = await api.get(`/exams`, {
        params: { examType }
      });
      console.log('API Response:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error fetching ${examType} exams:`, error);
      throw error;
    }
  },

  // Lấy bài thi Reading
  getReadingExams: async () => {
    return examService.getExamsByType('READING');
  },

  // Lấy bài thi Listening
  getListeningExams: async () => {
    return examService.getExamsByType('LISTENING');
  },

  // Lấy đề thi thật (Full Test)
  getFullTestExams: async () => {
    return examService.getExamsByType('FULL_TEST');
  },

  // Lấy chi tiết bài thi với error handling cho HTTP 403
  getExamDetail: async (id) => {
    try {
      console.log(`Calling API: GET /exams/${id}`);
      const response = await api.get(`/exams/${id}`);
      console.log('Exam detail response:', response.data);
      return { data: response.data, error: null };
    } catch (error) {
      console.error('Error fetching exam detail:', error);
      
      // Handle HTTP 403 - Locked content (Premium required)
      if (error.response?.status === 403) {
        return {
          data: null,
          error: {
            status: 403,
            code: 'EXAM_ACCESS_DENIED',
            message: error.response.data?.message || 'Bài thi này chỉ dành cho tài khoản Premium. Vui lòng nâng cấp để tiếp tục!',
            upgradeUrl: '/premium/pricing'
          }
        };
      }
      
      // Other errors
      throw error;
    }
  },

  // Nộp bài thi
  submitExam: async (examId, answers, userId) => {
    try {
      console.log(`Submitting exam ${examId} with answers:`, answers, 'userId:', userId); // Debug log
      // Truyền userId lên query param
      const response = await api.post(`/exams/${examId}/submit?userId=${userId}`, answers);
      console.log('Submit response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error submitting exam:', error);
      throw error;
    }
  },

  // Tìm kiếm bài thi
  searchExams: async (title, level, type) => {
    try {
      const params = new URLSearchParams();
      if (title) params.append('title', title);
      if (level) params.append('level', level);
      if (type) params.append('type', type);
      
      console.log(`Searching exams with params:`, params.toString()); // Debug log
      const response = await api.get(`/exams/search?${params}`);
      console.log('Search response:', response.data); // Debug log
      return response.data;
    } catch (error) {
      console.error('Error searching exams:', error);
      // Nếu search API chưa có, fallback về getAllExams và filter client-side
      const allExams = await this.getAllExams();
      let filteredExams = allExams;

      if (title) {
        filteredExams = filteredExams.filter(exam => 
          exam.title.toLowerCase().includes(title.toLowerCase())
        );
      }

      if (level) {
        filteredExams = filteredExams.filter(exam => 
          exam.level === level
        );
      }

      if (type) {
        filteredExams = filteredExams.filter(exam => 
          exam.category === type || exam.level === type
        );
      }

      return filteredExams;
    }
  },

  // Lấy comments của bài thi
  getExamComments: async (examId) => {
    try {
      console.log(`Getting comments for exam ${examId}`);
      const response = await api.get(`/exams/${examId}/comments`);
      console.log('Comments response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching comments:', error);
      throw error;
    }
  },

  // Thêm comment cho bài thi
    addExamComment: async (examId, context, userId) => {
  try {
    console.log(`Adding comment for exam ${examId}`);
    
    // Thay đổi: Gửi dữ liệu dưới dạng JSON body thay vì query parameters
    const response = await api.post(`/exams/${examId}/comments`, {
      context: context,
      userId: userId
    });
    
    console.log('Add comment response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
},

  // Nộp bài practice test
  submitPracticeTest: async (examId, partIds, answers, userId) => {
    try {
      console.log(`Submitting practice test ${examId} with parts:`, partIds);
      const params = new URLSearchParams();
      partIds.forEach(id => params.append('partIds', id));
      params.append('userId', userId);
      
      const response = await api.post(`/exams/${examId}/submit-practice?${params}`, { answers });
      console.log('Practice submit response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error submitting practice test:', error);
      throw error;
    }
  },

  // Lấy thống kê bài thi của user
  getStatistics: async (userId) => {
    try {
      console.log(`Getting statistics for user ${userId}`);
      const response = await api.get('/exams/statistics', {
        params: { userId }
      });
      console.log('Statistics response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching statistics:', error);
      throw error;
    }
  },

  // Lấy lịch sử làm bài thi của user
  getExamHistory: async (userId) => {
    try {
      console.log(`Getting exam history for user ${userId}`);
      const response = await api.get('/exams/history', {
        params: { userId }
      });
      console.log('Exam history response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching exam history:', error);
      throw error;
    }
  },
};