import API_BASE_URL from "./base-url";
import axios from "axios";
import { getAccessToken } from "../utils/storage";

const API_COURSE_PI = `${API_BASE_URL}/api/course-pis`;

const getAuthHeader = () => ({
  headers: {
    Authorization: getAccessToken()
  }
});

/**
 * Lấy danh sách liên kết Course - PI, có thể lọc theo programmeId
 * @param {Object} filters - { programmeId?: number }
 */
export const getCoursePIs = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, value);
      }
    });

    const url = params.toString()
      ? `${API_COURSE_PI}?${params}`
      : API_COURSE_PI;

    const response = await axios.get(url, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("getCoursePIs error:", error);
    throw new Error(error.response?.data || "Lỗi khi lấy danh sách Course - PI");
  }
};

/**
 * Thêm hoặc cập nhật liên kết Course - PI
 * @param {Object} updateCoursePIDTO - { courseId, piId, weight }
 */
export const upsertCoursePI = async (updateCoursePIDTO) => {
  try {
    const response = await axios.put(API_COURSE_PI, updateCoursePIDTO, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("upsertCoursePI error:", error);
    throw new Error(error.response?.data || "Lỗi khi cập nhật Course - PI");
  }
};
