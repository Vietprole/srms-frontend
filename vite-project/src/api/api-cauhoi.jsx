import API_BASE_URL from "./base-url";
import axios from 'axios';
import { getAccessToken } from "../utils/storage";

const API_CAUHOI = `${API_BASE_URL}/api/cauhoi`;

export const getCauHoisByBaiKiemTraId = async (baiKiemTraId) => {
  try {
    // console.log("Token: ", getAccessToken());
    const response = await axios.get(`${API_CAUHOI}?baiKiemTraId=${baiKiemTraId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getCauHoiById = async (id) => {
  try {
    const response = await axios.get(`${API_CAUHOI}/${id}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const addCauHoi = async (newData) => {
  try {
    const response = await axios.post(API_CAUHOI, newData, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const updateCauHoi = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_CAUHOI}/${id}`, updatedData, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const deleteCauHoi = async (id) => {
  try {
    const response = await axios.delete(`${API_CAUHOI}/${id}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getCLOsByCauHoiId = async (cauHoiId) => {
  try {
    const response = await axios.get(`${API_CAUHOI}/${cauHoiId}/clo`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const addCLOsToCauHoi = async (cauHoiId, cloIdsList) => {
  try {
    const response = await axios.post(`${API_CAUHOI}/${cauHoiId}/clo`, cloIdsList, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const updateCLOsToCauHoi = async (cauHoiId, cloIdsList) => {
  try {
    const response = await axios.put(`${API_CAUHOI}/${cauHoiId}/clo`, cloIdsList, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const removeCLOsFromCauHoi = async (cauHoiId, cloId) => {
  try {
    const response = await axios.delete(`${API_CAUHOI}/${cauHoiId}/clo/${cloId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}
