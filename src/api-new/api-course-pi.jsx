import axios from 'axios';
import { getAccessToken } from "../utils/storage";
import { createSearchURL } from "../utils/string";
import { API_COURSE_PI } from './endpoints';
import { toast } from "sonner";

export const getFilteredCoursePIs = async (programmeId) => {
  try {
    const paramsObj = { programmeId };
    const url = createSearchURL(API_COURSE_PI, paramsObj);
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
}

export const upsertCoursePI = async (coursePI) => {
  try {
    const response = await axios.put(`${API_COURSE_PI}`, coursePI, {
      headers: { Authorization: getAccessToken() }
    });
    toast.success("Cập nhật trọng số của học phần đóng góp cho PI thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
}



