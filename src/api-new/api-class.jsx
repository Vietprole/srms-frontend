import axios from "axios";
import { getAccessToken } from "../utils/storage";
import { createSearchURL } from "../utils/string";
import { API_CLASS } from "./endpoints";
import { toast } from "sonner";

export const getAllClasses = async () => {
  try {
    const response = await axios.get(API_CLASS, {
      headers: { Authorization: getAccessToken() },
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getFilteredClasses = async (
  courseId,
  semesterId,
  teacherId,
  studentId
) => {
  try {
    const paramsObj = { courseId, semesterId, teacherId, studentId };
    const url = createSearchURL(API_CLASS, paramsObj);
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

export const getClassById = async (id) => {
  try {
    const response = await axios.get(`${API_CLASS}/${id}`, {
      headers: { Authorization: getAccessToken() },
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const createClass = async (newData) => {
  try {
    const response = await axios.post(API_CLASS, newData, {
      headers: { Authorization: getAccessToken() },
    });
    toast.success("Tạo Lớp học phần thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const updateClass = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_CLASS}/${id}`, updatedData, {
      headers: { Authorization: getAccessToken() },
    });
    toast.success("Sửa Lớp học phần thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const deleteClass = async (id) => {
  try {
    const response = await axios.delete(`${API_CLASS}/${id}`, {
      headers: { Authorization: getAccessToken() },
    });
    toast.success("Xoá Lớp học phần thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getStudentsInClass = async (classId, facultyId, programmeId) => {
  try {
    const paramsObj = { classId, facultyId, programmeId };
    const url = createSearchURL(`${API_CLASS}/${classId}/students`, paramsObj);
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

export const addStudentsToClass = async (classId, studentIdsList) => {
  try {
    const response = await axios.post(
      `${API_CLASS}/${classId}/students`,
      studentIdsList,
      {
        headers: { Authorization: getAccessToken() },
      }
    );
    toast.success("Thêm sinh viên vào lớp học phần thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const removeStudentsFromClass = async (classId, studentIdsList) => {
  try {
    const response = await axios.delete(`${API_CLASS}/${classId}/students`, {
      data: studentIdsList,
      headers: { Authorization: getAccessToken() },
    });
    toast.success("Xoá sinh viên khỏi lớp học phần thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getGiangViensByClassId = async (classId) => {
  try {
    const response = await axios.get(
      `${API_CLASS}/${classId}/view-giangviens`,
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

export const addGiangViensToLopHocPhan = async (classId, giangVienIdsList) => {
  try {
    const response = await axios.post(
      `${API_CLASS}/${classId}/add-giangviens`,
      giangVienIdsList,
      {
        headers: { Authorization: getAccessToken() },
      }
    );
    toast.success("Thêm giảng viên vào lớp học phần thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const removeGiangVienFromLopHocPhan = async (classId, giangVienId) => {
  try {
    const response = await axios.delete(
      `${API_CLASS}/${classId}/remove-giangvien/${giangVienId}`,
      {
        headers: { Authorization: getAccessToken() },
      }
    );
    toast.success("Xoá giảng viên khỏi lớp học phần thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const updateCongThucDiem = async (classId, baiKiemTras) => {
  try {
    const response = await axios.put(
      `${API_CLASS}/${classId}/grade-composition`,
      baiKiemTras,
      {
        headers: { Authorization: getAccessToken() },
      }
    );
    toast.success("Cập nhật công thức điểm thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getLopHocPhanChiTiet = async (classId) => {
  try {
    const response = await axios.get(`${API_CLASS}/${classId}/chitiet`, {
      headers: { Authorization: getAccessToken() },
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getStudentssNotInClassId = async (classId) => {
  try {
    const response = await axios.get(
      `${API_CLASS}/${classId}/studentsnotinlhp`,
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
