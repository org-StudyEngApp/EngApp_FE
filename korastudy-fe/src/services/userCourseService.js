import axios from 'axios';
import axiosClient from '../api/axiosClient';

const unwrap = (response) => response?.data ?? null;

// Map lesson theo yêu cầu
const mapLesson = (lesson) => ({
  lessonId: lesson.id || lesson.lessonId,
  title: lesson.title || lesson.lessonTitle,
  duration: lesson.duration || 0, // giây
  isTrial: lesson.isTrial || lesson.trial || false, // QUAN TRỌNG: true = học thử, false = khóa
  type: lesson.contentType || lesson.type || lesson.lessonType || 'VIDEO', // VIDEO, TEXT, QUIZ
  videoUrl: lesson.videoUrl || lesson.video_url,
  content: lesson.content || lesson.lessonContent,
});

// Map section theo yêu cầu
const mapSection = (section) => ({
  sectionId: section.id || section.sectionId,
  title: section.title || section.sectionTitle || section.sectionName,
  lessons: Array.isArray(section.lessons) ? section.lessons.map(mapLesson) : [],
});

// Map course theo yêu cầu JSON Model
const mapCourse = (course) => ({
  courseId: course.id || course.courseId,
  title: course.courseName || course.title,
  description: course.courseDescription || course.description,
  price: course.coursePrice || course.price || 0,
  thumbnailUrl: course.courseImageUrl || course.thumbnailUrl || course.image,
  totalStudents: course.totalStudents || 0,
  averageRating: course.averageRating || 0,
  // Sections chỉ có trong chi tiết khóa học
  sections: Array.isArray(course.sections) ? course.sections.map(mapSection) : [],
  // Giữ lại các field bổ sung (không bắt buộc)
  level: course.courseLevel || course.level,
  free: course.free,
  published: course.published,
  createdAt: course.createdAt,
  viewCount: course.viewCount,
});

export const getPublicCourses = async () => {
  const response = await axiosClient.get('/api/v1/courses');
  const data = unwrap(response);
  if (!Array.isArray(data)) {
    return [];
  }
  return data.map(mapCourse);
};

export const getCourseDetail = async (id) => {
  const response = await axiosClient.get(`/api/v1/courses/${id}`);
  const data = unwrap(response);
  return data ? mapCourse(data) : null;
};

export const getLessonContent = async (id, options = {}) => {
  const { skipAuth = false } = options;
  
  // Kiểm tra token
  const token = localStorage.getItem('accessToken');
  
  // Nếu skipAuth = true (bài học trial) và không có token, gọi API không auth
  if (skipAuth && !token) {
    try {
      // Gọi axios trực tiếp không qua interceptor để tránh thêm header Authorization
      const response = await axios.get(`http://localhost:8080/api/v1/lessons/${id}`);
      const rawData = response?.data ?? null;
      if (!rawData) return null;
      
      return {
        lessonId: rawData.id || rawData.lessonId,
        title: rawData.title || rawData.lessonTitle,
        videoUrl: rawData.videoUrl || rawData.video_url,
        content: rawData.content || rawData.lessonContent,
        type: rawData.contentType || rawData.type || rawData.lessonType || 'VIDEO',
        duration: rawData.duration || 0,
      };
    } catch (error) {
      throw error;
    }
  }
  
  // Gọi API bình thường với token (nếu có)
  const response = await axiosClient.get(`/api/v1/lessons/${id}`);
  const rawData = unwrap(response);
  if (!rawData) return null;
  
  // Map lesson content theo yêu cầu
  return {
    lessonId: rawData.id || rawData.lessonId,
    title: rawData.title || rawData.lessonTitle,
    videoUrl: rawData.videoUrl || rawData.video_url, // Chỉ trả về nếu đã mua hoặc isTrial=true
    content: rawData.content || rawData.lessonContent,
    type: rawData.contentType || rawData.type || rawData.lessonType || 'VIDEO',
    duration: rawData.duration || 0,
  };
};

// Lấy danh sách khóa học đã đăng ký của user
export const getMyCourses = async () => {
  const response = await axiosClient.get('/api/v1/enrollments/my-courses');
  const data = unwrap(response);
  if (!Array.isArray(data)) {
    return [];
  }
  // Trả về data đã được format từ backend
  return data.map(course => ({
    courseId: course.courseId,
    title: course.title,
    thumbnailUrl: course.thumbnailUrl,
    totalLessons: course.totalLessons || 0,
    completedLessons: course.completedLessons || 0,
    progressPercentage: course.progressPercentage || 0,
    enrolledAt: course.enrolledAt,
    lastLessonId: course.lastLessonId || null, // ID của bài học cuối cùng đã học
  }));
};

export default {
  getPublicCourses,
  getCourseDetail,
  getLessonContent,
  getMyCourses,
};
