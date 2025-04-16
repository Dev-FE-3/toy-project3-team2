import axiosInstance from "@/services/axios/axiosInstance";
import { Comment } from "@/types/comment";

export interface NewCommentPayload {
  playlist_id: string;
  content: string;
  author_id: string;
}

// 댓글 목록 불러오기
export const fetchComments = async (playlistId: string): Promise<Comment[]> => {
  const response = await axiosInstance.get<Comment[]>("/comment", {
    params: {
      playlist_id: `eq.${playlistId}`,
      select: "*,user:author_id(nickname, profile_image)",
      order: "created_at.desc",
    },
  });

  return response.data;
};

// 댓글 작성하기
export const postComment = async (payload: NewCommentPayload) => {
  return axiosInstance.post("/comment", payload);
};
