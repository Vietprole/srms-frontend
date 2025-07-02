import API_BASE_URL from "./base-url";
import axios from "axios";
import "@/utils/storage";
import { getAccessToken } from "@/utils/storage";
import { createSearchURL } from "@/utils/string";

const API_ACCOUNTS = `${API_BASE_URL}/api/accounts`;

export const loginApi = async (username, password) => {
  try {
    const response = await axios.post(`${API_ACCOUNTS}/login`, {
      username,
      password,
    });
    if (response.status === 200) {
      return response.data;
    } else {
      return {
        success: false,
        message: "Unexpected response status",
      };
    }
  } catch (error) {
    console.log("Error message:", error.message);
    return {
      success: false,
      message: "Có lỗi xảy ra, vui lòng thử lại!",
    };
  }
};

export const getAllAccounts = async () => {
  try {
    const response = await axios.get(API_ACCOUNTS, {
      headers: { Authorization: getAccessToken() },
    });
    return response.data;
  } catch (error) {
    console.log("Error message:", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getAccountsByRole = async (roleId) => {
  try {
    const paramsObj = { roleId };
    const url = createSearchURL(API_ACCOUNTS, paramsObj);
    console.log("url:", url);
    const response = await axios.get(url, {
      headers: { Authorization: getAccessToken() },
    });
    return response.data;
  } catch (error) {
    console.log("Error message:", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const createAccount = async (data) => {
  try {
    const response = await axios.post(`${API_ACCOUNTS}`, data, {
      headers: { Authorization: getAccessToken() },
    });
    return response.data;
  } catch (error) {
    console.log("Error message:", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const updateAccount = async (id, data) => {
  try {
    const response = await axios.put(`${API_ACCOUNTS}/${id}`, data, {
      headers: { Authorization: getAccessToken() },
    });
    return response.data;
  } catch (error) {
    console.log("Error message:", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const deleteAccount = async (id) => {
  try {
    const response = await axios.delete(`${API_ACCOUNTS}/${id}`, {
      headers: { Authorization: getAccessToken() },
    });
    return response.data;
  } catch (error) {
    console.log("Error message:", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const resetAccountPassword = async (id) => {
  try {
    const response = await axios.patch(`${API_ACCOUNTS}/${id}/resetPassword`, {}, {
      headers: { Authorization: getAccessToken() },
    });
    return response.data;
  } catch (error) {
    console.log("Error message:", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const changePassword = async (data) => {
  try {
    const response = await axios.patch(`${API_ACCOUNTS}/password`, data, {
      headers: { Authorization: getAccessToken() },
    });
    return response.data;
  } catch (error) {
    console.log("Error message:", error.message);
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};
