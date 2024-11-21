import api from "../../api/AxiosConfig";
import { ApiResponse } from "../../types/ApiResponse";
import { useQuery } from "@tanstack/react-query";
import { Ticket, TicketPriority, TicketStatusId, TicketType } from "../../types/Ticket";
import { ProjectType } from "../../types/Project";
interface FetchTicketsRequest {
  pageSize?: number | null;
  page?: number | null;
  title?: string | null;
  projectType?: ProjectType;
  statusId?: TicketStatusId;
  priority?: TicketPriority;
  type?: TicketType;
  assignedUserId?: number | null;
  projectId?: number | null;
}
// Fetch Equipments
export const useFetchTickets = ({ pageSize, page, title, statusId, priority }: FetchTicketsRequest) => {
  return useQuery<ApiResponse<Ticket[]>>({
    queryKey: ["equipment/fetchTickets", pageSize, page, title, statusId, priority],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Ticket[]>>("/ticket/", {
        params: { pageSize, page, title, statusId, priority },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};