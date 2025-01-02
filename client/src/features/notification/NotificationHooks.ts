import { useQuery } from "@tanstack/react-query";
import { Notification } from "../../types/Notification";
import { ApiResponse } from "../../types/ApiResponse";
import api from "../../api/AxiosConfig";

interface FetchNotificationsRequest {
  pageSize?: number | null;
  page?: number | null;
}

export const useFetchNotifications = ({ pageSize, page }: FetchNotificationsRequest) => {
  return useQuery<ApiResponse<Notification[]>>({
    queryKey: ["notification/fetchNotifications", pageSize, page],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Notification[]>>("/notification", {
        params: { pageSize, page },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
