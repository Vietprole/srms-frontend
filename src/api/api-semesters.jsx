import axios from "axios";
import API_BASE_URL from "./base-url";
import { getAccessToken } from "../utils/storage";

const API_SEMESTERS = `${API_BASE_URL}/api/semesters`;

const getAuthHeader = () => ({
  headers: {
    Authorization: getAccessToken(),
  },
});

// Lấy toàn bộ học kỳ
export const getAllSemesters = async () => {
  const res = await axios.get(API_SEMESTERS, getAuthHeader());
  return res.data;
};

// Lấy học kỳ theo ID
export const getSemesterById = async (id) => {
  const res = await axios.get(`${API_SEMESTERS}/${id}`, getAuthHeader());
  return res.data;
};

// Tạo học kỳ mới
export const createSemester = async (data) => {
  const res = await axios.post(API_SEMESTERS, data, getAuthHeader());
  return res.data;
};

// Cập nhật học kỳ
export const updateSemester = async (id, data) => {
  const res = await axios.put(`${API_SEMESTERS}/${id}`, data, getAuthHeader());
  return res.data;
};

// Xóa học kỳ
export const deleteSemester = async (id) => {
  const res = await axios.delete(`${API_SEMESTERS}/${id}`, getAuthHeader());
  return res.status === 204;
};
