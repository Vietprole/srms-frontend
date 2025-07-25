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

export const getNganhsByNguoiQuanLyId = async (nguoiQuanLyCTDTId) => {
  try {
    console.log("nguoiQuanLyCTDTId: ", nguoiQuanLyCTDTId);
    const url = nguoiQuanLyCTDTId ? `${API_NGANH}?nguoiQuanLyId=${nguoiQuanLyCTDTId}` : API_NGANH;
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
    return response;
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
    return response;
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
    return response;
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
    return response;
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
export const updateHocPhanCotLois = async (nganhId, updateCotLoiDTOs) => {
  try {
    const response = await axios.patch(`${API_NGANH}/${nganhId}/hocphan/cotloi`, updateCotLoiDTOs, {
      headers: { Authorization: getAccessToken() }
    });
    return response;
  } catch (error) {
    console.log("Lỗi khi cập nhật học phần cốt lõi: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};
export const copyNganhStructure = async (targetNganhId, sourceNganhId) => {
  try {
    const response = await axios.post(
      `${API_NGANH}/${targetNganhId}/copy-structure`,
      sourceNganhId, // body là số nguyên
      {
        headers: {
          Authorization: getAccessToken(),
          "Content-Type": "application/json", // đảm bảo gửi đúng kiểu
        },
      }
    );
    return response;
  } catch (error) {
    console.log("Lỗi khi sao chép cấu trúc ngành: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};






