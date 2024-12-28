import API_BASE_URL from "./base-url";
import axios from "axios";
import { getAccessToken } from "../utils/storage";

const API_DIEMDINHCHINH = `${API_BASE_URL}/api/diemdinhchinh`;

// export const getDiemDinhChinhsByLopHocPhanId = async (lopHocPhanId) => {
//   try {
//     const response = await axios.get(`${API_DIEMDINHCHINH}?lopHocPhanId=${lopHocPhanId}`);
//     return response.data;
//   } catch (error) {
//     console.log("error message: ", error.message);
//   }
// };

export const getAllDiemDinhChinhs = async () => {
  try {
    const response = await axios.get(API_DIEMDINHCHINH, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getDiemDinhChinhs = async (lopHocPhanId) => {
  try {
    const response = await axios.get(`${API_DIEMDINHCHINH}?lopHocPhanId=${lopHocPhanId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

// Function to get a single diemdinhchinh by ID
export const getDiemDinhChinhById = async (diemdinhchinhId) => {
  try {
    const response = await axios.get(`${API_DIEMDINHCHINH}/${diemdinhchinhId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to add a new diemdinhchinh
export const addDiemDinhChinh = async (diemdinhchinhData) => {
  try {
    const response = await axios.post(API_DIEMDINHCHINH, diemdinhchinhData, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to update an existing diemdinhchinh
export const updateDiemDinhChinh = async (diemDinhChinhId, updatedData) => {
  try {
    const response = await axios.put(`${API_DIEMDINHCHINH}/${diemDinhChinhId}`, updatedData, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const upsertDiemDinhChinh = async (diemdinhchinhData) => {
  try {
    const response = await axios.put(`${API_DIEMDINHCHINH}/upsert`, diemdinhchinhData, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

// Function to delete a diemdinhchinh
export const deleteDiemDinhChinh = async (diemdinhchinhId) => {
  try {
    const response = await axios.delete(`${API_DIEMDINHCHINH}/${diemdinhchinhId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const acceptDiemDinhChinh = async (diemdinhchinhId) => {
  try {
    console.log(getAccessToken());
    const response = await axios.post(`${API_DIEMDINHCHINH}/${diemdinhchinhId}/accept`, {}, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}
