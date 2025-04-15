import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";

import CommentSkeleton from "./CommentSkeleton";
import AddIcon from "../../assets/icons/fill-add.svg?react";
import axiosInstance from "../../services/axios/axiosInstance";
import useUserStore from "../../store/useUserStore";
import { Comment } from "../../types/comment";
import { Input } from "../common/Input";

interface NewCommentPayload {
  playlist_id: string;
  content: string;
  author_id: string;
}

const Comments = () => {
  const [content, setContent] = useState("");
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);
  const { id: playlistId } = useParams<{ id: string }>();

  // 댓글 목록 가져오기 함수
  const fetchComments = async (playlistId: string): Promise<Comment[]> => {
    const response = await axiosInstance.get<Comment[]>("/comment", {
      params: {
        playlist_id: `eq.${playlistId}`,
        select: "*,user:author_id(nickname, profile_image)",
        order: "created_at.desc",
      },
    });

    return response.data;
  };

  // 댓글 쿼리
  const {
    data: comments = [],
    isLoading: isCommentsLoading,
    isError: isCommentsError,
  } = useQuery({
    queryKey: ["comments", playlistId],
    queryFn: () => fetchComments(playlistId!),
    enabled: !!playlistId,
  });

  // 댓글 등록 함수
  const postComment = async (payload: NewCommentPayload) => {
    return axiosInstance.post("/comment", payload);
  };

  // 댓글 등록 뮤테이션
  const {
    mutate,
    isPending: isPosting,
    isError: isPostError,
  } = useMutation({
    mutationFn: postComment,
    onSuccess: () => {
      setContent("");
      queryClient.invalidateQueries({ queryKey: ["comments", playlistId] });
      queryClient.invalidateQueries({ queryKey: ["playlist", playlistId] }); // 댓글 등록 시 comment_count update 되도록
    },
  });

  const handleSubmit = () => {
    if (!user || !content || !playlistId) return;

    mutate({
      playlist_id: playlistId,
      content,
      author_id: user.id,
    });
  };

  return (
    <div className="flex flex-col gap-3 p-4">
      {isCommentsLoading ? (
        <CommentSkeleton />
      ) : isCommentsError ? (
        <p className="text-sub text-red-500">댓글을 불러오는 데 실패했어요.</p>
      ) : (
        <>
          <span>댓글 {comments.length}</span>
          <form className="relative flex items-center">
            <Input
              placeholder="댓글을 입력해 주세요"
              type="round"
              className="flex-grow"
              inputClassName="pr-10"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={isPosting}
            />
            {content.length > 0 && (
              <button type="button" onClick={handleSubmit} className="absolute right-[6px]">
                <AddIcon />
              </button>
            )}
          </form>
          {isPostError && (
            <p className="text-sub text-red-500">댓글 등록에 실패했어요. 다시 시도해 주세요.</p>
          )}
          <ul className="flex flex-col gap-2">
            {comments.map((item) => (
              <li key={item.id} className="flex gap-[10px]">
                <img
                  src={item?.user?.profile_image}
                  className="mt-[5px] h-6 w-6 shrink-0 rounded-full"
                />
                <div className="flex flex-col">
                  <p className="whitespace-nowrap text-sub2 text-font-second">
                    {item?.user?.nickname}
                  </p>
                  <p className="text-body2">{item.content}</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Comments;
