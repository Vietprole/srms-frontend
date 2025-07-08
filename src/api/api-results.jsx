import axios from "axios";
import API_BASE_URL from "./base-url";
import { getAccessToken } from "../utils/storage";

const API_RESULTS = `${API_BASE_URL}/api/results`;

const getAuthHeader = () => ({
  headers: {
    Authorization: getAccessToken(),
  },
});

// Lấy danh sách kết quả theo bộ lọc
export const getResults = async (examId, studentId, classId) => {
  const params = new URLSearchParams();
  if (examId) params.append("examId", examId);
  if (studentId) params.append("studentId", studentId);
  if (classId) params.append("classId", classId);

  const res = await axios.get(`${API_RESULTS}?${params.toString()}`, getAuthHeader());
  return res.data;
};

// Lấy kết quả theo ID
export const getResultById = async (id) => {
  const res = await axios.get(`${API_RESULTS}/${id}`, getAuthHeader());
  return res.data;
};

// Tạo kết quả
export const createResult = async (data) => {
  const res = await axios.post(API_RESULTS, data, getAuthHeader());
  return res.data;
};

// Cập nhật kết quả
export const updateResult = async (id, data) => {
  const res = await axios.put(`${API_RESULTS}/${id}`, data, getAuthHeader());
  return res.data;
};

// Upsert kết quả
export const upsertResult = async (data) => {
  const res = await axios.put(`${API_RESULTS}/upsert`, data, getAuthHeader());
  return res.data;
};

// Xoá kết quả
export const deleteResult = async (id) => {
  await axios.delete(`${API_RESULTS}/${id}`, getAuthHeader());
};

// Xác nhận kết quả
export const confirmResult = async (data) => {
  const res = await axios.post(`${API_RESULTS}/confirm`, data, getAuthHeader());
  return res.data;
};

// Duyệt điểm chính thức
export const acceptResult = async (data) => {
  const res = await axios.post(`${API_RESULTS}/accept`, data, getAuthHeader());
  return res.data;
};

// Tính điểm CLO cho 1 sinh viên
export const calculateCLOScore = async (studentId, classId, cloId, useTemporaryScore = false) => {
  const res = await axios.get(`${API_RESULTS}/calculate-clo-score`, {
    params: { studentId, classId, cLOId: cloId, useTemporaryScore },
    ...getAuthHeader(),
  });
  return res.data;
};

// Tính điểm CLO tối đa trong lớp
export const calculateCLOScoreMax = async (cloId, classId) => {
  const res = await axios.get(`${API_RESULTS}/calculate-clo-score-max`, {
    params: { cLOId: cloId, classId },
    ...getAuthHeader(),
  });
  return res.data;
};

// Tính điểm Pk
export const calculatePkScore = async (classId, studentId, piId, useTemporaryScore = false) => {
  const res = await axios.get(`${API_RESULTS}/calculate-pk-score`, {
    params: { classId, studentId, piId, useTemporaryScore },
    ...getAuthHeader(),
  });
  return res.data;
};

// Tính điểm PI
export const calculatePIScore = async (studentId, piId, useTemporaryScore = false) => {
  const res = await axios.get(`${API_RESULTS}/calculate-pi-score`, {
    params: { studentId, piId, useTemporaryScore },
    ...getAuthHeader(),
  });
  return res.data;
};

// Tính điểm PLO
export const calculatePLOScore = async (studentId, ploId, useTemporaryScore = false) => {
  const res = await axios.get(`${API_RESULTS}/calculate-plo-score`, {
    params: { studentId, ploId, useTemporaryScore },
    ...getAuthHeader(),
  });
  return res.data;
};

// Lấy điểm CLO tất cả sinh viên trong lớp
export const getStudentCLOScoresForClass = async (classId, useTemporaryScore = false) => {
  const res = await axios.get(`${API_RESULTS}/student-clo-scores-for-class`, {
    params: { classId, useTemporaryScore },
    ...getAuthHeader(),
  });
  return res.data;
};

// Lấy điểm Pk tất cả sinh viên trong lớp
export const getStudentPkScoresForClass = async (classId, useTemporaryScore = false) => {
  const res = await axios.get(`${API_RESULTS}/student-pk-scores-for-class`, {
    params: { classId, useTemporaryScore },
    ...getAuthHeader(),
  });
  return res.data;
};

// Tính điểm Pk tối đa của một PI trong một học phần
export const calculateMaxPkScoreForCourse = async (courseId, studentId, piId, useTemporaryScore = false) => {
  const res = await axios.get(`${API_RESULTS}/calculate-max-pk-score-for-course`, {
    params: { courseId, studentId, piId, useTemporaryScore },
    ...getAuthHeader(),
  });
  return res.data;
};

// Lấy điểm PI tất cả sinh viên trong CTĐT
export const getStudentPIScoresForProgramme = async (programmeId, useTemporaryScore = false) => {
  const res = await axios.get(`${API_RESULTS}/student-pi-scores-for-programme`, {
    params: { programmeId, useTemporaryScore },
    ...getAuthHeader(),
  });
  return res.data;
};

// Lấy điểm PLO tất cả sinh viên trong CTĐT
export const getStudentPLOScoresForProgramme = async (programmeId, useTemporaryScore = false) => {
  const res = await axios.get(`${API_RESULTS}/student-plo-scores-for-programme`, {
    params: { programmeId, useTemporaryScore },
    ...getAuthHeader(),
  });
  return res.data;
};

// Lấy phần trăm qua CLO theo lớp
export const getCLOPassedPercentages = async (classId, threshold, useTemporaryScore = false) => {
  const res = await axios.get(`${API_RESULTS}/clo-passed-percentages`, {
    params: { classId, threshold, useTemporaryScore },
    ...getAuthHeader(),
  });
  return res.data;
};

// Lấy phần trăm qua PLO theo CTĐT
export const getPLOPassedPercentages = async (programmeId, threshold, useTemporaryScore = false) => {
  const res = await axios.get(`${API_RESULTS}/plo-passed-percentages`, {
    params: { programmeId, threshold, useTemporaryScore },
    ...getAuthHeader(),
  });
  return res.data;
};
