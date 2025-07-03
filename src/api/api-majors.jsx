import axios from "axios";
import API_BASE_URL from "./base-url";
import { getAccessToken } from "../utils/storage";

const API_MAJORS = `${API_BASE_URL}/api/majors`;

const getAuthHeader = () => ({
  headers: {
    Authorization: getAccessToken()
  }
});

/**
 * Lấy danh sách ngành, có thể lọc theo facultyId và phân trang
 */
export const getMajors = async ({ facultyId, pageNumber, pageSize } = {}) => {
  try {
    const params = new URLSearchParams();
    if (facultyId) params.append("facultyId", facultyId);
    if (pageNumber) params.append("pageNumber", pageNumber);
    if (pageSize) params.append("pageSize", pageSize);

    const url = `${API_MAJORS}?${params.toString()}`;
    const response = await axios.get(url, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("getMajors error:", error);
    throw new Error(error.response?.data || "Lỗi khi lấy danh sách ngành");
  }
};


/**
 * Lấy chi tiết ngành theo id
 */
export const getMajorById = async (id) => {
  try {
    const response = await axios.get(`${API_MAJORS}/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("getMajorById error:", error);
    throw new Error(error.response?.data || "Không tìm thấy ngành");
  }
};

/**
 * Tạo mới ngành
 */
export const createMajor = async (majorData) => {
  try {
    const response = await axios.post(API_MAJORS, majorData, getAuthHeader());
    return response;
  } catch (error) {
    console.error("createMajor error:", error);
    throw new Error(error.response?.data || "Lỗi khi tạo ngành");
  }
};

/**
 * Cập nhật ngành
 */
export const updateMajor = async (id, majorData) => {
  try {
    const response = await axios.put(`${API_MAJORS}/${id}`, majorData, getAuthHeader());
    return response;
  } catch (error) {
    console.error("updateMajor error:", error);
    throw new Error(error.response?.data || "Lỗi khi cập nhật ngành");
  }
};

/**
 * Xoá ngành
 */
export const deleteMajor = async (id) => {
  try {
    await axios.delete(`${API_MAJORS}/${id}`, getAuthHeader());
  } catch (error) {
    console.error("deleteMajor error:", error);
    throw new Error(error.response?.data || "Lỗi khi xoá ngành");
  }
};
