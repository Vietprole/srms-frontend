import API_BASE_URL from "./base-url";
import axios from 'axios';
import { getAccessToken } from "../utils/storage";

const API_FACULTIES = `${API_BASE_URL}/api/faculties`;

// ✅ GET all faculties
export const getAllFaculties = async () => {
  try {
    const response = await axios.get(API_FACULTIES, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.error("getAllFaculties:", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// ✅ GET faculty by ID
export const getFacultyById = async (facultyId) => {
  try {
    const response = await axios.get(`${API_FACULTIES}/${facultyId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.error("getFacultyById:", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// ✅ POST new faculty
export const addFaculty = async (facultyData) => {
  try {
    const response = await axios.post(API_FACULTIES, facultyData, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.error("addFaculty:", error.message);
    return "Không thể kết nối server";
  }
};

// ✅ PUT update faculty
export const updateFaculty = async (facultyId, updatedData) => {
  try {
    const response = await axios.put(`${API_FACULTIES}/${facultyId}`, updatedData, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.error("updateFaculty:", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// ✅ DELETE faculty
export const deleteFaculty = async (facultyId) => {
  try {
    const response = await axios.delete(`${API_FACULTIES}/${facultyId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.error("deleteFaculty:", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};
