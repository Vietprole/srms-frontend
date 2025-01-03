import API_BASE_URL from "./base-url";
import axios from 'axios';
import { getAccessToken } from "../utils/storage";

const API_NGANH = `${API_BASE_URL}/api/nganh`;

export const getNganhsByKhoaId = async (khoaId) => {
  try {
    const response = await axios.get(`${API_NGANH}?khoaId=${khoaId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getNganhs = async (khoaId) => {
  try {
    const url = khoaId ? `${API_NGANH}?khoaId=${khoaId}` : API_NGANH;
    const response = await axios.get(url, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const getAllNganhs = async () => {
  try {
    const response = await axios.get(API_NGANH, {
      headers: { Authorization: getAccessToken() }
    });
    console.log("response data: ", response.data);
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};


// Function to get a single nganh by ID
export const getNganhById = async (nganhId) => {
  try {
    const response = await axios.get(`${API_NGANH}/${nganhId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to add a new nganh
export const addNganh = async (nganhData) => {
  try {
    const response = await axios.post(API_NGANH, nganhData, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to update an existing nganh
export const updateNganh = async (nganhId, updatedData) => {
  try {
    const response = await axios.put(`${API_NGANH}/${nganhId}`, updatedData, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to delete a nganh
export const deleteNganh = async (nganhId) => {
  try {
    const response = await axios.delete(`${API_NGANH}/${nganhId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getHocPhansByNganhId = async (nganhId) => {
  try {
    const response = await axios.get(`${API_NGANH}/${nganhId}/hocphan`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const addHocPhansToNganh = async (nganhId, hocPhanIdsList) => {
  try {
    const response = await axios.post(`${API_NGANH}/${nganhId}/hocphan`, hocPhanIdsList, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const removeHocPhanFromNganh = async (nganhId, hocPhanId) => {
  try {
    const response = await axios.delete(`${API_NGANH}/${nganhId}/hocphan/${hocPhanId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}
export const addNganhWithHocPhan = async (nganhData) => {
  try {
    const response = await axios.post(`${API_NGANH}/createwithhocphan`, nganhData, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo ngành: ", error.message);
  }
};

