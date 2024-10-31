import axios, { InternalAxiosRequestConfig } from "axios";

// Public API client
export const publicApi = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/v1`,
});

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/v1`,
  withCredentials: false,
  timeout: 10000,
});

// Only attach token for apiWithAuth instance
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors globally
api.interceptors.response.use(
  (response: any) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401 || error.response.status === 500) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
