import axios from 'axios';
import { getAccessToken } from "../utils/storage";
import { API_SEMESTER } from './endpoints';
import { toast } from "sonner";

export const getAllSemesters = async () => {
  try {
    const response = await axios.get(API_SEMESTER, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to get a single semester by ID
export const getSemesterById = async (semesterId) => {
  try {
    const response = await axios.get(`${API_SEMESTER}/${semesterId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to add a new semester
export const createSemester = async (semesterData) => {
  try {
    const response = await axios.post(API_SEMESTER, semesterData, {
      headers: { Authorization: getAccessToken() }
    });
    console.log("response semester: ", response);
    toast.success("Tạo Học kỳ thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to update an existing semester
export const updateSemester = async (semesterId, updatedData) => {
  try {
    const response = await axios.put(`${API_SEMESTER}/${semesterId}`, updatedData, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Sửa Học kỳ thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to delete a semester
export const deleteSemester = async (semesterId) => {
  try {
    const response = await axios.delete(`${API_SEMESTER}/${semesterId}`, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Xoá Học kỳ thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};
