import axios from "axios";
import { getAccessToken } from "../utils/storage";
import { createSearchURL } from "../utils/string";
import { API_PLO } from "./endpoints";
import { toast } from "sonner";

export const getPLOsByLopHocPhanId = async (lopHocPhanId) => {
  try {
    const response = await axios.get(
      `${API_PLO}?lopHocPhanId=${lopHocPhanId}`,
      {
        headers: { Authorization: getAccessToken() },
      }
    );
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getAllPLOs = async () => {
  try {
    // console.log("Token: ", getAccessToken());
    const response = await axios.get(API_PLO, {
      headers: { Authorization: getAccessToken() },
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getFilteredPLOs = async (programmeId, classId) => {
  try {
    const paramsObj = { programmeId, classId };
    const url = createSearchURL(API_PLO, paramsObj);
    console.log("url: ", url);

    const response = await axios.get(url, {
      headers: { Authorization: getAccessToken() },
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getPLOById = async (id) => {
  try {
    const response = await axios.get(`${API_PLO}/${id}`, {
      headers: { Authorization: getAccessToken() },
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const createPLO = async (newData) => {
  try {
    const response = await axios.post(API_PLO, newData, {
      headers: { Authorization: getAccessToken() },
    });
    toast.success("Tạo PLO thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const updatePLO = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_PLO}/${id}`, updatedData, {
      headers: { Authorization: getAccessToken() },
    });
    toast.success("Sửa PLO thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const deletePLO = async (id) => {
  try {
    const response = await axios.delete(`${API_PLO}/${id}`, {
      headers: { Authorization: getAccessToken() },
    });
    toast.success("Xoá PLO thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getCLOsByPLOId = async (ploId) => {
  try {
    const response = await axios.get(`${API_PLO}/${ploId}/clo`, {
      headers: { Authorization: getAccessToken() },
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const addCLOsToPLO = async (ploId, cloIdsList) => {
  try {
    const response = await axios.post(`${API_PLO}/${ploId}/clo`, cloIdsList, {
      headers: { Authorization: getAccessToken() },
    });
    toast.success("Thêm CLO vào PLO thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const updateCLOsToPLO = async (ploId, cloIdsList) => {
  try {
    const response = await axios.put(`${API_PLO}/${ploId}/clo`, cloIdsList, {
      headers: { Authorization: getAccessToken() },
    });
    toast.success("Cập nhật CLO trong PLO thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const removeCLOsFromPLO = async (ploId, cloId) => {
  try {
    const response = await axios.delete(`${API_PLO}/${ploId}/clo/${cloId}`, {
      headers: { Authorization: getAccessToken() },
    });
    toast.success("Xoá CLO khỏi PLO thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getFilteredCoursesByPLOId = async (ploId) => {
  try {
    const response = await axios.get(`${API_PLO}/${ploId}/hocphan`, {
      headers: { Authorization: getAccessToken() },
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const updateCoursesToPLO = async (ploId, hocPhanIdsList) => {
  try {
    const response = await axios.put(
      `${API_PLO}/${ploId}/hocphan`,
      hocPhanIdsList,
      {
        headers: { Authorization: getAccessToken() },
      }
    );
    toast.success("Cập nhật học phần trong PLO thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};
