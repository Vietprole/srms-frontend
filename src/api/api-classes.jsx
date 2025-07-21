import API_BASE_URL from "./base-url";
import axios from "axios";
import { getAccessToken } from "../utils/storage";

const API_CLASSES = `${API_BASE_URL}/api/classes`;

const getAuthHeader = () => ({
  headers: {
    Authorization: getAccessToken()
  }
});

/**
 * Lấy danh sách lớp học phần có thể lọc theo courseId, semesterId, teacherId, studentId
 */
export const getAllClasses = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, value);
      }
    });

    const url = params.toString() ? `${API_CLASSES}?${params}` : API_CLASSES;
    const response = await axios.get(url, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("getAllClasses error:", error);
    throw new Error(error.response?.data || "Lỗi khi tải danh sách lớp học phần");
  }
};

/**
 * Lấy thông tin lớp học phần theo ID
 */
export const getClassById = async (id) => {
  try {
    const response = await axios.get(`${API_CLASSES}/${id}`, getAuthHeader());
    return response;
  } catch (error) {
    console.error("getClassById error:", error);
    throw new Error(error.response?.data || "Không tìm thấy lớp học phần");
  }
};

/**
 * Tạo mới lớp học phần
 */
export const createClass = async (classData) => {
  try {
    const response = await axios.post(API_CLASSES, classData, getAuthHeader());
    return response;
  } catch (error) {
    console.error("createClass error:", error);
    throw new Error(error.response?.data || "Lỗi khi tạo lớp học phần");
  }
};

/**
 * Cập nhật lớp học phần
 */
export const updateClass = async (id, updateData) => {
  try {
    const response = await axios.put(`${API_CLASSES}/${id}`, updateData, getAuthHeader());
    return response;
  } catch (error) {
    console.error("updateClass error:", error);
    throw new Error(error.response?.data || "Lỗi khi cập nhật lớp học phần");
  }
};

/**
 * Xoá lớp học phần
 */
export const deleteClass = async (id) => {
  try {
    await axios.delete(`${API_CLASSES}/${id}`, getAuthHeader());
  } catch (error) {
    console.error("deleteClass error:", error);
    throw new Error(error.response?.data || "Lỗi khi xoá lớp học phần");
  }
};

/**
 * Lấy danh sách sinh viên trong lớp
 */
export const getStudentsInClass = async (id, filters = {}) => {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params.append(key, value);
      }
    });

    const url = params.toString()
      ? `${API_CLASSES}/${id}/students?${params}`
      : `${API_CLASSES}/${id}/students`;

    const response = await axios.get(url, getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("getStudentsInClass error:", error);
    throw new Error(error.response?.data || "Lỗi khi lấy danh sách sinh viên");
  }
};

/**
 * Thêm sinh viên vào lớp
 */
export const addStudentsToClass = async (id, studentIds) => {
  try {
    const response = await axios.post(
      `${API_CLASSES}/${id}/students`,
      studentIds,
      getAuthHeader()
    );
    return response;
  } catch (error) {
    console.error("addStudentsToClass error:", error);
    throw new Error(error.response?.data || "Lỗi khi thêm sinh viên vào lớp");
  }
};

/**
 * Cập nhật danh sách sinh viên trong lớp
 */
export const updateStudentsInClass = async (id, studentIds) => {
  try {
    const response = await axios.put(
      `${API_CLASSES}/${id}/students`,
      studentIds,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("updateStudentsInClass error:", error);
    throw new Error(error.response?.data || "Lỗi khi cập nhật sinh viên");
  }
};

/**
 * Xoá sinh viên khỏi lớp
 */
export const removeStudentsFromClass = async (id, studentIds) => {
  try {
    await axios.delete(`${API_CLASSES}/${id}/students`, {
      ...getAuthHeader(),
      data: studentIds
    });
  } catch (error) {
    console.error("removeStudentsFromClass error:", error);
    throw new Error(error.response?.data || "Lỗi khi xoá sinh viên khỏi lớp");
  }
};

/**
 * Cập nhật thành phần điểm (grade composition)
 */
export const updateGradeComposition = async (id, examList) => {
  try {
    const response = await axios.put(
      `${API_CLASSES}/${id}/grade-composition`,
      examList,
      getAuthHeader()
    );
    return response.data;
  } catch (error) {
    console.error("updateGradeComposition error:", error);
    throw new Error(error.response?.data || "Lỗi khi cập nhật thành phần điểm");
  }
};
export const getStudentIdsNotInClass = async (id) => {
  try {
    const response = await axios.get(`${API_CLASSES}/${id}/students/not-in-class`, getAuthHeader());
    return response.data; // Trả về mảng các studentId
  } catch (error) {
    console.error("getStudentIdsNotInClass error:", error);
    throw new Error(error.response?.data || "Lỗi khi lấy danh sách sinh viên chưa trong lớp");
  }
};
export const copyClassStructure = async (sourceClassId, targetClassId) => {
  try {
    const response = await axios.post(
      `${API_CLASSES}/${targetClassId}/copy-structure`,
      JSON.stringify(sourceClassId), // 👈 gửi số nguyên chứ không phải object
      {
        ...getAuthHeader(),
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader().headers,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("copyClassStructure error:", error);
    throw new Error(error.response?.data || "Lỗi khi sao chép cấu trúc lớp học phần");
  }
};
