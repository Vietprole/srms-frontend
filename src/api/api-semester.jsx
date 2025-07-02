import API_BASE_URL from "./base-url";
import axios from 'axios';
import { getAccessToken } from "../utils/storage";

const API_SEMESTER = `${API_BASE_URL}/api/semesters`;

export const getAllSemesters = async () => {
  try {
    const response = await axios.get(API_SEMESTER, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getSemesterById = async (semesterId) => {
  try {
    const response = await axios.get(`${API_SEMESTER}/${semesterId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const addSemester = async (semesterData) => {
  try {
    const response = await axios.post(API_SEMESTER, semesterData, {
      headers: { Authorization: getAccessToken() }
    });
    return response;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const updateSemester = async (semesterId, updatedData) => {
  try {
    const response = await axios.put(`${API_SEMESTER}/${semesterId}`, updatedData, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const deleteSemester = async (semesterId) => {
  try {
    const response = await axios.delete(`${API_SEMESTER}/${semesterId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};
