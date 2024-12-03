import { useMutation } from "@tanstack/react-query";
import api from "../../api/AxiosConfig";
import { notification } from "antd";
import { User } from "../../types/User";

interface Credentials {
  email: string;
  password: string;
}

interface UserResponse {
  accessToken: string;
  refreshToken: string;
  data: User;
  message: string;
  succss: boolean;
}
export const useLogin = () => {
  return useMutation<UserResponse, Error, Credentials>({
    mutationFn: async (credentials) => {
      const res = await api.post<UserResponse>("/auth/login", credentials);
      console.log(res.data);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("accessToken", data.accessToken);
      console.log(data);
      // Additional logic on success (e.g., redirect, show a message)
      notification.success({
        message: data.message,
        description: "Welcome back",
      });
    },
    onError: (error: any) => {
      notification.error({
        message: "Login Failed",
        description: error.response?.data?.message || "Error",
      });
    },
  });
};
