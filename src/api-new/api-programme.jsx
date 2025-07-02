import axios from "axios";
import { getAccessToken } from "../utils/storage";
import { API_PROGRAMME } from "./endpoints";
import { createSearchURL } from "../utils/string";
import { toast } from "sonner";

export const getFilteredProgrammes = async (majorId, managerAccountId) => {
  try {
    const paramsObj = { majorId, managerAccountId };
    const url = createSearchURL(API_PROGRAMME, paramsObj);
    console.log("url: ", url);

    const response = await axios.get(url, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getAllProgrammes = async () => {
  try {
    const response = await axios.get(API_PROGRAMME, {
      headers: { Authorization: getAccessToken() },
    });
    console.log("response data: ", response.data);
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to get a single nganh by ID
export const getProgrammeById = async (programmeId) => {
  try {
    const response = await axios.get(`${API_PROGRAMME}/${programmeId}`, {
      headers: { Authorization: getAccessToken() },
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to add a new nganh
export const createProgramme = async (nganhData) => {
  try {
    const response = await axios.post(API_PROGRAMME, nganhData, {
      headers: { Authorization: getAccessToken() },
    });
    toast.success("Tạo CTĐT thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to update an existing nganh
export const updateProgramme = async (programmeId, updatedData) => {
  try {
    const response = await axios.put(
      `${API_PROGRAMME}/${programmeId}`,
      updatedData,
      {
        headers: { Authorization: getAccessToken() },
      }
    );
    toast.success("Sửa CTĐT thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

// Function to delete a nganh
export const deleteProgramme = async (programmeId) => {
  try {
    const response = await axios.delete(`${API_PROGRAMME}/${programmeId}`, {
      headers: { Authorization: getAccessToken() },
    });
    toast.success("Xoá CTĐT thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getCoursesInProgramme = async (programmeId, facultyId, isCore) => {
  try {
    const paramsObj = { facultyId, isCore };
    const url = createSearchURL(
      `${API_PROGRAMME}/${programmeId}/courses`,
      paramsObj
    );
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

export const addCoursesToProgramme = async (programmeId, courseIdsList) => {
  try {
    const response = await axios.post(
      `${API_PROGRAMME}/${programmeId}/courses`,
      courseIdsList,
      {
        headers: { Authorization: getAccessToken() },
      }
    );
    toast.success("Thêm học phần vào CTĐT thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const removeCoursesFromProgramme = async (
  programmeId,
  courseIdsList
) => {
  try {
    const response = await axios.delete(
      `${API_PROGRAMME}/${programmeId}/courses`,
      {
        data: courseIdsList,
        headers: { Authorization: getAccessToken() },
      }
    );
    toast.success("Bỏ học phần khỏi CTĐT thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const updateCoursesIsCoreStatus = async (
  programmeId,
  updateIsCoreDTOs
) => {
  try {
    const response = await axios.patch(
      `${API_PROGRAMME}/${programmeId}/courses/is-core`,
      updateIsCoreDTOs,
      {
        headers: { Authorization: getAccessToken() },
      }
    );
    toast.success("Cập nhật học phần cốt lõi thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const createProgrammeWithCourses = async (nganhData) => {
  try {
    const response = await axios.post(
      `${API_PROGRAMME}/createwithcourse`,
      nganhData,
      {
        headers: { Authorization: getAccessToken() },
      }
    );
    toast.success("Tạo CTĐT với học phần thành công");
    return response.data;
  } catch (error) {
    console.error("Lỗi khi tạo CTĐT: ", error.message);
    toast.error(error.response?.data || "Lỗi khi tạo CTĐT");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};
