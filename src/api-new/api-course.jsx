import axios from 'axios';
import { getAccessToken } from "../utils/storage";
import { createSearchURL } from "../utils/string";
import { API_COURSE } from './endpoints';
import { toast } from "sonner";

export const getAllCourses = async () => {
  try {
    const response = await axios.get(API_COURSE, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getFilteredCourses = async (facultyId, programmeId, excludeFromProgramme) => {
  try {
    const paramsObj = { facultyId, programmeId, excludeFromProgramme };
    const url = createSearchURL(API_COURSE, paramsObj);
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

// Function to get a single hocphan by ID
export const getCourseById = async (hocphanId) => {
  try {
    const response = await axios.get(`${API_COURSE}/${hocphanId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to add a new hocphan
export const createCourse = async (hocphanData) => {
  try {
    const response = await axios.post(API_COURSE, hocphanData, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Tạo Học phần thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to update an existing hocphan
export const updateCourse = async (hocphanId, updatedData) => {
  try {
    const response = await axios.put(`${API_COURSE}/${hocphanId}`, updatedData, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Sửa Học phần thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to delete a hocphan
export const deleteCourse = async (hocphanId) => {
  try {
    const response = await axios.delete(`${API_COURSE}/${hocphanId}`, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Xoá Học phần thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getPLOsByCourseId = async (hocPhanId) => {
  try {
    const response = await axios.get(`${API_COURSE}/${hocPhanId}/plo`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const addPLOsToCourse = async (hocPhanId, pLOIdsList) => {
  try {
    const response = await axios.post(`${API_COURSE}/${hocPhanId}/plo`, pLOIdsList, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Thêm PLO vào Học phần thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const removePLOFromCourse = async (hocPhanId, pLOId) => {
  try {
    const response = await axios.delete(`${API_COURSE}/${hocPhanId}/plo/${pLOId}`, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Xoá PLO khỏi Học phần thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

