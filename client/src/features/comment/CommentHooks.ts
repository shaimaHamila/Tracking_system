import { useMutation, useQuery } from "@tanstack/react-query";
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
  return useMutation<ApiResponse<CommentType>, Error, { newComment: Partial<CommentType>; ticketId: number }>({
    mutationFn: async ({ newComment, ticketId }) => {
      const { data } = await api.post<ApiResponse<CommentType>>("/comment/add", newComment, { params: { ticketId } });
      return data;
    },
    onSuccess: () => {
      //   notification.success({
      //     message: "Comment added successfully",
      //   });
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
  return useMutation<ApiResponse<CommentType>, Error, { comment: Partial<CommentType> }>({
    mutationFn: async ({ comment }) => {
      const { data } = await api.put<ApiResponse<CommentType>>(`/comment/update/`, comment, {
        params: { commentId: comment.id },
      });
      return data;
    },
    onSuccess: () => {
      //   notification.success({
      //     message: "Comment updated successfully",
      //   });
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
  return useMutation<ApiResponse<CommentType>, Error, { commentId: number }>({
    mutationFn: async ({ commentId }) => {
      const { data } = await api.delete<ApiResponse<CommentType>>(`/comment/${commentId}`);
      return data;
    },
    onSuccess: () => {
      //   notification.success({
      //     message: "Comment deleted successfully",
      //   });
    },
    onError: (error: any) => {
      notification.error({
        message: "Error",
        description: error.response?.data?.message || "Error deleting comment",
      });
    },
  });
};
