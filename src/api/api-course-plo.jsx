import axios from "axios";
import API_BASE_URL from "./base-url";
import { getAccessToken } from "../utils/storage";

const API_COURSE_PLOS = `${API_BASE_URL}/api/course-plos`;

const getAuthHeader = () => ({
  headers: {
    Authorization: getAccessToken(),
  },
});

/**
 * Lấy danh sách liên kết Course - PLO (có thể lọc theo programmeId)
 * @param {Object} filters - { programmeId?: number }
 */
export const getCoursePLOs = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, value);
      }
    });

    const url = params.toString()
      ? `${API_COURSE_PLOS}?${params.toString()}`
      : API_COURSE_PLOS;

    const response = await axios.get(url, getAuthHeader());
    return response.data; // [{ courseId, ploId, weight }, ...]
  } catch (error) {
    console.error("getCoursePLOs error:", error);
    throw new Error(error.response?.data || "Lỗi khi lấy danh sách Course - PLO");
  }
};

/**
 * Upsert (thêm, cập nhật hoặc xoá) liên kết Course - PLO
 * Nếu weight = null => backend sẽ xử lý xoá
 * @param {Object} data - { courseId, ploId, weight }
 */
export const upsertCoursePLO = async (data) => {
  try {
    const response = await axios.put(API_COURSE_PLOS, data, getAuthHeader());
    return response; // Trả về CourseDTO có kèm weight
  } catch (error) {
    console.error("upsertCoursePLO error:", error);
    throw new Error(error.response?.data || "Lỗi khi cập nhật Course - PLO");
  }
};
