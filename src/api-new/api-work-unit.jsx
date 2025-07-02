import axios from "axios";
import { getAccessToken } from "../utils/storage";
import { API_WORK_UNIT } from "./endpoints";
import { toast } from "sonner"

export const getAllWorkUnits = async () => {
  try {
    const response = await axios.get(API_WORK_UNIT, {
      headers: { Authorization: getAccessToken() },
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};
