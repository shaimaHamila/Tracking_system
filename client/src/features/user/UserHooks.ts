import { useQuery, useMutation, useQueryClient } from "react-query";
import api from "../../api/AxiosConfig";

export const useCurrentUser = () => {
  return useQuery(
    "currentUser",
    async () => {
      const { data } = await api.get("/user/current-user");
      return data;
    },
    // {
    //   staleTime: 5 * 60 * 1000, // Cache user data for 5 minutes
    //   cacheTime: 10 * 60 * 1000,
    //   retry: false,
    // },
  );
};

export const useUsers = () => {
  return useQuery("users", async () => {
    const { data } = await api.get("/api/users");
    return data;
  });
};

export const useUser = (id: string) => {
  return useQuery(["user", id], () => async (id: string) => {
    const { data } = await api.get(`/api/users/${id}`);
    return data;
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (user: any) => {
      const { data } = await api.post("/api/users", user);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
    },
  );
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (user: any) => {
      const { data } = await api.put(`/api/users/${user.id}`, user);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
    },
  );
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  return useMutation(
    async (id: string) => {
      const { data } = await api.delete(`/api/users/${id}`);
      return data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("users");
      },
    },
  );
};
