import API_BASE_URL from "./base-url";
import axios from 'axios';
import { getAccessToken } from "../utils/storage";

const API_GIANGVIEN = `${API_BASE_URL}/api/giangvien`;

export const getAllGiangViens = async () => {
  try {
    const response = await axios.get(API_GIANGVIEN, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const getGiangViens = async (khoaId) => {
  try {
    const url = khoaId ? `${API_GIANGVIEN}?khoaId=${khoaId}` : API_GIANGVIEN;
    const response = await axios.get(url, {
      headers: { Authorization: getAccessToken() }
    });
    console.log("response data: ", response.data);
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const getGiangVienById = async (id) => {
  try {
    const response = await axios.get(`${API_GIANGVIEN}/${id}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const addGiangVien = async (newData) => {
  try {
    const response = await axios.post(API_GIANGVIEN, newData, {
      headers: { Authorization: getAccessToken() }
    });
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};


export const updateGiangVien = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_GIANGVIEN}/${id}`, updatedData, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const deleteGiangVien = async (id) => {
  try {
    const response = await axios.delete(`${API_GIANGVIEN}/${id}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};
