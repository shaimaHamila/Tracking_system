import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Notification } from "../../types/Notification";
import { ApiResponse } from "./../../types/ApiResponse";
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
export const useMarkNotificationAsRead = () => {
  return useMutation<ApiResponse<Notification[]>, Error, number>({
    mutationFn: async (id: number) => {
      const { data } = await api.post<ApiResponse<Notification[]>>(`/notification/${id}`);
      return data;
    },
  });
};
export const useMarkAllUserNotificationsAsRead = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Notification[]>, Error>({
    mutationFn: async () => {
      const { data } = await api.put<ApiResponse<Notification[]>>(`/notification/mark-all-as-read`);
      return data;
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notification/fetchNotifications"] });
    },
  });
};
export const useAddNotificationFromSocket = (newNotification: Notification) => {
  console.log("newNotification hooooook", newNotification);
  const queryClient = useQueryClient();
  const oldNotifications = queryClient.getQueryData<ApiResponse<Notification[]>>(["notification/fetchNotifications"]);

  if (oldNotifications && newNotification) {
    queryClient.setQueryData(["notification/fetchNotifications"], {
      ...oldNotifications,
      data: [oldNotifications.data, newNotification],
    });
  }
};
