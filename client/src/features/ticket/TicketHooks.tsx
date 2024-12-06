import api from "../../api/AxiosConfig";
import { ApiResponse } from "../../types/ApiResponse";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ticket, TicketPriority, TicketStatusId, TicketType } from "../../types/Ticket";
import { ProjectType } from "../../types/Project";
import { notification } from "antd";
interface FetchTicketsRequest {
  pageSize?: number | null;
  page?: number | null;
  title?: string | null;
  projectType?: ProjectType | null;
  statusId?: TicketStatusId | null;
  priority?: TicketPriority | null;
  type?: TicketType;
  assignedUserId?: number | null;
  projectId?: number | null;
}
// Fetch tickets
export const useFetchTickets = ({ pageSize, page, title, statusId, priority, projectType }: FetchTicketsRequest) => {
  return useQuery<ApiResponse<Ticket[]>>({
    queryKey: ["ticket/fetchTickets", pageSize, page, title, statusId, priority, projectType],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Ticket[]>>("/ticket/", {
        params: { pageSize, page, title, statusId, priority, projectType },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Ticket>, Error, Partial<Ticket>>({
    mutationFn: async (ticket: Partial<Ticket>) => {
      const { data } = await api.post<ApiResponse<Ticket>>("/ticket/", ticket);
      return data;
    },
    onError: (error: any) => {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Error",
      });
    },
    onSuccess: () => {
      notification.success({
        message: "Ticket created successfully",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket/fetchTickets"] });
    },
  });
};

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Ticket>, Error, { id: number; ticketToUpdate: Partial<Ticket> }>({
    mutationFn: async ({ id, ticketToUpdate }) => {
      const { data } = await api.put<ApiResponse<Ticket>>(`/ticket/${id}`, ticketToUpdate);
      return data;
    },
    onSuccess: () => {
      notification.success({
        message: "Ticket updated successfully",
      });
    },
    onError: (error: any) => {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Error",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket/fetchTickets"] });
    },
  });
};

export const useDeleteTicket = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<null>, Error, number>({
    mutationFn: async (id: number) => {
      const { data } = await api.delete<ApiResponse<null>>(`/ticket/${id}`);
      return data;
    },
    onSuccess: () => {
      notification.success({
        message: "Ticket deleted successfully",
      });
    },
    onError: (error: any) => {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Error",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["ticket/fetchTickets"] });
    },
  });
};
