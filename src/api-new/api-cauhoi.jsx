import axios from "axios";
import { getAccessToken } from "../utils/storage";
import { API_QUESTION } from "./endpoints";
import { toast } from "sonner";

export const getQuestionsByExamId = async (examId) => {
  try {
    // console.log("Token: ", getAccessToken());
    const response = await axios.get(`${API_QUESTION}?examId=${examId}`, {
      headers: { Authorization: getAccessToken() },
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getCauHoiById = async (id) => {
  try {
    const response = await axios.get(`${API_QUESTION}/${id}`, {
      headers: { Authorization: getAccessToken() },
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const addCauHoi = async (newData) => {
  try {
    const response = await axios.post(API_QUESTION, newData, {
      headers: { Authorization: getAccessToken() },
    });
    toast.success("Tạo Câu hỏi thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const updateCauHoi = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_QUESTION}/${id}`, updatedData, {
      headers: { Authorization: getAccessToken() },
    });
    toast.success("Sửa Câu hỏi thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const deleteCauHoi = async (id) => {
  try {
    const response = await axios.delete(`${API_QUESTION}/${id}`, {
      headers: { Authorization: getAccessToken() },
    });
    toast.success("Xoá Câu hỏi thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getCLOsByQuestionId = async (questionId) => {
  try {
    const response = await axios.get(`${API_QUESTION}/${questionId}/clo`, {
      headers: { Authorization: getAccessToken() },
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const addCLOsToCauHoi = async (questionId, cloIdsList) => {
  try {
    const response = await axios.post(
      `${API_QUESTION}/${questionId}/clo`,
      cloIdsList,
      {
        headers: { Authorization: getAccessToken() },
      }
    );
    toast.success("Thêm CLO cho câu hỏi thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const updateCLOsToCauHoi = async (questionId, cloIdsList) => {
  try {
    const response = await axios.put(
      `${API_QUESTION}/${questionId}/clo`,
      cloIdsList,
      {
        headers: { Authorization: getAccessToken() },
      }
    );
    toast.success("Cập nhật câu hỏi đóng góp vào CLO thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const removeCLOsFromCauHoi = async (questionId, cloId) => {
  try {
    const response = await axios.delete(
      `${API_QUESTION}/${questionId}/clo/${cloId}`,
      {
        headers: { Authorization: getAccessToken() },
      }
    );
    toast.success("Xoá CLO khỏi câu hỏi thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};
