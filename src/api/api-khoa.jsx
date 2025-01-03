import API_BASE_URL from "./base-url";
import axios from 'axios';
import { getAccessToken } from "../utils/storage";

const API_KHOA = `${API_BASE_URL}/api/khoa`;

export const getAllKhoas = async () => {
  try {
    const response = await axios.get(API_KHOA, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to get a single student by ID
export const getKhoaById = async (studentId) => {
  try {
    const response = await axios.get(`${API_KHOA}/${studentId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to add a new student
export const addKhoa = async (studentData) => {
  try {
    const response = await axios.post(API_KHOA, studentData, {
      headers: { Authorization: getAccessToken() }
    });
    console.log("response khoa: ", response);
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to update an existing student
export const updateKhoa = async (studentId, updatedData) => {
  try {
    const response = await axios.put(`${API_KHOA}/${studentId}`, updatedData, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to delete a student
export const deleteKhoa = async (studentId) => {
  try {
    const response = await axios.delete(`${API_KHOA}/${studentId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};
