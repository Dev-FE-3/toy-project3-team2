import axiosInstance from "@/services/axios/axiosInstance";
import { NewCommentPayload } from "@/types/comment";

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

// 댓글 등록 API
export const postComment = async (payload: NewCommentPayload) => {
  return axiosInstance.post("/comment", payload);
};
