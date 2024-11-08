import { EquipmentCondition } from "./../../../../server/src/controllers/EquipmentController";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "../../types/ApiResponse";
import { Equipment } from "../../types/Equipment";
import api from "../../api/AxiosConfig";
interface FetchEquipmentsRequest {
  pageSize?: number | null;
  page?: number | null;
  serialNumber?: number | null;
  condition?: EquipmentCondition | null;
}
// Fetch users
export const useFetchEquipments = ({ pageSize, page, serialNumber, condition }: FetchEquipmentsRequest) => {
  return useQuery<ApiResponse<Equipment[]>>({
    queryKey: ["user/fetchUsers", pageSize, page, serialNumber, condition],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Equipment[]>>("/user", {
        params: { pageSize, page, serialNumber, condition },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
