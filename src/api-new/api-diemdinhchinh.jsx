import API_BASE_URL from "./base-url";
import axios from "axios";
import { getAccessToken } from "../utils/storage";
import { createSearchURL } from "../utils/string";
import { API_CORRECTED_RESULT } from "./endpoints";
import { toast } from "sonner";

export const getAllDiemDinhChinhs = async () => {
  try {
    const response = await axios.get(API_CORRECTED_RESULT, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getDiemDinhChinhs = async (classId, teacherId) => {
  try {
    const url = createSearchURL(API_CORRECTED_RESULT, { classId, teacherId });
    console.log(url);
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

// Function to get a single diemdinhchinh by ID
export const getDiemDinhChinhById = async (diemdinhchinhId) => {
  try {
    const response = await axios.get(`${API_CORRECTED_RESULT}/${diemdinhchinhId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to add a new diemdinhchinh
export const addDiemDinhChinh = async (diemdinhchinhData) => {
  try {
    const response = await axios.post(API_CORRECTED_RESULT, diemdinhchinhData, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Tạo Điểm đinh chính thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to update an existing diemdinhchinh
export const updateDiemDinhChinh = async (diemDinhChinhId, updatedData) => {
  try {
    const response = await axios.put(`${API_CORRECTED_RESULT}/${diemDinhChinhId}`, updatedData, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Sửa Điểm đinh chính thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const upsertDiemDinhChinh = async (diemdinhchinhData) => {
  try {
    const response = await axios.put(`${API_CORRECTED_RESULT}/upsert`, diemdinhchinhData, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Cập nhật Điểm đinh chính thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

// Function to delete a diemdinhchinh
export const deleteDiemDinhChinh = async (diemdinhchinhId) => {
  try {
    const response = await axios.delete(`${API_CORRECTED_RESULT}/${diemdinhchinhId}`, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Xoá Điểm đinh chính thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const acceptDiemDinhChinh = async (diemdinhchinhId) => {
  try {
    console.log(getAccessToken());
    const response = await axios.post(`${API_CORRECTED_RESULT}/${diemdinhchinhId}/accept`, {}, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Duyệt Điểm đinh chính thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}
