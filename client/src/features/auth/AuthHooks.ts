import { useMutation } from "@tanstack/react-query";
import api from "../../api/AxiosConfig";
import { notification } from "antd";

interface Credentials {
  email: string;
  password: string;
}

interface UserResponse {
  user: {
    id: number;
    name: string;
    email: string;
    token: string;
  };
}
export const useLogin = () => {
  return useMutation<UserResponse, Error, Credentials>({
    mutationFn: async (credentials) => {
      const res = await api.post<UserResponse>("/auth/login", credentials);
      console.log(res.data);
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.user.token); // Store the token
      // Additional logic on success (e.g., redirect, show a message)
      notification.success({
        message: "Login Success",
        description: "Welcome back",
      });
    },
    onError: (error: any) => {
      notification.error({
        message: "Login Failed",
        description: error.response?.data?.message || "Invalid email or password",
      });
    },
  });
};
