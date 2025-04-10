import axios from "axios";
import Cookies from "js-cookie";  // Import js-cookie to read cookies

export const axiosInstance = axios.create({
  withCredentials: true, // ✅ Ensures cookies (including token) are sent automatically
});

export const apiConnector = (method, url, bodyData = null, customHeaders = {}, params = null) => {
  const token = Cookies.get("token"); // Get token from cookies
  const headers = {
    ...customHeaders, // Keep any custom headers
    ...(token ? { Authorization: `Bearer ${token}` } : {}), // Add token if available
  };
  
  return axiosInstance({
    method,
    url,
    data: bodyData,
    headers,
    params,
  });
};
