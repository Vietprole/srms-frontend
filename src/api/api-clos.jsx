import API_BASE_URL from "./base-url";
import axios from "axios";
import { getAccessToken } from "../utils/storage";

const API_CLOS = `${API_BASE_URL}/api/clos`;

const getAuthHeader = () => ({
  headers: {
    Authorization: getAccessToken(),
  },
});

/**
 * Lấy tất cả CLO có thể lọc theo: courseId, questionId, piId, classId
 */
export const getAllCLOs = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, value);
      }
    });

    const url = params.toString() ? `${API_CLOS}?${params}` : API_CLOS;
    const response = await axios.get(url, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("getAllCLOs error:", error);
    throw new Error(error.response?.data || "Lỗi khi tải danh sách CLO");
  }
};

/**
 * Lấy CLO theo ID
 */
export const getCLOById = async (id) => {
  try {
    const response = await axios.get(`${API_CLOS}/${id}`, getAuthHeader());
    return response;
  } catch (error) {
    console.error("getCLOById error:", error);
    throw new Error(error.response?.data || "Không tìm thấy CLO");
  }
};

/**
 * Tạo CLO mới
 */
export const createCLO = async (cloData) => {
  try {
    const response = await axios.post(API_CLOS, cloData, getAuthHeader());
    return response;
  } catch (error) {
    console.error("createCLO error:", error);
    throw new Error(error.response?.data || "Lỗi khi tạo CLO");
  }
};

/**
 * Cập nhật CLO
 */
export const updateCLO = async (id, updateData) => {
  try {
    const response = await axios.put(`${API_CLOS}/${id}`, updateData, getAuthHeader());
    return response;
  } catch (error) {
    console.error("updateCLO error:", error);
    throw new Error(error.response?.data || "Lỗi khi cập nhật CLO");
  }
};

/**
 * Xoá CLO
 */
export const deleteCLO = async (id) => {
  try {
    const response = await axios.delete(`${API_CLOS}/${id}`, getAuthHeader());
    return response.status; // trả về mã status
  } catch (error) {
    console.error("deleteCLO error:", error);
    throw new Error(error.response?.data || "Lỗi khi xoá CLO");
  }
};

