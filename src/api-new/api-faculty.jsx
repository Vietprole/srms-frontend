import axios from "axios";
import { getAccessToken } from "../utils/storage";
import { API_FACULTY } from "./endpoints";
// import { toast } from "@/hooks/use-toast";
import { toast } from "sonner"

export const getAllFaculties = async () => {
  try {
    const response = await axios.get(API_FACULTY, {
      headers: { Authorization: getAccessToken() },
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast(error.response?.data || "Lỗi bất định")
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getFacultyById = async (facultyId) => {
  try {
    const response = await axios.get(`${API_FACULTY}/${facultyId}`, {
      headers: { Authorization: getAccessToken() },
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const createFaculty = async (facultyData) => {
  try {
    const response = await axios.post(API_FACULTY, facultyData, {
      headers: { Authorization: getAccessToken() },
    });
    console.log("response khoa: ", response);
    toast.success("Tạo Khoa thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
  }
};

export const updateFaculty = async (facultyId, updatedData) => {
  try {
    const response = await axios.put(
      `${API_FACULTY}/${facultyId}`,
      updatedData,
      {
        headers: { Authorization: getAccessToken() },
      }
    );
    toast.success("Sửa Khoa thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const deleteFaculty = async (facultyId) => {
  try {
    const response = await axios.delete(`${API_FACULTY}/${facultyId}`, {
      headers: { Authorization: getAccessToken() },
    });
    toast.success("Xoá Khoa thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};
