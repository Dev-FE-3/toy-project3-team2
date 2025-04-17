import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "@/services/axios/axiosInstance";

export interface NewCommentPayload {
  playlist_id: string;
  content: string;
  author_id: string;
}

// 댓글 작성 api
export const postComment = async (payload: NewCommentPayload) => {
  return axiosInstance.post("/comment", payload);
};

export const usePostCommentMutation = (playlistId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: NewCommentPayload) => postComment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", playlistId] });
      queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] }); // 댓글 수 업데이트
    },
  });
};
