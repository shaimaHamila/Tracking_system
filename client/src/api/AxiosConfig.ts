import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_URL}/api/v1`,
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("token");

      window.location.href = "/login";
      await api.get("/auth/logout");
    }
    if (error.response.status === 500) {
      localStorage.removeItem("token");

      window.location.href = "/login";
      await api.get("/auth/logout");
    }
    return Promise.reject(error);
  },
);

export default api;
