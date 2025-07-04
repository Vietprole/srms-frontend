import axios from "axios";
import API_BASE_URL from "./base-url";
import { getAccessToken } from "../utils/storage";

const API_QUESTIONS = `${API_BASE_URL}/api/questions`;

const getAuthHeader = () => ({
  headers: {
    Authorization: getAccessToken(),
  },
});

/**
 * Lấy danh sách bài/câu hỏi đánh giá, có thể lọc theo examId
 */
export const getQuestions = async (examId) => {
  const params = examId ? `?examId=${examId}` : "";
  try {
    const res = await axios.get(`${API_QUESTIONS}${params}`, getAuthHeader());
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data || "Lỗi khi lấy danh sách bài/câu hỏi đánh giá");
  }
};

/**
 * Lấy bài/câu hỏi đánh giá theo ID
 */
export const getQuestionById = async (id) => {
  try {
    const res = await axios.get(`${API_QUESTIONS}/${id}`, getAuthHeader());
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data || "Không tìm thấy bài/câu hỏi đánh giá");
  }
};

/**
 * Tạo bài/câu hỏi đánh giá mới
 */
export const createQuestion = async (data) => {
  try {
    const res = await axios.post(API_QUESTIONS, data, getAuthHeader());
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data || "Lỗi khi tạo bài/câu hỏi đánh giá");
  }
};

/**
 * Cập nhật bài/câu hỏi đánh giá
 */
export const updateQuestion = async (id, data) => {
  try {
    const res = await axios.put(`${API_QUESTIONS}/${id}`, data, getAuthHeader());
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data || "Lỗi khi cập nhật bài/câu hỏi đánh giá");
  }
};

/**
 * Xoá bài/câu hỏi đánh giá
 */
export const deleteQuestion = async (id) => {
  try {
    await axios.delete(`${API_QUESTIONS}/${id}`, getAuthHeader());
  } catch (err) {
    throw new Error(err.response?.data || "Lỗi khi xoá bài/câu hỏi đánh giá");
  }
};

/**
 * Lấy CLOs được liên kết với bài/câu hỏi đánh giá
 */
export const getCLOsOfQuestion = async (id) => {
  try {
    const res = await axios.get(`${API_QUESTIONS}/${id}/clo`, getAuthHeader());
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data || "Không thể lấy danh sách CLO");
  }
};

/**
 * Cập nhật danh sách CLO liên kết với bài/câu hỏi đánh giá
 */
export const updateCLOsOfQuestion = async (id, cloIds) => {
  try {
    const res = await axios.put(`${API_QUESTIONS}/${id}/clo`, cloIds, getAuthHeader());
    return res.data;
  } catch (err) {
    throw new Error(err.response?.data || "Lỗi khi cập nhật CLO cho bài/câu hỏi đánh giá");
  }
};
