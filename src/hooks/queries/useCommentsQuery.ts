import { useQuery } from "@tanstack/react-query";

import axiosInstance from "@/services/axios/axiosInstance";
import { Comment } from "@/types/comment";

// 댓글 목록 조회 API
export const getComments = async (playlistId: string): Promise<Comment[]> => {
  const response = await axiosInstance.get<Comment[]>("/comment", {
    params: {
      playlist_id: `eq.${playlistId}`,
      select: "*,user:author_id(nickname, profile_image)",
      order: "created_at.desc",
    },
  });

  return response.data;
};

// 댓글 조회 쿼리
export const useCommentsQuery = (playlistId: string) => {
  return useQuery({
    queryKey: ["comments", playlistId],
    queryFn: () => getComments(playlistId!),
    enabled: !!playlistId,
  });
};
