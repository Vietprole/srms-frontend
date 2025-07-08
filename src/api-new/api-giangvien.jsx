import axios from 'axios';
import { getAccessToken } from "../utils/storage";
import { API_TEACHER } from './endpoints';
import { toast } from "sonner";

export const getAllGiangViens = async () => {
  try {
    const response = await axios.get(API_TEACHER, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const getGiangViens = async (facultyId) => {
  try {
    const url = facultyId ? `${API_TEACHER}?workUnitId=${facultyId}` : API_TEACHER;
    const response = await axios.get(url, {
      headers: { Authorization: getAccessToken() }
    });
    console.log("response data: ", response.data);
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const getGiangVienById = async (id) => {
  try {
    const response = await axios.get(`${API_TEACHER}/${id}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const addGiangVien = async (newData) => {
  try {
    const response = await axios.post(API_TEACHER, newData, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Tạo Giảng viên thành công");
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};


export const updateGiangVien = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_TEACHER}/${id}`, updatedData, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Sửa Giảng viên thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const deleteGiangVien = async (id) => {
  try {
    const response = await axios.delete(`${API_TEACHER}/${id}`, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Xoá Giảng viên thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};
