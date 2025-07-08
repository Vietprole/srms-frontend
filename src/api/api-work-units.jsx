import axios from "axios";
import API_BASE_URL from "./base-url";
import { getAccessToken } from "../utils/storage";

const API_WORK_UNITS = `${API_BASE_URL}/api/work-units`;

const getAuthHeader = () => ({
  headers: {
    Authorization: getAccessToken(),
  },
});

// Lấy danh sách đơn vị công tác
export const getAllWorkUnits = async () => {
  const res = await axios.get(API_WORK_UNITS, getAuthHeader());
  return res.data;
};
