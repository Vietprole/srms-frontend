import axios from "axios";
import API_BASE_URL from "./base-url";
import { getAccessToken } from "../utils/storage";

const API_STUDENTS = `${API_BASE_URL}/api/students`;

const getAuthHeader = () => ({
  headers: {
    Authorization: getAccessToken(),
  },
});

// Lấy danh sách sinh viên có thể lọc theo facultyId, programmeId, classId
export const getAllStudents = async (params = {}) => {
  const res = await axios.get(API_STUDENTS, {
    ...getAuthHeader(),
    params,
  });
  return res.data;
};

// Lấy sinh viên theo ID
export const getStudentById = async (id) => {
  const res = await axios.get(`${API_STUDENTS}/${id}`, getAuthHeader());
  return res.data;
};

// Tạo sinh viên mới
export const createStudent = async (data) => {
  const res = await axios.post(API_STUDENTS, data, getAuthHeader());
  return res;
};

// Cập nhật thông tin sinh viên
export const updateStudent = async (id, data) => {
  const res = await axios.put(`${API_STUDENTS}/${id}`, data, getAuthHeader());
  return res;
};

// Xóa sinh viên
export const deleteStudent = async (id) => {
  const res = await axios.delete(`${API_STUDENTS}/${id}`, getAuthHeader());
  return res.status === 204;
};
