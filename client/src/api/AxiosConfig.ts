import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BASE_URL}/api/v1`,
  withCredentials: false,
});

api.interceptors.response.use(
  (response: any) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("token");

      window.location.href = "/login";
    }
    if (error.response.status === 500) {
      localStorage.removeItem("token");

      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
