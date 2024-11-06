import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "../../types/ApiResponse";
import { Project } from "../../types/Project";
import api from "../../api/AxiosConfig";

interface FetchUsersRequest {
  pageSize?: number | null;
  page?: number | null;
  roleId?: number | null;
  firstName?: string | null;
}

// Fetch projects
export const useFetchUsers = ({ pageSize, page, roleId, firstName }: FetchUsersRequest) => {
  return useQuery<ApiResponse<Project[]>>({
    queryKey: ["user/fetchUsers", pageSize, page, roleId, firstName],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Project[]>>("/project", {
        params: { pageSize, page, roleId },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
