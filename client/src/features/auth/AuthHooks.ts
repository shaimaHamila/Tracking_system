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
      return res.data;
    },
    onSuccess: (data) => {
      localStorage.setItem("token", data.user.token); // Store the token
      // Additional logic on success (e.g., redirect, show a message)
    },
    onError: (error) => {
      console.error("Login failed:", error);
      notification.error({
        message: "Login Failed",
        description: error?.message || "An unknown error occurred. Please try again.",
      });
    },
  });
};
