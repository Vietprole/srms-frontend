import API_BASE_URL from "./base-url";
import axios from 'axios';
import { getAccessToken } from "../utils/storage";

const API_PLO = `${API_BASE_URL}/api/plo`;

export const getPLOsByLopHocPhanId = async (lopHocPhanId) => {
  try {
    const response = await axios.get(`${API_PLO}?lopHocPhanId=${lopHocPhanId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getPLOsByNganhId = async (nganhId) => {
  try {
    const response = await axios.get(`${API_PLO}?nganhId=${nganhId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getAllPLOs = async () => {
  try {
    // console.log("Token: ", getAccessToken());
    const response = await axios.get(API_PLO, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const getPLOs = async (nganhId) => {
  try {
    const url = nganhId ? `${API_PLO}?nganhId=${nganhId}` : API_PLO;
    const response = await axios.get(url, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const getPLOById = async (id) => {
  try {
    const response = await axios.get(`${API_PLO}/${id}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const addPLO = async (newData) => {
  try {
    const response = await axios.post(API_PLO, newData, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const updatePLO = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_PLO}/${id}`, updatedData, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const deletePLO = async (id) => {
  try {
    const response = await axios.delete(`${API_PLO}/${id}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getCLOsByPLOId = async (ploId) => {
  try {
    const response = await axios.get(`${API_PLO}/${ploId}/clo`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const addCLOsToPLO = async (ploId, cloIdsList) => {
  try {
    const response = await axios.post(`${API_PLO}/${ploId}/clo`, cloIdsList, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const updateCLOsToPLO = async (ploId, cloIdsList) => {
  try {
    const response = await axios.put(`${API_PLO}/${ploId}/clo`, cloIdsList, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const removeCLOsFromPLO = async (ploId, cloId) => {
  try {
    const response = await axios.delete(`${API_PLO}/${ploId}/clo/${cloId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const getHocPhansByPLOId = async (ploId) => {
  try {
    const response = await axios.get(`${API_PLO}/${ploId}/hocphan`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const updateHocPhansToPLO = async (ploId, hocPhanIdsList) => {
  try {
    const response = await axios.put(`${API_PLO}/${ploId}/hocphan`, hocPhanIdsList, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

