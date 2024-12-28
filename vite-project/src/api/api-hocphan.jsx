import API_BASE_URL from "./base-url";
import axios from 'axios';
import { getAccessToken } from "../utils/storage";
import { createSearchURL } from "../utils/string";

const API_HOCPHAN = `${API_BASE_URL}/api/hocphan`;

export const getAllHocPhans = async () => {
  try {
    const response = await axios.get(API_HOCPHAN, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getHocPhans = async (khoaId, nganhId, laCotLoi) => {
  try {
    const paramsObj = { khoaId, nganhId, laCotLoi};
    const url = createSearchURL(API_HOCPHAN, paramsObj);
    console.log("url: ", url);

    const response = await axios.get(url, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

// Function to get a single hocphan by ID
export const getHocPhanById = async (hocphanId) => {
  try {
    const response = await axios.get(`${API_HOCPHAN}/${hocphanId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to add a new hocphan
export const addHocPhan = async (hocphanData) => {
  try {
    const response = await axios.post(API_HOCPHAN, hocphanData, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to update an existing hocphan
export const updateHocPhan = async (hocphanId, updatedData) => {
  try {
    const response = await axios.put(`${API_HOCPHAN}/${hocphanId}`, updatedData, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to delete a hocphan
export const deleteHocPhan = async (hocphanId) => {
  try {
    const response = await axios.delete(`${API_HOCPHAN}/${hocphanId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getPLOsByHocPhanId = async (hocPhanId) => {
  try {
    const response = await axios.get(`${API_HOCPHAN}/${hocPhanId}/plo`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const addPLOsToHocPhan = async (hocPhanId, pLOIdsList) => {
  try {
    const response = await axios.post(`${API_HOCPHAN}/${hocPhanId}/plo`, pLOIdsList, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const removePLOFromHocPhan = async (hocPhanId, pLOId) => {
  try {
    const response = await axios.delete(`${API_HOCPHAN}/${hocPhanId}/plo/${pLOId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}
export const getAllHocPhanNotNganhId = async (nganhId) => {
  try {
    const response = await axios.get(`${API_HOCPHAN}/notInNganh/${nganhId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
  }
};
