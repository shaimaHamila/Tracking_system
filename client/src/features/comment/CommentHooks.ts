import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "../../types/ApiResponse";
import { CommentType } from "../../types/Comment";
import api from "../../api/AxiosConfig";
import { notification } from "antd";

interface FetchTicketCommentsRequest {
  ticketId: number;
}

// Fetch Ticket Comments
export const useFetchTicketComments = ({ ticketId }: FetchTicketCommentsRequest) => {
  return useQuery<ApiResponse<CommentType[]>>({
    queryKey: ["comment/fetchTicketComments", ticketId],
    queryFn: async () => {
      const { data } = await api.get<ApiResponse<CommentType[]>>(`/comment/ticket/${ticketId}`);
      return data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

//Add new Comment
export const useAddComment = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<CommentType>, Error, { newComment: Partial<CommentType>; ticketId: number }>({
    mutationFn: async ({ newComment, ticketId }) => {
      const { data } = await api.post<ApiResponse<CommentType>>("/comment/add", newComment, { params: { ticketId } });
      return data;
    },
    onSuccess: (newCommentResponse, { ticketId }) => {
      const oldComments = queryClient.getQueryData<ApiResponse<CommentType[]>>([
        "comment/fetchTicketComments",
        ticketId,
      ]);

      if (oldComments) {
        queryClient.setQueryData(["comment/fetchTicketComments", ticketId], {
          ...oldComments,
          data: [newCommentResponse.data, ...(oldComments?.data || [])],
        });
      }
    },
    onError: (error: any) => {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Error adding comment",
      });
    },
  });
};

//Update Comment
export const useUpdateComment = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<CommentType>, Error, { comment: Partial<CommentType>; ticketId: number }>({
    mutationFn: async ({ comment }) => {
      const { data } = await api.put<ApiResponse<CommentType>>(`/comment/update/`, comment, {
        params: { commentId: comment.id },
      });
      return data;
    },
    onSuccess: (updatedCommentRes, ticketId) => {
      const oldData = queryClient.getQueryData<ApiResponse<CommentType[]>>(["comment/fetchTicketComments", ticketId]);
      if (oldData) {
        queryClient.setQueryData(["comment/fetchTicketComments", ticketId], {
          ...oldData,
          data: oldData.data?.map((comment) =>
            comment.id === updatedCommentRes?.data?.id ? updatedCommentRes.data : comment,
          ),
        });
      }
    },
    onError: (error: any) => {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Error updating comment",
      });
    },
  });
};

//Delete Comment

export const useDeleteComment = () => {
  const queryClient = useQueryClient();
  return useMutation<ApiResponse<CommentType>, Error, { commentId: number; ticketId: number }>({
    mutationFn: async ({ commentId }) => {
      const { data } = await api.delete<ApiResponse<CommentType>>(`/comment/${commentId}`);
      return data;
    },
    onSuccess: (_deletedCommentRes, { commentId, ticketId }) => {
      const oldData = queryClient.getQueryData<ApiResponse<CommentType[]>>(["comment/fetchTicketComments", ticketId]);
      if (oldData) {
        queryClient.setQueryData(["comment/fetchTicketComments", ticketId], {
          ...oldData,
          data: oldData.data?.filter((comment) => comment.id !== commentId),
        });
      }
    },
    onError: (error: any) => {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Error deleting comment",
      });
    },
  });
};
