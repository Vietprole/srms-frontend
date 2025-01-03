import API_BASE_URL from "./base-url";
import axios from 'axios';
import { getAccessToken } from "../utils/storage";

const API_HOCKY = `${API_BASE_URL}/api/hocky`;

export const getAllHocKys = async () => {
  try {
    const response = await axios.get(API_HOCKY, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to get a single student by ID
export const getHocKyById = async (studentId) => {
  try {
    const response = await axios.get(`${API_HOCKY}/${studentId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to add a new student
export const addHocKy = async (studentData) => {
  try {
    const response = await axios.post(API_HOCKY, studentData, {
      headers: { Authorization: getAccessToken() }
    });
    console.log("response hocky: ", response);
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to update an existing student
export const updateHocKy = async (studentId, updatedData) => {
  try {
    const response = await axios.put(`${API_HOCKY}/${studentId}`, updatedData, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to delete a student
export const deleteHocKy = async (studentId) => {
  try {
    const response = await axios.delete(`${API_HOCKY}/${studentId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};
