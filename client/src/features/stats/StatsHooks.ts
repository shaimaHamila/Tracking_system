import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "../../types/ApiResponse";
import api from "../../api/AxiosConfig";

// Fetch stats
export const useFetchStats = () => {
  return useQuery<ApiResponse<Stat>>({
    queryKey: ["stats/fetchStats"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Stat>>("/stats/dashboard");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
