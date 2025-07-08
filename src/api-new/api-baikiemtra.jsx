import axios from "axios";
import { getAccessToken } from "../utils/storage";
import { API_EXAM } from "./endpoints";
import { toast } from "sonner";

export const getBaiKiemTrasByLopHocPhanId = async (lopHocPhanId) => {
  try {
    const response = await axios.get(`${API_EXAM}?classId=${lopHocPhanId}`, {
      headers: { Authorization: getAccessToken() },
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getAllBaiKiemTras = async () => {
  try {
    const response = await axios.get(API_EXAM, {
      headers: { Authorization: getAccessToken() },
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to get a single baikiemtra by ID
export const getBaiKiemTraById = async (examId) => {
  try {
    const response = await axios.get(`${API_EXAM}/${examId}`, {
      headers: { Authorization: getAccessToken() },
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to add a new baikiemtra
export const addBaiKiemTra = async (baikiemtraData) => {
  try {
    const response = await axios.post(API_EXAM, baikiemtraData, {
      headers: { Authorization: getAccessToken() },
    });
    toast.success("Tạo Thành phần đánh giá thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to update an existing baikiemtra
export const updateBaiKiemTra = async (examId, updatedData) => {
  try {
    const response = await axios.put(`${API_EXAM}/${examId}`, updatedData, {
      headers: { Authorization: getAccessToken() },
    });
    toast.success("Sửa Thành phần đánh giá thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to delete a baikiemtra
export const deleteBaiKiemTra = async (examId) => {
  try {
    const response = await axios.delete(`${API_EXAM}/${examId}`, {
      headers: { Authorization: getAccessToken() },
    });
    toast.success("Xoá Thành phần đánh giá thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const updateQuestions = async (examId, cauHois) => {
  try {
    const response = await axios.put(
      `${API_EXAM}/${examId}/questions`,
      cauHois,
      {
        headers: { Authorization: getAccessToken() },
      }
    );
    toast.success("Cập nhật bài/câu hỏi đánh giá cho thành phần đánh giá thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.response?.data);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};
