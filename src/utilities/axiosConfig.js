import axios from "axios";
import Cookies from "js-cookie";

const axiosClient = axios.create();

// Request Interceptor - Attach token
axiosClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get("auth");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle token expiry
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check for token-expired condition
    if (
      error.response &&
      error.response.data &&
      (error.response.data.code === "TOKEN_EXPIRED"
      || error.response.data.code === "TOKEN_INVALID")
    ) {
      // Remove auth cookie
      Cookies.remove("auth");

      // Redirect to main page
      window.location.href = "/";

      // Optionally reject with custom message
      return Promise.reject("Token expired. Redirecting to login...");
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
