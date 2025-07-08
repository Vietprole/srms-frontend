import axios from "axios";
import "@/utils/storage";
import { getAccessToken } from "@/utils/storage";
import { createSearchURL } from "@/utils/string";
import { API_ACCOUNT } from "./endpoints";
import { toast } from "sonner";

export const login = async (username, password) => {
  try {
    const response = await axios.post(`${API_ACCOUNT}/login`, {
      username,
      password,
    });
    toast.success("Đăng nhập thành công");
    return response.data;
  } catch (error) {
    toast.error("Tên đăng nhập hoặc mật khẩu sai");
    console.log("error message: ", error.response?.data);
  }
};

export const getAllTaiKhoans = async () => {
  try {
    const response = await axios.get(API_ACCOUNT, {
      headers: { Authorization: getAccessToken() },
    });
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const getFilteredAccounts = async (roleId) => {
  try {
    const paramsObj = { roleId };
    const url = createSearchURL(API_ACCOUNT, paramsObj);
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

export const addTaiKhoan = async (data) => {
  try {
    console.log(data);
    const response = await axios.post(`${API_ACCOUNT}`, data, {
      headers: { Authorization: getAccessToken() },
    });
    toast.success("Tạo Tài khoản thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const updateTaiKhoan = async (id, data) => {
  try {
    const response = await axios.put(`${API_ACCOUNT}/${id}`, data, {
      headers: { Authorization: getAccessToken() },
    });
    toast.success("Sửa Tài khoản thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const deleteTaiKhoan = async (id) => {
  try {
    const response = await axios.delete(`${API_ACCOUNT}/${id}`, {
      headers: { Authorization: getAccessToken() },
    });
    toast.success("Xoá Tài khoản thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const resetPassword = async (id) => {
  try {
    const response = await axios.patch(
      `${API_ACCOUNT}/${id}/resetPassword`,
      {},
      {
        headers: { Authorization: getAccessToken() },
      }
    );
    toast.success("Đặt lại mật khẩu thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};

export const changePassword = async (data) => {
  try {
    const response = await axios.patch(`${API_ACCOUNT}/password`, data, {
      headers: { Authorization: getAccessToken() },
    });
    toast.success("Đổi mật khẩu thành công");
    return response.data;
  } catch (error) {
    console.log("error message: ", error.message);
    toast.error(error.response?.data || "Lỗi bất định");
    throw new Error(error.response?.data || "Lỗi bất định");
  }
};
