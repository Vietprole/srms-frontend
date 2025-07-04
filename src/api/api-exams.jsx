import API_BASE_URL from "./base-url";
import axios from "axios";
import { getAccessToken } from "../utils/storage";

const API_EXAMS = `${API_BASE_URL}/api/exams`;

const getAuthHeader = () => ({
  headers: {
    Authorization: getAccessToken()
  }
});

/**
 * Lấy danh sách bài kiểm tra, có thể lọc theo classId
 * @param {number} classId 
 */
export const getExams = async (classId) => {
  try {
    const url = classId ? `${API_EXAMS}?classId=${classId}` : API_EXAMS;
    const response = await axios.get(url, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("getExams error:", error);
    throw new Error(error.response?.data || "Lỗi khi lấy danh sách bài kiểm tra");
  }
};

/**
 * Lấy thông tin chi tiết bài kiểm tra theo id
 * @param {number} id 
 */
export const getExamById = async (id) => {
  try {
    const response = await axios.get(`${API_EXAMS}/${id}`, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("getExamById error:", error);
    throw new Error(error.response?.data || "Không tìm thấy bài kiểm tra");
  }
};

/**
 * Tạo mới bài kiểm tra
 * @param {CreateExamDTO} examData 
 */
export const createExam = async (examData) => {
  try {
    const response = await axios.post(API_EXAMS, examData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("createExam error:", error);
    throw new Error(error.response?.data || "Lỗi khi tạo bài kiểm tra");
  }
};

/**
 * Cập nhật bài kiểm tra
 * @param {number} id 
 * @param {UpdateExamDTO} examData 
 */
export const updateExam = async (id, examData) => {
  try {
    const response = await axios.put(`${API_EXAMS}/${id}`, examData, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("updateExam error:", error);
    throw new Error(error.response?.data || "Lỗi khi cập nhật bài kiểm tra");
  }
};

/**
 * Xoá bài kiểm tra
 * @param {number} id 
 */
export const deleteExam = async (id) => {
  try {
    await axios.delete(`${API_EXAMS}/${id}`, getAuthHeader());
  } catch (error) {
    console.error("deleteExam error:", error);
    throw new Error(error.response?.data || "Lỗi khi xoá bài kiểm tra");
  }
};

/**
 * Cập nhật danh sách câu hỏi cho bài kiểm tra
 * @param {number} id 
 * @param {CreateQuestionDTO[]} questions 
 */
export const updateExamQuestions = async (id, questions) => {
  try {
    const response = await axios.put(`${API_EXAMS}/${id}/questions`, questions, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("updateExamQuestions error:", error);
    throw new Error(error.response?.data || "Lỗi khi cập nhật câu hỏi");
  }
};
