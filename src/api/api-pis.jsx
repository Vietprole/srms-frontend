import axios from "axios";
import API_BASE_URL from "./base-url";
import { getAccessToken } from "../utils/storage";

const API_PIS = `${API_BASE_URL}/api/pis`;

const getAuthHeader = () => ({
  headers: {
    Authorization: getAccessToken()
  }
});

/**
 * Lấy danh sách PI có thể lọc theo ploId, programmeId, courseId, classId
 */
export const getPIs = async ({ ploId, programmeId, courseId, classId }) => {
  try {
    const params = new URLSearchParams();
    if (ploId) params.append("ploId", ploId);
    if (programmeId) params.append("programmeId", programmeId);
    if (courseId) params.append("courseId", courseId);
    if (classId) params.append("classId", classId);

    const url = `${API_PIS}?${params.toString()}`;
    const response = await axios.get(url, getAuthHeader());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Lỗi khi lấy danh sách PI");
  }
};

/**
 * Lấy thông tin PI theo ID
 */
export const getPIById = async (id) => {
  try {
    const response = await axios.get(`${API_PIS}/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Không tìm thấy PI");
  }
};

/**
 * Tạo mới PI
 */
export const createPI = async (data) => {
  try {
    const response = await axios.post(API_PIS, data, getAuthHeader());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Lỗi khi tạo PI");
  }
};

/**
 * Cập nhật PI
 */
export const updatePI = async (id, data) => {
  try {
    const response = await axios.put(`${API_PIS}/${id}`, data, getAuthHeader());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Lỗi khi cập nhật PI");
  }
};

/**
 * Xoá PI
 */
export const deletePI = async (id) => {
  try {
    await axios.delete(`${API_PIS}/${id}`, getAuthHeader());
  } catch (error) {
    throw new Error(error.response?.data || "Lỗi khi xoá PI");
  }
};

/**
 * Lấy danh sách CLO của PI
 */
export const getCLOsOfPI = async (piId) => {
  try {
    const response = await axios.get(`${API_PIS}/${piId}/clos`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Lỗi khi lấy CLO của PI");
  }
};

/**
 * Lấy danh sách Course của PI
 */
export const getCoursesOfPI = async (piId) => {
  try {
    const response = await axios.get(`${API_PIS}/${piId}/courses`, getAuthHeader());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Lỗi khi lấy học phần của PI");
  }
};

/**
 * Cập nhật CLOs gắn với một PI
 */
export const updateCLOsOfPI = async (piId, cloIds) => {
  try {
    const response = await axios.put(`${API_PIS}/${piId}/clos`, cloIds, getAuthHeader());
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Lỗi khi cập nhật CLOs của PI");
  }
};
