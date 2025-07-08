import axios from 'axios';
import { getAccessToken } from "../utils/storage";
import { createSearchURL } from "../utils/string";
import { API_STUDENT } from './endpoints';
import { toast } from "sonner";

export const getAllSinhViens = async () => {
  try {
    const response = await axios.get(API_STUDENT, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getFilteredStudents = async (facultyId, programmeId, classId, excludeFromClass = false) => {
  try {
    const paramsObj = { facultyId, programmeId, classId, excludeFromClass };
    const url = createSearchURL(API_STUDENT, paramsObj);
    console.log("url: ", url);

    const response = await axios.get(url, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

// Function to get a single sinhvien by ID
export const getStudentById = async (studentId) => {
  try {
    const response = await axios.get(`${API_STUDENT}/${studentId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to add a new sinhvien
export const createStudent = async (sinhvienData) => {
  try {
    const response = await axios.post(API_STUDENT, sinhvienData, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Tạo Sinh viên thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to update an existing sinhvien
export const updateStudent = async (studentId, updatedData) => {
  try {
    const response = await axios.put(`${API_STUDENT}/${studentId}`, updatedData, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Sửa Sinh viên thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to delete a sinhvien
export const deleteStudent = async (studentId) => {
  try {
    const response = await axios.delete(`${API_STUDENT}/${studentId}`, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Xoá Sinh viên thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to import students from Excel
export const importStudentsFromExcel = async (formData) => {
  try {
    const response = await axios.post(`${API_STUDENT}/import`, formData, {
      headers: {
        Authorization: getAccessToken(),
        'Content-Type': 'multipart/form-data'
      }
    });
    toast.success("Nhập sinh viên từ Excel thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi khi nhập dữ liệu");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};
