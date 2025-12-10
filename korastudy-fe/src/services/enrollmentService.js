import axiosClient from '../api/axiosClient';

const unwrap = (response) => response?.data ?? null;

/**
 * Đăng ký khóa học
 * @param {number} courseId - ID khóa học
 * @param {number} userId - ID người dùng
 * @returns {Promise} Enrollment object
 */
export const enrollCourse = async (courseId, userId) => {
  const response = await axiosClient.post('/api/v1/enrollments', {
    courseId,
    userId,
  });
  return unwrap(response);
};

/**
 * Kiểm tra đã đăng ký khóa học chưa
 * @param {number} userId - ID người dùng
 * @param {number} courseId - ID khóa học
 * @returns {Promise<boolean>} True nếu đã đăng ký
 */
export const checkEnrollment = async (userId, courseId) => {
  const response = await axiosClient.get('/api/v1/enrollments/check', {
    params: { userId, courseId },
  });
  return unwrap(response);
};

/**
 * Lấy thông tin enrollment theo ID
 * @param {number} enrollmentId
 * @returns {Promise} Enrollment object
 */
export const getEnrollmentById = async (enrollmentId) => {
  const response = await axiosClient.get(`/api/v1/enrollments/${enrollmentId}`);
  return unwrap(response);
};

/**
 * Lấy danh sách enrollments theo khóa học
 * @param {number} courseId
 * @returns {Promise<Array>} Danh sách enrollments
 */
export const getEnrollmentsByCourse = async (courseId) => {
  const response = await axiosClient.get(`/api/v1/enrollments/course/${courseId}`);
  return unwrap(response);
};

/**
 * Cập nhật tiến độ học tập
 * @param {number} enrollmentId
 * @param {number} progress - Tiến độ (0-100)
 * @returns {Promise} Enrollment object đã cập nhật
 */
export const updateProgress = async (enrollmentId, progress) => {
  const response = await axiosClient.put(
    `/api/v1/enrollments/${enrollmentId}/progress`,
    null,
    { params: { progress } }
  );
  return unwrap(response);
};

/**
 * Hủy đăng ký khóa học
 * @param {number} enrollmentId
 * @returns {Promise}
 */
export const cancelEnrollment = async (enrollmentId) => {
  const response = await axiosClient.delete(`/api/v1/enrollments/${enrollmentId}`);
  return unwrap(response);
};

export default {
  enrollCourse,
  checkEnrollment,
  getEnrollmentById,
  getEnrollmentsByCourse,
  updateProgress,
  cancelEnrollment,
};
