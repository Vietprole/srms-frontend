import axios from 'axios';
import { getAccessToken } from "../utils/storage";
import { API_PI } from './endpoints';
import { createSearchURL } from "../utils/string";
import { toast } from "sonner";

export const getPIsByLopHocPhanId = async (lopHocPhanId) => {
  try {
    const response = await axios.get(`${API_PI}?lopHocPhanId=${lopHocPhanId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getPIsByPLOId = async (ploId) => {
  try {
    const response = await axios.get(`${API_PI}?ploId=${ploId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getAllPIs = async () => {
  try {
    // console.log("Token: ", getAccessToken());
    const response = await axios.get(API_PI, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const getFilteredPIs = async (ploId = null, programmeId = null, courseId = null, classId = null) => {
  try {
    const paramsObj = { ploId, programmeId, courseId, classId };
    const url = createSearchURL(API_PI, paramsObj);
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
}

export const getPIById = async (id) => {
  try {
    const response = await axios.get(`${API_PI}/${id}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const addPI = async (newData) => {
  try {
    const response = await axios.post(API_PI, newData, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Tạo PI thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const updatePI = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_PI}/${id}`, updatedData, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Sửa PI thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const deletePI = async (id) => {
  try {
    const response = await axios.delete(`${API_PI}/${id}`, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Xoá PI thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getCLOsByPIId = async (piId) => {
  try {
    const response = await axios.get(`${API_PI}/${piId}/clos`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const addCLOsToPI = async (piId, cloIdsList) => {
  try {
    const response = await axios.post(`${API_PI}/${piId}/clos`, cloIdsList, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Thêm CLO vào PI thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const updateCLOsToPI = async (piId, cloIdsList) => {
  try {
    const response = await axios.put(`${API_PI}/${piId}/clos`, cloIdsList, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Cập nhật CLO đóng góp vào PI thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const removeCLOsFromPI = async (piId, cloId) => {
  try {
    const response = await axios.delete(`${API_PI}/${piId}/clos/${cloId}`, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Xoá CLO khỏi PI thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const getCoursesOfPI = async (piId) => {
  try {
    const response = await axios.get(`${API_PI}/${piId}/courses`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const upsertCourseOfPI = async (piId, coursePIDTO) => {
  try {
    const response = await axios.put(`${API_PI}/${piId}/courses`, coursePIDTO, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Cập nhật học phần trong PI thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

