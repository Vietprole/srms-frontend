import API_BASE_URL from "./base-url";
import axios from 'axios';
import { getAccessToken } from "../utils/storage";

const API_BAIKIEMTRA = `${API_BASE_URL}/api/baikiemtra`;

export const getBaiKiemTrasByLopHocPhanId = async (lopHocPhanId) => {
  try {
    const response = await axios.get(`${API_BAIKIEMTRA}?lopHocPhanId=${lopHocPhanId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getAllBaiKiemTras = async () => {
  try {
    const response = await axios.get(API_BAIKIEMTRA, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to get a single baikiemtra by ID
export const getBaiKiemTraById = async (baikiemtraId) => {
  try {
    const response = await axios.get(`${API_BAIKIEMTRA}/${baikiemtraId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to add a new baikiemtra
export const addBaiKiemTra = async (baikiemtraData) => {
  try {
    const response = await axios.post(API_BAIKIEMTRA, baikiemtraData, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to update an existing baikiemtra
export const updateBaiKiemTra = async (baikiemtraId, updatedData) => {
  try {
    const response = await axios.put(`${API_BAIKIEMTRA}/${baikiemtraId}`, updatedData, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to delete a baikiemtra
export const deleteBaiKiemTra = async (baikiemtraId) => {
  try {
    const response = await axios.delete(`${API_BAIKIEMTRA}/${baikiemtraId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const updateListCauHoi = async (baikiemtraId, cauHois) => {
  try {
    const response = await axios.put(`${API_BAIKIEMTRA}/${baikiemtraId}/listcauhoi`, cauHois, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};
