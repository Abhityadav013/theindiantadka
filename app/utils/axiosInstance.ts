import axios from "axios";
import { base_url } from "./api_url";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // Ensure credentials are included in all requests
});

// Request Interceptor (Optional: If you need to modify headers)
api.interceptors.request.use(
  (config) => {
     const tid = sessionStorage.getItem("tid"); // Retrieve tid from session storage
    if (tid) {
      config.headers["tid"] = tid; // Add tid to request headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor (Optional: If you want to handle errors globally)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);


export default api;
