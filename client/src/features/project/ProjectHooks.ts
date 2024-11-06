import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "../../types/ApiResponse";
import { Project, ProjectType } from "../../types/Project";
import api from "../../api/AxiosConfig";

interface FetchProjectsRequest {
  pageSize?: number | null;
  page?: number | null;
  projectType?: ProjectType | null;
  projectName?: string | null;
}

// Fetch projects
export const useFetchProjects = ({ pageSize, page, projectType, projectName }: FetchProjectsRequest) => {
  return useQuery<ApiResponse<Project[]>>({
    queryKey: ["project/fetchProjects", pageSize, page, projectType, projectName],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Project[]>>("/project/all", {
        params: { pageSize, page, projectType, projectName },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
