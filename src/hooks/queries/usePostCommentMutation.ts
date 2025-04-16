import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postComment, NewCommentPayload } from "@/api/commentApi";

export const usePostCommentMutation = (playlistId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: NewCommentPayload) => postComment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", playlistId] });
      queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] }); // 댓글 수 업데이트
    },
  });
};
