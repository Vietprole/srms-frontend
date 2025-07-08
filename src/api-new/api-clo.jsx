import axios from 'axios';
import { getAccessToken } from "../utils/storage";
import { createSearchURL } from "../utils/string";
import { API_CLO } from './endpoints';
import { toast } from "sonner";

export const getFilteredCLOs = async (courseId) => {
  try {
    const paramsObj = { courseId };
    const url = createSearchURL(API_CLO, paramsObj);
    console.log("url: ", url);

    const response = await axios.get(url, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getCLOsByClassId = async (classId) => {
  try {
    const response = await axios.get(`${API_CLO}?classId=${classId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const getAllCLOs = async () => {
  try {
    const response = await axios.get(API_CLO, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const getCLOById = async (id) => {
  try {
    const response = await axios.get(`${API_CLO}/${id}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const addCLO = async (newData) => {
  try {
    const response = await axios.post(API_CLO, newData, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Tạo CLO thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const updateCLO = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_CLO}/${id}`, updatedData, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Sửa CLO thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const deleteCLO = async (id) => {
  try {
    const response = await axios.delete(`${API_CLO}/${id}`, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Xoá CLO thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};
