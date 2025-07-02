import axios from 'axios';
import { getAccessToken } from "../utils/storage";
import { API_ROLE } from './endpoints';

export const getAllChucVus = async () => {
  try {
    const response = await axios.get(API_ROLE, {
      headers: { Authorization: getAccessToken() }
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};
