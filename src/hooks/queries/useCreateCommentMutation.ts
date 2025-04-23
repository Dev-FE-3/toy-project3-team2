import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "@/services/axios/axiosInstance";
import { NewCommentPayload } from "@/types/comment";

// 댓글 등록 API
export const createComment = async (payload: NewCommentPayload) => {
  return axiosInstance.post("/comment", payload);
};

// 댓글 등록 뮤테이션
export const useCreateCommentMutation = (playlistId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: NewCommentPayload) => createComment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", playlistId] });
      queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] }); // 댓글 수 업데이트
    },
  });
};
