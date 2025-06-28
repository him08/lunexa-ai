import axios from "axios";
import Cookies from "js-cookie";

const axiosClient = axios.create();

// set authorization in all axios api calls
axiosClient.interceptors.request.use(async (config) => {
  const token = Cookies.get('auth')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default axiosClient;
