import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "../../types/ApiResponse";
import { Project, ProjectType } from "../../types/Project";
import api from "../../api/AxiosConfig";
import { notification } from "antd";

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

export const useFetchProjectById = (id: number | undefined) => {
  return useQuery<ApiResponse<Project>>({
    queryKey: ["project/fetchProjectById", id], // Include `id` in the key to make it unique
    queryFn: async () => {
      if (!id) throw new Error("Project ID is required");
      const { data } = await api.get<ApiResponse<Project>>("/project", { params: { id } });
      return data;
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!id, // Only enable the query if `id` is defined
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Partial<Project>>, Error, Partial<Project>>({
    mutationFn: async (newProject: Partial<Project>) => {
      const { data } = await api.post<ApiResponse<Partial<Project>>>("/project", newProject);
      return data;
    },
    onSuccess: () => {
      notification.success({
        message: "Project created successfully",
      });
    },
    onError: (error: any) => {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Error",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["project/fetchProjects"] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Partial<Project>>, Error, { id: number; projectToUpdate: Partial<Project> }>({
    mutationFn: async ({ id, projectToUpdate }) => {
      const { data } = await api.put<ApiResponse<Partial<Project>>>(`/project/`, projectToUpdate, { params: { id } });
      return data;
    },
    onSuccess: () => {
      notification.success({
        message: "Project updated successfully",
      });
    },
    onError: (error: any) => {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Error",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["project/fetchProjects"] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Partial<null>>, Error, number>({
    mutationFn: async (id: number) => {
      const { data } = await api.delete<ApiResponse<Partial<null>>>(`/project/${id}`);
      return data;
    },
    onSuccess: () => {
      notification.success({
        message: "Project deleted successfully",
      });
    },
    onError: (error: any) => {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Error",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["project/fetchProjects"] });
      queryClient.invalidateQueries({ queryKey: ["ticket/fetchTickets"] });
    },
  });
};
