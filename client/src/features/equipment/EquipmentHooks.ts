import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "../../types/ApiResponse";
import { Condition, Equipment } from "../../types/Equipment";
import api from "../../api/AxiosConfig";
interface FetchEquipmentsRequest {
  pageSize?: number | null;
  page?: number | null;
  serialNumber?: string | null;
  conditions?: Condition[] | null;
}
// Fetch Equipments
export const useFetchEquipments = ({ pageSize, page, serialNumber, conditions }: FetchEquipmentsRequest) => {
  return useQuery<ApiResponse<Equipment[]>>({
    queryKey: ["equipment/fetchEquipments", pageSize, page, serialNumber, conditions],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<Equipment[]>>("/equipment/all", {
        params: { pageSize, page, serialNumber, conditions },
      });
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Fetch the categories

// Fetch the brands

// Create a new equipment
