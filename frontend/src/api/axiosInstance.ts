import axios from "axios";
import { config } from "../config";

export const axiosInstance = axios.create({
  baseURL: config.api.url,
  withCredentials: true,
});

// Add response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login page on 401 Unauthorized
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);