import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiResponse } from "../../types/ApiResponse";
import { Condition, Equipment, EquipmentBrand, EquipmentCategory } from "../../types/Equipment";
import api from "../../api/AxiosConfig";
import { notification } from "antd";
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
export const useFetchEquipmentsCategories = () => {
  return useQuery<ApiResponse<EquipmentCategory[]>>({
    queryKey: ["equipment/categories"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<EquipmentCategory[]>>("/equipment/categories");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};
// Fetch the brands
export const useFetchEquipmentsBrands = () => {
  useQuery<ApiResponse<EquipmentBrand[]>>({
    queryKey: ["zquipment/brands"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<EquipmentBrand[]>>("/equipment/brands");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Create Equipment
export const useCreateEquipment = () => {
  return useMutation<ApiResponse<Partial<Equipment>>, Error, Partial<Equipment>>({
    mutationFn: async (newEquipment: Partial<Equipment>) => {
      const { data } = await api.post<ApiResponse<Partial<Equipment>>>("/equipment", newEquipment);
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
  });
};
// Update Equipment

export const useUpdateEquipment = () => {
  return useMutation<ApiResponse<Partial<Equipment>>, Error, { id: number; equipmentToUpdate: Partial<Equipment> }>({
    mutationFn: async ({ id, equipmentToUpdate }) => {
      const { data } = await api.put<ApiResponse<Partial<Equipment>>>(`/equipment/`, equipmentToUpdate, {
        params: { id },
      });
      return data;
    },
    onSuccess: () => {
      notification.success({
        message: "Equipment updated successfully",
      });
    },
    onError: (error: any) => {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Error",
      });
    },
  });
};

// Delete Equipment
export const useDeleteEquipment = () => {
  return useMutation<ApiResponse<Partial<null>>, Error, number>({
    mutationFn: async (id: number) => {
      const { data } = await api.delete<ApiResponse<Partial<null>>>(`/equipment/${id}`);
      return data;
    },
    onSuccess: () => {
      notification.success({
        message: "Equipment deleted successfully",
      });
    },
    onError: (error: any) => {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Error",
      });
    },
  });
};
