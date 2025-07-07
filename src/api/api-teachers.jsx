import axios from "axios";
import API_BASE_URL from "./base-url";
import { getAccessToken } from "../utils/storage";

const API_TEACHERS = `${API_BASE_URL}/api/teachers`;

const getAuthHeader = () => ({
  headers: {
    Authorization: getAccessToken(),
  },
});

// Lấy danh sách giảng viên, có thể lọc theo workUnitId hoặc classId
export const getAllTeachers = async (params = {}) => {
  const res = await axios.get(API_TEACHERS, {
    ...getAuthHeader(),
    params,
  });
  return res.data;
};

// Lấy giảng viên theo ID
export const getTeacherById = async (id) => {
  const res = await axios.get(`${API_TEACHERS}/${id}`, getAuthHeader());
  return res.data;
};

// Tạo mới giảng viên
export const createTeacher = async (data) => {
  const res = await axios.post(API_TEACHERS, data, getAuthHeader());
  return res;
};

// Cập nhật giảng viên
export const updateTeacher = async (id, data) => {
  const res = await axios.put(`${API_TEACHERS}/${id}`, data, getAuthHeader());
  return res;
};

// Xoá giảng viên
export const deleteTeacher = async (id) => {
  const res = await axios.delete(`${API_TEACHERS}/${id}`, getAuthHeader());
  return res.status === 204;
};
