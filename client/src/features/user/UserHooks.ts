import { useQuery } from "@tanstack/react-query";
import api from "../../api/AxiosConfig";
import { User } from "../../types/User";

interface FetchUsersRequest {
  pageSize?: number | null;
  page?: number | null;
  roleId?: number | null;
  firstName?: string | null;
}
interface FetchUsersResponse {
  data: User[];
  meta: { currentPage: number; pageSize: number; totalCount: number; totalPages: number };
  message: string;
  succss: boolean;
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
export const useFetchUsers = ({ pageSize, page, roleId, firstName }: FetchUsersRequest) => {
  return useQuery<FetchUsersResponse>({
    queryKey: ["user/fetchUsers", pageSize, page, roleId, firstName],
    queryFn: async () => {
      const { data } = await api.get<FetchUsersResponse>("/user", {
        params: { pageSize, page, roleId, firstName },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// export const useUser = (id: string) => {
//   return useQuery(["user", id], () => async (id: string) => {
//     const { data } = await api.get(`/api/users/${id}`);
//     return data;
//   });
// };

// export const useCreateUser = () => {
//   const queryClient = useQueryClient();
//   return useMutation(
//     async (user: any) => {
//       const { data } = await api.post("/api/users", user);
//       return data;
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries("users");
//       },
//     },
//   );
// };

// export const useUpdateUser = () => {
//   const queryClient = useQueryClient();
//   return useMutation(
//     async (user: any) => {
//       const { data } = await api.put(`/api/users/${user.id}`, user);
//       return data;
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries("users");
//       },
//     },
//   );
// };

// export const useDeleteUser = () => {
//   const queryClient = useQueryClient();
//   return useMutation(
//     async (id: string) => {
//       const { data } = await api.delete(`/api/users/${id}`);
//       return data;
//     },
//     {
//       onSuccess: () => {
//         queryClient.invalidateQueries("users");
//       },
//     },
//   );
// };
