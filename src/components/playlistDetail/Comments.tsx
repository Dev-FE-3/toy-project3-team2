import { useState } from "react";
import { useParams } from "react-router-dom";

import AddIcon from "@/assets/icons/fill-add.svg?react";
import { Input } from "@/components/common/Input";
import { useCommentsQuery } from "@/hooks/queries/useCommentsQuery";
import { useCreateCommentMutation } from "@/hooks/queries/useCreateCommentMutation";
import useUserStore from "@/store/useUserStore";

import CommentSkeleton from "./CommentSkeleton";

const Comments = () => {
  const [content, setContent] = useState("");
  const user = useUserStore((state) => state.user);
  const { id: playlistId } = useParams<{ id: string }>();

  const { data: comments, isPending, isError } = useCommentsQuery(playlistId ?? "");

  const { mutate: createComment, isError: isPostError } = useCreateCommentMutation(
    playlistId ?? "",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !content || !playlistId) return;

    createComment({
      playlist_id: playlistId,
      content,
      author_id: user.id,
    });

    setContent("");
  };

  return (
    <div className="flex flex-col gap-3 p-4">
      {isPending ? (
        <CommentSkeleton />
      ) : isError ? (
        <p className="text-sub text-red-500">댓글을 불러오는 데 실패했어요.</p>
      ) : (
        <>
          <span>댓글 {comments.length}</span>
          <form className="relative flex items-center" onSubmit={handleSubmit}>
            <Input
              placeholder="댓글을 입력해 주세요"
              type="round"
              className="flex-grow"
              inputClassName="pr-10"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            {content.length > 0 && (
              <button type="submit" className="absolute right-[6px]">
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
