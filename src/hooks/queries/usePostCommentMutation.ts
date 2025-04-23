import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NewCommentPayload } from "@/types/comment";
import { postComment } from "@/api/comment";

// 댓글 등록 뮤테이션
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
