import axios from "axios";
import API_BASE_URL from "./base-url";
import { getAccessToken } from "../utils/storage";

const API_PLOS = `${API_BASE_URL}/api/plos`;

const getAuthHeader = () => ({
  headers: {
    Authorization: getAccessToken()
  }
});

/**
 * Lấy danh sách PLO, có thể lọc theo programmeId hoặc classId
 */
export const getPLOs = async ({ programmeId, classId }) => {
  try {
    const params = new URLSearchParams();
    if (programmeId) params.append("programmeId", programmeId);
    if (classId) params.append("classId", classId);

    const url = `${API_PLOS}?${params.toString()}`;
    const response = await axios.get(url, getAuthHeader());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Lỗi khi lấy danh sách PLO");
  }
};

/**
 * Lấy chi tiết PLO theo id
 */
export const getPLOById = async (id) => {
  try {
    const response = await axios.get(`${API_PLOS}/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Không tìm thấy PLO");
  }
};

/**
 * Tạo mới một PLO
 */
export const createPLO = async (data) => {
  try {
    const response = await axios.post(API_PLOS, data, getAuthHeader());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Lỗi khi tạo PLO");
  }
};

/**
 * Cập nhật PLO theo id
 */
export const updatePLO = async (id, data) => {
  try {
    const response = await axios.put(`${API_PLOS}/${id}`, data, getAuthHeader());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Lỗi khi cập nhật PLO");
  }
};

/**
 * Xoá một PLO
 */
export const deletePLO = async (id) => {
  try {
    await axios.delete(`${API_PLOS}/${id}`, getAuthHeader());
  } catch (error) {
    throw new Error(error.response?.data || "Lỗi khi xoá PLO");
  }
};
