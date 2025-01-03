import API_BASE_URL from "./base-url";
import axios from 'axios';
import { getAccessToken } from "../utils/storage";

const API_CHUCVU = `${API_BASE_URL}/api/chucvu`;

export const getAllChucVus = async () => {
  try {
    const response = await axios.get(API_CHUCVU, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};
