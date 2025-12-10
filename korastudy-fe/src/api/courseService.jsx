import axios from 'axios';
import { API_BASE_URL } from '../config';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_BASE_URL
});

// Add request interceptor for authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      message: error.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại sau.',
      status: error.response?.status,
      data: error.response?.data
    };
    return Promise.reject(customError);
  }
);

// Course Management APIs
const courseService = {
  /**
   * Lấy danh sách tất cả khóa học đã được xuất bản (public API)
   * 
   * @returns {Array} Danh sách khóa học đã được xuất bản
   */
  getAllPublishedCourses: async () => {
    try {
      const response = await api.get(`/api/v1/courses`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khóa học đã xuất bản:", error);
      throw error;
    }
  },

  /**
   * Lấy danh sách tất cả khóa học cho admin (cả đã xuất bản và chưa xuất bản)
   * 
   * @returns {Array} Danh sách khóa học cho admin
   */
  getAllCoursesForAdmin: async () => {
    try {
  const response = await api.get(`/api/v1/courses/admin`);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khóa học cho admin:", error);
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết một khóa học theo ID
   * Lưu ý: API này sẽ tự động tăng số lượt xem
   * 
   * @param {Number} courseId - ID của khóa học
   * @returns {Object} Thông tin chi tiết khóa học
   */
  getCourseById: async (courseId) => {
    try {
  const response = await api.get(`/api/v1/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin khóa học ID=${courseId}:`, error);
      throw error;
    }
  },

  /**
   * Tạo một khóa học mới (admin/content manager)
   * 
   * @param {Object} courseData - Dữ liệu khóa học mới (CourseCreateRequest)
   * @returns {Object} Thông tin khóa học đã được tạo
   */
  createCourse: async (courseData) => {
    try {
  const response = await api.post('/api/v1/courses', courseData);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo khóa học mới:", error);
      throw error;
    }
  },

  /**
   * Cập nhật thông tin khóa học (admin/content manager)
   * 
   * @param {Number} courseId - ID của khóa học
   * @param {Object} courseData - Dữ liệu cập nhật (CourseUpdateRequest)
   * @returns {Object} Thông tin khóa học đã được cập nhật
   */
  updateCourse: async (courseId, courseData) => {
    try {
  const response = await api.put(`/api/v1/courses/${courseId}`, courseData);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật khóa học ID=${courseId}:`, error);
      throw error;
    }
  },

  /**
   * Xóa một khóa học (admin/content manager)
   * 
   * @param {Number} courseId - ID của khóa học cần xóa
   * @returns {Object} Thông báo kết quả thành công
   */
  deleteCourse: async (courseId) => {
    try {
  const response = await api.delete(`/api/v1/courses/${courseId}`);
      return response.data; // ApiSuccess
    } catch (error) {
      console.error(`Lỗi khi xóa khóa học ID=${courseId}:`, error);
      throw error;
    }
  },

  /**
   * Tìm kiếm khóa học theo từ khóa
   * 
   * @param {String} keyword - Từ khóa tìm kiếm
   * @returns {Array} Kết quả tìm kiếm khóa học
   */
  searchCourses: async (keyword) => {
    try {
  const response = await api.get(`/api/v1/courses/search`, {
        params: { keyword }
      });
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi tìm kiếm khóa học với từ khóa "${keyword}":`, error);
      throw error;
    }
  },

  /**
   * Xuất bản hoặc hủy xuất bản khóa học (admin/content manager)
   * 
   * @param {Number} courseId - ID của khóa học
   * @param {Boolean} isPublished - Trạng thái xuất bản
   * @returns {Object} Thông tin khóa học đã cập nhật
   */
  publishCourse: async (courseId, isPublished) => {
    try {
  const response = await api.put(`/api/v1/courses/${courseId}/publish`, null, {
        params: { isPublished }
      });
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi ${isPublished ? 'xuất bản' : 'hủy xuất bản'} khóa học ID=${courseId}:`, error);
      throw error;
    }
  },

  /**
   * Quản lý chương học (Section)
   */
  
  /**
   * Lấy danh sách chương học của một khóa học
   * 
   * @param {Number} courseId - ID của khóa học
   * @returns {Array} Danh sách chương học
   */
  getSectionsByCourseId: async (courseId) => {
    try {
  const response = await api.get(`/api/v1/sections/course/${courseId}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy danh sách chương học của khóa học ID=${courseId}:`, error);
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết một chương học theo ID
   * 
   * @param {Number} sectionId - ID của chương học
   * @returns {Object} Thông tin chi tiết chương học
   */
  getSectionById: async (sectionId) => {
    try {
  const response = await api.get(`/api/v1/sections/${sectionId}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin chương học ID=${sectionId}:`, error);
      throw error;
    }
  },

  /**
   * Tạo chương học mới (admin/teacher)
   * 
   * @param {Object} sectionData - Dữ liệu chương học (SectionCreateRequest)
   * @returns {Object} Thông tin chương học đã tạo
   */
  createSection: async (sectionData) => {
    try {
  const response = await api.post(`/api/v1/sections`, sectionData);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi tạo chương học mới:`, error);
      throw error;
    }
  },

  /**
   * Cập nhật thông tin chương học (admin/teacher)
   * 
   * @param {Number} sectionId - ID của chương học
   * @param {Object} sectionData - Dữ liệu cập nhật
   * @returns {Object} Thông tin chương học đã cập nhật
   */
  updateSection: async (sectionId, sectionData) => {
    try {
  const response = await api.put(`/api/v1/sections/${sectionId}`, sectionData);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật chương học ID=${sectionId}:`, error);
      throw error;
    }
  },

  /**
   * Xóa một chương học (admin/teacher)
   * 
   * @param {Number} sectionId - ID của chương học cần xóa
   * @returns {Boolean} Kết quả xóa
   */
  deleteSection: async (sectionId) => {
    try {
  await api.delete(`/api/v1/sections/${sectionId}`);
      return true;
    } catch (error) {
      console.error(`Lỗi khi xóa chương học ID=${sectionId}:`, error);
      throw error;
    }
  },

  /**
   * Quản lý bài học (Lesson)
   */
  
  /**
   * Lấy danh sách bài học của một chương
   * 
   * @param {Number} sectionId - ID của chương học
   * @returns {Array} Danh sách bài học
   */
  getLessonsBySectionId: async (sectionId) => {
    try {
  const response = await api.get(`/api/v1/lessons/section/${sectionId}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy danh sách bài học của chương ID=${sectionId}:`, error);
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết một bài học
   * 
   * @param {Number} lessonId - ID của bài học
   * @returns {Object} Thông tin chi tiết bài học
   */
  getLessonById: async (lessonId) => {
    try {
  const response = await api.get(`/api/v1/lessons/${lessonId}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin bài học ID=${lessonId}:`, error);
      throw error;
    }
  },

  /**
   * Tạo bài học mới (admin/teacher)
   * 
   * @param {Object} lessonData - Dữ liệu bài học (LessonCreateRequest)
   * @returns {Object} Thông tin bài học đã tạo
   */
  createLesson: async (lessonData) => {
    try {
  const response = await api.post(`/api/v1/lessons`, lessonData);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi tạo bài học mới:`, error);
      throw error;
    }
  },

  /**
   * Cập nhật thông tin bài học (admin/teacher)
   * 
   * @param {Number} lessonId - ID của bài học
   * @param {Object} lessonData - Dữ liệu cập nhật (LessonUpdateRequest)
   * @returns {Object} Thông tin bài học đã cập nhật
   */
  updateLesson: async (lessonId, lessonData) => {
    try {
  const response = await api.put(`/api/v1/lessons/${lessonId}`, lessonData);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật bài học ID=${lessonId}:`, error);
      throw error;
    }
  },

  /**
   * Xóa một bài học (admin/teacher)
   * 
   * @param {Number} lessonId - ID của bài học cần xóa
   * @returns {Boolean} Kết quả xóa
   */
  deleteLesson: async (lessonId) => {
    try {
  await api.delete(`/api/v1/lessons/${lessonId}`);
      return true;
    } catch (error) {
      console.error(`Lỗi khi xóa bài học ID=${lessonId}:`, error);
      throw error;
    }
  },

  /**
   * Đánh dấu một bài học đã hoàn thành
   * 
   * @param {Number} courseId - ID của khóa học
   * @param {Number} lessonId - ID của bài học
   * @returns {Object} Thông tin tiến độ học tập
   */
  completeLesson: async (courseId, lessonId) => {
    try {
  const response = await api.post(`/api/v1/courses/${courseId}/lessons/${lessonId}/complete`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi đánh dấu hoàn thành bài học ID=${lessonId}:`, error);
      throw error;
    }
  },

  /**
   * Quản lý đăng ký khóa học (Enrollment)
   */
  
  /**
   * Đăng ký một khóa học
   * 
   * @param {Number} courseId - ID của khóa học
   * @param {Number} userId - ID của người dùng (optional, lấy từ token nếu không có)
   * @returns {Object} Thông tin đăng ký
   */
  enrollCourse: async (courseId, userId = null) => {
    try {
      const enrollmentData = { courseId };
      if (userId) {
        enrollmentData.userId = userId;
      }
  const response = await api.post(`/api/v1/enrollments`, enrollmentData);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi đăng ký khóa học ID=${courseId}:`, error);
      throw error;
    }
  },

  /**
   * Hủy đăng ký khóa học
   * 
   * @param {Number} enrollmentId - ID của đăng ký
   * @returns {Boolean} Kết quả hủy đăng ký
   */
  cancelEnrollment: async (enrollmentId) => {
    try {
  await api.delete(`/api/v1/enrollments/${enrollmentId}`);
      return true;
    } catch (error) {
      console.error(`Lỗi khi hủy đăng ký ID=${enrollmentId}:`, error);
      throw error;
    }
  },

  /**
   * Lấy danh sách khóa học đã đăng ký của người dùng hiện tại
   * 
   * @param {Number} userId - ID người dùng (optional, lấy từ token nếu không có)
   * @returns {Array} Danh sách đăng ký khóa học
   */
  getUserEnrollments: async (userId = null) => {
    try {
      const url = userId ? `/api/enrollments/user/${userId}` : '/api/enrollments/my-enrollments';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy danh sách khóa học đã đăng ký:", error);
      throw error;
    }
  },

  /**
   * Lấy danh sách học viên đăng ký một khóa học (admin/teacher)
   * 
   * @param {Number} courseId - ID của khóa học
   * @param {Number} page - Số trang, bắt đầu từ 0
   * @param {Number} size - Số lượng bản ghi trên một trang
   * @returns {Object} Danh sách đăng ký có phân trang
   */
  getCourseEnrollments: async (courseId, page = 0, size = 10) => {
    try {
      const response = await api.get(`/api/enrollments/course/${courseId}`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy danh sách học viên của khóa học ID=${courseId}:`, error);
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết một đăng ký
   * 
   * @param {Number} enrollmentId - ID của đăng ký
   * @returns {Object} Thông tin chi tiết đăng ký
   */
  getEnrollmentById: async (enrollmentId) => {
    try {
      const response = await api.get(`/api/enrollments/${enrollmentId}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin đăng ký ID=${enrollmentId}:`, error);
      throw error;
    }
  },

  /**
   * Cập nhật tiến độ học tập
   * 
   * @param {Number} enrollmentId - ID của đăng ký
   * @param {Number} progress - Phần trăm tiến độ (0-100)
   * @returns {Object} Thông tin đăng ký đã cập nhật
   */
  updateEnrollmentProgress: async (enrollmentId, progress) => {
    try {
      const response = await api.patch(`/api/enrollments/${enrollmentId}/progress`, { progress });
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật tiến độ cho đăng ký ID=${enrollmentId}:`, error);
      throw error;
    }
  },

  /**
   * Kiểm tra người dùng đã đăng ký khóa học chưa
   * 
   * @param {Number} userId - ID của người dùng
   * @param {Number} courseId - ID của khóa học
   * @returns {Boolean} Trạng thái đăng ký
   */
  isUserEnrolledInCourse: async (userId, courseId) => {
    try {
      const response = await api.get(`/api/enrollments/check`, {
        params: { userId, courseId }
      });
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi kiểm tra đăng ký khóa học:`, error);
      return false;
    }
  },

  /**
   * Quản lý đánh giá khóa học (Review)
   */
  
  /**
   * Lấy danh sách đánh giá của một khóa học
   * 
   * @param {Number} courseId - ID của khóa học
   * @param {Number} page - Số trang, bắt đầu từ 0
   * @param {Number} size - Số lượng bản ghi trên một trang
   * @returns {Object} Danh sách đánh giá có phân trang
   */
  getCourseReviews: async (courseId, page = 0, size = 10) => {
    try {
  const response = await api.get(`/api/v1/reviews/course/${courseId}`, {
        params: { page, size }
      });
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy danh sách đánh giá của khóa học ID=${courseId}:`, error);
      throw error;
    }
  },

  /**
   * Thêm đánh giá mới cho khóa học
   * 
   * @param {Number} userId - ID của người dùng
   * @param {Object} reviewData - Dữ liệu đánh giá {courseId, rating, comment}
   * @returns {Object} Thông tin đánh giá đã tạo
   */
  addReview: async (userId, reviewData) => {
    try {
  const response = await api.post(`/api/v1/reviews/user/${userId}`, reviewData);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi thêm đánh giá cho khóa học ID=${reviewData.courseId}:`, error);
      throw error;
    }
  },

  /**
   * Cập nhật đánh giá
   * 
   * @param {Number} reviewId - ID của đánh giá
   * @param {Object} reviewData - Dữ liệu đánh giá cập nhật {courseId, rating, comment}
   * @returns {Object} Thông tin đánh giá đã cập nhật
   */
  updateReview: async (reviewId, reviewData) => {
    try {
  const response = await api.put(`/api/v1/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi cập nhật đánh giá ID=${reviewId}:`, error);
      throw error;
    }
  },

  /**
   * Xóa đánh giá
   * 
   * @param {Number} reviewId - ID của đánh giá cần xóa
   * @returns {Boolean} Kết quả xóa
   */
  deleteReview: async (reviewId) => {
    try {
  await api.delete(`/api/v1/reviews/${reviewId}`);
      return true;
    } catch (error) {
      console.error(`Lỗi khi xóa đánh giá ID=${reviewId}:`, error);
      throw error;
    }
  },

  /**
   * Lấy thông tin chi tiết một đánh giá
   * 
   * @param {Number} reviewId - ID của đánh giá
   * @returns {Object} Thông tin chi tiết đánh giá
   */
  getReviewById: async (reviewId) => {
    try {
  const response = await api.get(`/api/v1/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy thông tin đánh giá ID=${reviewId}:`, error);
      throw error;
    }
  },
  
  /**
   * Lấy điểm đánh giá trung bình của khóa học
   * 
   * @param {Number} courseId - ID của khóa học
   * @returns {Number} Điểm đánh giá trung bình
   */
  getAverageCourseRating: async (courseId) => {
    try {
  const response = await api.get(`/api/v1/reviews/course/${courseId}/average`);
      return response.data;
    } catch (error) {
      console.error(`Lỗi khi lấy điểm đánh giá trung bình của khóa học ID=${courseId}:`, error);
      return 0; // Trả về 0 nếu có lỗi
    }
  }
};

export default courseService;
