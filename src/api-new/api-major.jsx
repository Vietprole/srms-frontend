import axios from 'axios';
import { getAccessToken } from "../utils/storage";
import { API_MAJOR } from './endpoints';
import { toast } from "sonner";

export const getMajorsByFacultyId = async (facultyId) => {
  try {
    const response = await axios.get(`${API_MAJOR}?facultyId=${facultyId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getMajors = async (facultyId) => {
  try {
    const url = facultyId ? `${API_MAJOR}?facultyId=${facultyId}` : API_MAJOR;
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

export const getAllMajors = async () => {
  try {
    const response = await axios.get(API_MAJOR, {
      headers: { Authorization: getAccessToken() }
    });
    console.log("response data: ", response.data);
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};


// Function to get a single nganh by ID
export const getMajorById = async (nganhId) => {
  try {
    const response = await axios.get(`${API_MAJOR}/${nganhId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to add a new nganh
export const createMajor = async (nganhData) => {
  try {
    const response = await axios.post(API_MAJOR, nganhData, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Tạo Ngành thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to update an existing nganh
export const updateMajor = async (nganhId, updatedData) => {
  try {
    const response = await axios.put(`${API_MAJOR}/${nganhId}`, updatedData, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Sửa Ngành thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to delete a nganh
export const deleteMajor = async (nganhId) => {
  try {
    const response = await axios.delete(`${API_MAJOR}/${nganhId}`, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Xoá Ngành thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getCoursesByMajorId = async (nganhId) => {
  try {
    const response = await axios.get(`${API_MAJOR}/${nganhId}/hocphan`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const addCoursesToMajor = async (nganhId, hocPhanIdsList) => {
  try {
    const response = await axios.post(`${API_MAJOR}/${nganhId}/hocphan`, hocPhanIdsList, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Thêm học phần vào ngành thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const removeCourseFromMajor = async (nganhId, hocPhanId) => {
  try {
    const response = await axios.delete(`${API_MAJOR}/${nganhId}/hocphan/${hocPhanId}`, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Xoá học phần khỏi ngành thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}
export const createMajorWithCourses = async (nganhData) => {
  try {
    const response = await axios.post(`${API_MAJOR}/createwithhocphan`, nganhData, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Tạo ngành với học phần thành công");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo ngành: ", error.message);
    toast.error(error.response?.data || "Lỗi khi tạo ngành");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

