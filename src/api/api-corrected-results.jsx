import API_BASE_URL from "./base-url";
import axios from "axios";
import { getAccessToken } from "../utils/storage";

const API_CORRECTED_RESULTS = `${API_BASE_URL}/api/corrected-results`;

const getAuthHeader = () => ({
  headers: {
    Authorization: getAccessToken()
  }
});

/**
 * Lấy danh sách điểm đính chính có thể lọc theo classId và teacherId
 */
export const getCorrectedResults = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, value);
      }
    });

    const url = params.toString()
      ? `${API_CORRECTED_RESULTS}?${params}`
      : API_CORRECTED_RESULTS;

    const response = await axios.get(url, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("getCorrectedResults error:", error);
    throw new Error(error.response?.data || "Lỗi khi tải danh sách điểm đính chính");
  }
};

/**
 * Lấy chi tiết điểm đính chính theo ID
 */
export const getCorrectedResultById = async (id) => {
  try {
    const response = await axios.get(`${API_CORRECTED_RESULTS}/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("getCorrectedResultById error:", error);
    throw new Error(error.response?.data || "Không tìm thấy điểm đính chính");
  }
};

/**
 * Tạo mới điểm đính chính
 */
export const createCorrectedResult = async (data) => {
  try {
    const response = await axios.post(API_CORRECTED_RESULTS, data, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("createCorrectedResult error:", error);
    throw new Error(error.response?.data || "Lỗi khi tạo điểm đính chính");
  }
};

/**
 * Cập nhật điểm đính chính
 */
export const updateCorrectedResult = async (id, data) => {
  try {
    const response = await axios.put(`${API_CORRECTED_RESULTS}/${id}`, data, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("updateCorrectedResult error:", error);
    throw new Error(error.response?.data || "Lỗi khi cập nhật điểm đính chính");
  }
};

/**
 * Upsert (tạo mới nếu chưa có, cập nhật nếu đã có) điểm đính chính
 */
export const upsertCorrectedResult = async (data) => {
  try {
    const response = await axios.put(`${API_CORRECTED_RESULTS}/upsert`, data, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("upsertCorrectedResult error:", error);
    throw new Error(error.response?.data || "Lỗi khi thực hiện upsert điểm đính chính");
  }
};

/**
 * Xoá điểm đính chính
 */
export const deleteCorrectedResult = async (id) => {
  try {
    await axios.delete(`${API_CORRECTED_RESULTS}/${id}`, getAuthHeader());
  } catch (error) {
    console.error("deleteCorrectedResult error:", error);
    throw new Error(error.response?.data || "Lỗi khi xoá điểm đính chính");
  }
};

/**
 * Chấp nhận điểm đính chính
 */
export const acceptCorrectedResult = async (id) => {
  try {
    const response = await axios.post(`${API_CORRECTED_RESULTS}/${id}/accept`, {}, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("acceptCorrectedResult error:", error);
    throw new Error(error.response?.data || "Lỗi khi duyệt điểm đính chính");
  }
};
