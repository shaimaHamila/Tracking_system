import { ApiResponse } from "./../../types/ApiResponse";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

// Add new category
export const useCreateEquipmentCategory = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Partial<EquipmentCategory>>, Error, Partial<EquipmentCategory>>({
    mutationFn: async (newCategory: Partial<EquipmentCategory>) => {
      const { data } = await api.post<ApiResponse<Partial<EquipmentCategory>>>("equipment/category/add", newCategory);
      return data;
    },
    onSuccess: () => {
      notification.success({
        message: "Brand created successfully",
      });
    },
    onError: (error: any) => {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Error",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment/categories"] });
    },
  });
};
// Fetch the categories
export const useFetchEquipmentsCategories = () => {
  return useQuery<ApiResponse<EquipmentCategory[]>>({
    queryKey: ["equipment/categories"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<EquipmentCategory[]>>("/equipment/category/all");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Add new brand
export const useCreateEquipmentBrand = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Partial<EquipmentBrand>>, Error, Partial<EquipmentBrand>>({
    mutationFn: async (newBrand: Partial<EquipmentBrand>) => {
      const { data } = await api.post<ApiResponse<Partial<EquipmentBrand>>>("equipment/brand/add", newBrand);
      return data;
    },
    onSuccess: () => {
      notification.success({
        message: "Brand created successfully",
      });
    },
    onError: (error: any) => {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Error",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment/brands"] });
    },
  });
};
// Fetch the brands
export const useFetchEquipmentsBrands = () => {
  return useQuery<ApiResponse<EquipmentBrand[]>>({
    queryKey: ["equipment/brands"],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<EquipmentBrand[]>>("/equipment/brand/all");
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

// Create Equipment
export const useCreateEquipment = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Partial<Equipment>>, Error, Partial<Equipment>>({
    mutationFn: async (newEquipment: Partial<Equipment>) => {
      const { data } = await api.post<ApiResponse<Partial<Equipment>>>("/equipment", newEquipment);
      return data;
    },
    onSuccess: (newEquipmentRes) => {
      notification.success({
        message: "Equipment created successfully",
      });

      const previousQueries = queryClient.getQueriesData<ApiResponse<Equipment[]>>({
        queryKey: ["equipment/fetchEquipments"],
      });
      // Optimistically update each query's data
      previousQueries.forEach(([queryKey, oldData]) => {
        if (oldData) {
          queryClient.setQueryData<ApiResponse<Partial<Equipment>[]>>(queryKey, {
            ...oldData,
            data: [...(oldData?.data || []), newEquipmentRes.data as Partial<Equipment>],
          });
        }
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
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<Partial<Equipment>>, Error, { id: number; equipmentToUpdate: Partial<Equipment> }>({
    mutationFn: async ({ id, equipmentToUpdate }) => {
      const { data } = await api.put<ApiResponse<Partial<Equipment>>>(`/equipment/update`, equipmentToUpdate, {
        params: { id },
      });
      return data;
    },
    onSuccess: (updatedEquipmentRes) => {
      notification.success({
        message: "Equipment updated successfully",
      });
      const oldEquipments = queryClient.getQueryData<ApiResponse<Equipment[]>>(["equipment/fetchEquipments"]);
      queryClient.setQueryData(["equipment/fetchEquipments"], {
        ...oldEquipments,
        data: oldEquipments?.data?.map((equipment) =>
          equipment.id == updatedEquipmentRes?.data?.id ? updatedEquipmentRes?.data : equipment,
        ),
      });
    },
    onError: (error: any) => {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Error",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment/fetchEquipments"] });
    },
  });
};

// Assign Equipment to user
export const useAssignEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Partial<Equipment>>, Error, { equipmentId: number; assignedToId: number }>({
    mutationFn: async ({ equipmentId, assignedToId }) => {
      const { data } = await api.put<ApiResponse<Partial<Equipment>>>(`/equipment/assignedTo`, {
        equipmentId,
        assignedToId,
      });
      return data;
    },
    onSuccess: (updatedEquipmentRes) => {
      notification.success({
        message: "User assigned successfully",
      });
      const oldEquipments = queryClient.getQueryData<ApiResponse<Equipment[]>>(["equipment/fetchEquipments"]);
      queryClient.setQueryData(["equipment/fetchEquipments"], {
        ...oldEquipments,
        data: oldEquipments?.data?.map((equipment) =>
          equipment.id == updatedEquipmentRes?.data?.id ? updatedEquipmentRes?.data : equipment,
        ),
      });
    },
    onError: (error: any) => {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Error",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["equipment/fetchEquipments"] });
    },
  });
};

// Delete Equipment
export const useDeleteEquipment = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<Partial<null>>, Error, number>({
    mutationFn: async (id: number) => {
      const { data } = await api.delete<ApiResponse<Partial<null>>>(`/equipment/${id}`);
      return data;
    },
    onError: (error: any) => {
      notification.error({
        message: "Error deleting equipment",
        description: error.response?.data?.message || "An unexpected error occurred",
      });

      // Rollback to the previous state if the mutation fails
    },
    onSuccess: (_res, id) => {
      notification.success({
        message: "Equipment deleted successfully",
      });
      // Snapshot of previous state
      const previousQueries = queryClient.getQueriesData<ApiResponse<Equipment[]>>({
        queryKey: ["equipment/fetchEquipments"],
      });
      // Optimistically update each query's data
      previousQueries.forEach(([queryKey, oldData]) => {
        if (oldData) {
          queryClient.setQueryData<ApiResponse<Equipment[]>>(queryKey, {
            ...oldData,
            data: oldData?.data?.filter((equipment) => equipment.id !== id),
          });
        }
      });
    },
  });
};
