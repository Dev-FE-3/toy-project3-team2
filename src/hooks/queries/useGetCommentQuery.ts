import { useQuery } from "@tanstack/react-query";
import { getComments } from "@/api/comment";

// 댓글 조회 쿼리
export const useGetCommentQuery = (playlistId: string) => {
  return useQuery({
    queryKey: ["comments", playlistId],
    queryFn: () => getComments(playlistId!),
    enabled: !!playlistId,
  });
};
