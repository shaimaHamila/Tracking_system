import { useQuery } from "@tanstack/react-query";
import { Notification } from "../../types/Notification";
import { ApiResponse } from "../../types/ApiResponse";
import api from "../../api/AxiosConfig";

export const useFetchNotifications = () => {
  return useQuery<ApiResponse<Notification[]>>({
    queryKey: ["notification/fetchNotifications"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Notification[]>>("/notification");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
