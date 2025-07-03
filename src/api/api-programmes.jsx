import axios from "axios";
import API_BASE_URL from "./base-url";
import { getAccessToken } from "../utils/storage";

const API_PROGRAMMES = `${API_BASE_URL}/api/programmes`;

const getAuthHeader = () => ({
  headers: {
    Authorization: getAccessToken(),
  },
});

/**
 * Lấy danh sách chương trình đào tạo, có thể lọc theo majorId hoặc managerAccountId
 */
export const getProgrammes = async ({ majorId, managerAccountId }) => {
  const params = new URLSearchParams();
  if (majorId) params.append("majorId", majorId);
  if (managerAccountId) params.append("managerAccountId", managerAccountId);

  try {
    const response = await axios.get(`${API_PROGRAMMES}?${params}`, getAuthHeader());
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data || "Lỗi khi lấy danh sách chương trình đào tạo");
  }
};

/**
 * Lấy chi tiết chương trình đào tạo theo id
 */
export const getProgrammeById = async (id) => {
  try {
    const response = await axios.get(`${API_PROGRAMMES}/${id}`, getAuthHeader());
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data || "Không tìm thấy chương trình đào tạo");
  }
};

/**
 * Tạo chương trình đào tạo mới
 */
export const createProgramme = async (data) => {
  try {
    const response = await axios.post(API_PROGRAMMES, data, getAuthHeader());
    return response;
  } catch (err) {
    throw new Error(err.response?.data || "Lỗi khi tạo chương trình đào tạo");
  }
};

/**
 * Cập nhật chương trình đào tạo
 */
export const updateProgramme = async (id, data) => {
  try {
    const response = await axios.put(`${API_PROGRAMMES}/${id}`, data, getAuthHeader());
    return response;
  } catch (err) {
    throw new Error(err.response?.data || "Lỗi khi cập nhật chương trình đào tạo");
  }
};

/**
 * Xoá chương trình đào tạo
 */
export const deleteProgramme = async (id) => {
  try {
    await axios.delete(`${API_PROGRAMMES}/${id}`, getAuthHeader());
  } catch (err) {
    throw new Error(err.response?.data || "Lỗi khi xoá chương trình đào tạo");
  }
};

/**
 * Lấy danh sách học phần trong chương trình
 */
export const getCoursesInProgramme = async (id, { facultyId, isCore } = {}) => {
  const params = new URLSearchParams();
  if (facultyId) params.append("facultyId", facultyId);
  if (isCore !== undefined) params.append("isCore", isCore);

  try {
    const response = await axios.get(`${API_PROGRAMMES}/${id}/courses?${params}`, getAuthHeader());
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data || "Lỗi khi lấy danh sách học phần");
  }
};

/**
 * Thêm học phần vào chương trình
 */
export const addCoursesToProgramme = async (id, courseIds) => {
  try {
    const response = await axios.post(`${API_PROGRAMMES}/${id}/courses`, courseIds, getAuthHeader());
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data || "Lỗi khi thêm học phần");
  }
};

/**
 * Cập nhật danh sách học phần của chương trình
 */
export const updateCoursesOfProgramme = async (id, courseIds) => {
  try {
    const response = await axios.put(`${API_PROGRAMMES}/${id}/courses`, courseIds, getAuthHeader());
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data || "Lỗi khi cập nhật học phần");
  }
};

/**
 * Xoá học phần khỏi chương trình
 */
export const removeCoursesFromProgramme = async (id, courseIds) => {
  try {
    await axios.delete(`${API_PROGRAMMES}/${id}/courses`, {
      ...getAuthHeader(),
      data: courseIds,
    });
  } catch (err) {
    throw new Error(err.response?.data || "Lỗi khi xoá học phần");
  }
};

/**
 * Cập nhật trạng thái cốt lõi (isCore) của các học phần trong chương trình
 */
export const updateCourseIsCoreStatus = async (id, updateCotLoiDTOs) => {
  try {
    const response = await axios.patch(
      `${API_PROGRAMMES}/${id}/courses/is-core`,
      updateCotLoiDTOs,
      getAuthHeader()
    );
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data || "Lỗi khi cập nhật trạng thái học phần cốt lõi");
  }
};
