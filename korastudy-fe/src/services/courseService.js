import axiosClient from '../api/axiosClient';

const unwrap = (response) => response?.data?.result ?? response?.data;

export const getAllCourses = async (params = {}) => {
  const response = await axiosClient.get('/api/v1/courses', { params });
  return unwrap(response);
};

export const getCourseById = async (id) => {
  const response = await axiosClient.get(`/api/v1/courses/${id}`);
  return unwrap(response);
};

export const getLessonContent = async (id) => {
  const response = await axiosClient.get(`/api/v1/lessons/${id}`);
  return unwrap(response);
};

export default {
  getAllCourses,
  getCourseById,
  getLessonContent,
};
