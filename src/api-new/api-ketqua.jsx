import axios from "axios";
import { getAccessToken } from "../utils/storage";
import { createSearchURL } from "../utils/string";
import { API_RESULT } from './endpoints';

// export const getKetQuasByLopHocPhanId = async (lopHocPhanId) => {
//   try {
//     const response = await axios.get(`${API_RESULT}?lopHocPhanId=${lopHocPhanId}`);
//     return response.data;
//   } catch (error) {
//     console.log("error message: ", error.response?.data);
//   }
// };

export const getAllKetQuas = async () => {
  try {
    const response = await axios.get(API_RESULT, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.response?.data);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getKetQuas = async (examId, studentId, classId) => {
  try {
    const paramsObj = { examId, studentId, classId };
    const url = createSearchURL(API_RESULT, paramsObj);
    console.log("url kq: ", url);

    const response = await axios.get(url, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.response?.data);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

// Function to get a single ketqua by ID
export const getKetQuaById = async (ketquaId) => {
  try {
    const response = await axios.get(`${API_RESULT}/${ketquaId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.response?.data);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to add a new ketqua
export const addKetQua = async (ketquaData) => {
  try {
    const response = await axios.post(API_RESULT, ketquaData, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.response?.data);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to update an existing ketqua
export const updateKetQua = async (updatedData) => {
  try {
    const response = await axios.put(`${API_RESULT}`, updatedData, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.response?.data);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const upsertKetQua = async (ketquaData) => {
  try {
    const response = await axios.put(`${API_RESULT}/upsert`, ketquaData, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.response?.data);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

// Function to delete a ketqua
export const deleteKetQua = async (ketquaId) => {
  try {
    const response = await axios.delete(`${API_RESULT}/${ketquaId}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.response?.data);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const confirmKetQua = async (confirmKetQuaDTO) => {
  try {
    const response = await axios.post(`${API_RESULT}/confirm`, confirmKetQuaDTO, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.response?.data);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const acceptKetQua = async (acceptKetQuaDTO) => {
  try {
    const response = await axios.post(`${API_RESULT}/accept`, acceptKetQuaDTO, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.response?.data);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const calculateCLOScore = async (studentId, classId, CLOId, useTemporaryScore = false) => {
  try {
    const paramsObj = { studentId, classId, CLOId, useTemporaryScore };
    const url = createSearchURL(`${API_RESULT}/calculate-clo-score`, paramsObj);
    console.log("url: ", url);

    const response = await axios.get(url, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.response?.data);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const calculateCLOScoreMax = async (CLOId, classId) => {
  try {
    const paramsObj = { classId, CLOId };
    const url = createSearchURL(`${API_RESULT}/calculate-clo-score-max`, paramsObj);
    console.log("url: ", url);

    const response = await axios.get(url, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.response?.data);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const calculatePkScore = async (classId, studentId, piId, useTemporaryScore = false) => {
  try {
    const response = await axios.get(`${API_RESULT}/calculate-pk-score?classId=${classId}&studentId=${studentId}&piId=${piId}&useTemporaryScore=${useTemporaryScore}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.response?.data);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const calculateMaxPkScoreForCourse = async (courseId, studentId, piId, useTemporaryScore = false) => {
  try {
    const response = await axios.get(`${API_RESULT}/calculate-max-pk-score-for-course?courseId=${courseId}&studentId=${studentId}&piId=${piId}&useTemporaryScore=${useTemporaryScore}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.response?.data);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const calculatePIScore = async (studentId, piId, useTemporaryScore = false) => {
  try {
    const response = await axios.get(`${API_RESULT}/calculate-pi-score?studentId=${studentId}&piId=${piId}&useTemporaryScore=${useTemporaryScore}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.response?.data);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}
export const calculatePLOScore = async (studentId, ploId, useTemporaryScore = false) => {
  try {
    const response = await axios.get(`${API_RESULT}/calculate-plo-score?studentId=${studentId}&ploId=${ploId}&useTemporaryScore=${useTemporaryScore}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.response?.data);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const getCLOPassedPercentages = async (classId, threshold, useTemporaryScore = false) => {
  try {
    const response = await axios.get(`${API_RESULT}/clo-passed-percentages?classId=${classId}&threshold=${threshold}&useTemporaryScore=${useTemporaryScore}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.response?.data);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const getPLOPassedPercentages = async (programmeId, threshold, useTemporaryScore = false) => {
  try {
    const response = await axios.get(`${API_RESULT}/plo-passed-percentages?programmeId=${programmeId}&threshold=${threshold}&useTemporaryScore=${useTemporaryScore}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.response?.data);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const getAllStudentCLOScoresForClass = async (classId, useTemporaryScore = false) => {
  try {
    const response = await axios.get(`${API_RESULT}/student-clo-scores-for-class?classId=${classId}&useTemporaryScore=${useTemporaryScore}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.response?.data);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const getAllStudentPkScoresForClass = async (classId, useTemporaryScore = false) => {
  try {
    const response = await axios.get(`${API_RESULT}/student-pk-scores-for-class?classId=${classId}&useTemporaryScore=${useTemporaryScore}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.response?.data);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const getAllStudentPIScoresForProgramme = async (programmeId, useTemporaryScore = false) => {
  try {
    const response = await axios.get(`${API_RESULT}/student-pi-scores-for-programme?programmeId=${programmeId}&useTemporaryScore=${useTemporaryScore}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.response?.data);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}

export const getAllStudentPLOScoresForProgramme = async (programmeId, useTemporaryScore = false) => {
  try {
    const response = await axios.get(`${API_RESULT}/student-plo-scores-for-programme?programmeId=${programmeId}&useTemporaryScore=${useTemporaryScore}`, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.response?.data);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}
