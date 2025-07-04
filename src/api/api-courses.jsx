import API_BASE_URL from "./base-url";
import axios from "axios";
import { getAccessToken } from "../utils/storage";

const API_COURSES = `${API_BASE_URL}/api/courses`;

const getAuthHeader = () => ({
  headers: {
    Authorization: getAccessToken()
  }
});

/**
 * Lấy danh sách học phần, có thể lọc theo facultyId, programmeId, piId, v.v...
 */
export const getCourses = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, value);
      }
    });

    const url = params.toString()
      ? `${API_COURSES}?${params}`
      : API_COURSES;

    const response = await axios.get(url, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("getCourses error:", error);
    throw new Error(error.response?.data || "Lỗi khi tải danh sách học phần");
  }
};

/**
 * Lấy học phần theo ID
 */
export const getCourseById = async (id) => {
  try {
    const response = await axios.get(`${API_COURSES}/${id}`, getAuthHeader());
    return response;
  } catch (error) {
    console.error("getCourseById error:", error);
    throw new Error(error.response?.data || "Không tìm thấy học phần");
  }
};

/**
 * Tạo học phần mới
 */
export const createCourse = async (courseData) => {
  try {
    const response = await axios.post(API_COURSES, courseData, getAuthHeader());
    return response;
  } catch (error) {
    console.error("createCourse error:", error);
    throw new Error(error.response?.data || "Lỗi khi tạo học phần");
  }
};

/**
 * Cập nhật học phần
 */
export const updateCourse = async (id, courseData) => {
  try {
    const response = await axios.put(`${API_COURSES}/${id}`, courseData, getAuthHeader());
    return response;
  } catch (error) {
    console.error("updateCourse error:", error);
    throw new Error(error.response?.data || "Lỗi khi cập nhật học phần");
  }
};

/**
 * Xoá học phần
 */
export const deleteCourse = async (id) => {
  try {
    await axios.delete(`${API_COURSES}/${id}`, getAuthHeader());
  } catch (error) {
    console.error("deleteCourse error:", error);
    throw new Error(error.response?.data || "Lỗi khi xoá học phần");
  }
};
