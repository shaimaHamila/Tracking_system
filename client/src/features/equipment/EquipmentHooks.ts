import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "../../types/ApiResponse";
import { Condition, Equipment } from "../../types/Equipment";
import api from "../../api/AxiosConfig";
interface FetchEquipmentsRequest {
  pageSize?: number | null;
  page?: number | null;
  serialNumber?: string | null;
  condition?: Condition | null;
}
// Fetch users
export const useFetchEquipments = ({ pageSize, page, serialNumber, condition }: FetchEquipmentsRequest) => {
  return useQuery<ApiResponse<Equipment[]>>({
    queryKey: ["equipment/fetchEquipments", pageSize, page, serialNumber, condition],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Equipment[]>>("/equipment/all", {
        params: { pageSize, page, serialNumber, condition },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
