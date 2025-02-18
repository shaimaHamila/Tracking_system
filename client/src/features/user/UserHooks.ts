import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../../api/AxiosConfig";
import { User } from "../../types/User";
import { ApiResponse } from "../../types/ApiResponse";
import { notification } from "antd";

interface FetchUsersRequest {
  pageSize?: number | null;
  page?: number | null;
  roleId?: number | null;
  userName?: string | null;
}

//To fixs
export const useCurrentUser = (token: string) => {
  return useQuery({
    queryKey: ["user/current-user"],
    queryFn: async () => {
      const response = await api.get("/user/current-user");
      return response.data.data;
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
};

// Fetch users
export const useFetchUsers = ({ pageSize, page, roleId, userName }: FetchUsersRequest) => {
  return useQuery<ApiResponse<User[]>>({
    queryKey: ["user/fetchUsers", pageSize, page, roleId, userName],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<User[]>>("/user", {
        params: { pageSize, page, roleId, userName },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Partial<User>>, Error, Partial<User>>({
    mutationFn: async (newUser: Partial<User>) => {
      const { data } = await api.post<ApiResponse<Partial<User>>>("/user", newUser);
      return data;
    },
    onSuccess: (data) => {
      notification.success({
        message: data.message,
        description: "User created successfully",
      });
    },
    onError: (error: any) => {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Error",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user/fetchUsers"] });
    },
  });
};
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Partial<User>>, Error, { id: number; userData: Partial<User> }>({
    mutationFn: async ({ id, userData }) => {
      const { data } = await api.put<ApiResponse<Partial<User>>>(`/user/${id}`, userData);
      return data;
    },
    onSuccess: (data) => {
      notification.success({
        message: data.message,
        description: "User updated successfully",
      });
    },
    onError: (error: any) => {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Error",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user/fetchUsers"] });
    },
  });
};
export const useUpdateUserPassword = () => {
  return useMutation<ApiResponse<Partial<User>>, Error, { id: number; newPassword: string }>({
    mutationFn: async ({ id, newPassword }) => {
      const { data } = await api.put<ApiResponse<Partial<User>>>(`/user/updatePassword/${id}`, { newPassword });
      return data;
    },
    onSuccess: (data) => {
      notification.success({
        message: data.message,
        description: "Password updated successfully",
      });
    },
    onError: (error: any) => {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Error",
      });
    },
  });
};
export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Partial<null>>, Error, number>({
    mutationFn: async (id: number) => {
      const { data } = await api.delete<ApiResponse<Partial<null>>>(`/user/${id}`);
      return data;
    },
    onSuccess: (_data, id) => {
      notification.success({
        message: "User deleted successfully",
      });
      queryClient.invalidateQueries({ queryKey: ["user/fetchUsers"] });
      console.log("User deleted successfully");
      console.log(_data);
      console.log(id);
    },
    onError: (error: any) => {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Error",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user/fetchUsers"] });
      queryClient.invalidateQueries({ queryKey: ["project/fetchProjects"] });
      queryClient.invalidateQueries({ queryKey: ["ticket/fetchTickets"] });
    },
  });
};
