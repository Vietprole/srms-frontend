
import axios from "axios";
import API_BASE_URL from "./base-url";
import { getAccessToken } from "../utils/storage";

const API_ROLES = `${API_BASE_URL}/api/roles`;

const getAuthHeader = () => ({
  headers: {
    Authorization: getAccessToken(),
  },
});

// Lấy danh sách tất cả vai trò (role)
export const getAllRoles = async () => {
  const res = await axios.get(API_ROLES, getAuthHeader());
  return res.data;
};
