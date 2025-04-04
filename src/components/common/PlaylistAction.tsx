import { useState } from "react";
import BookmarkIcon from "../../assets/icons/bookmark.svg?react";
import HeartIcon from "../../assets/icons/heart.svg?react";
import CommentIcon from "../../assets/icons/comment.svg?react";

interface PlaylistActionsProps {
  playlistId: string;
}

const PlaylistActions: React.FC<PlaylistActionsProps> = () => {
  // 기본 값으로 더미 데이터 사용 (API 연결 전까지)
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [likes, setLikes] = useState(0);
  const [subscriptions, setSubscriptions] = useState(0);
  const [comments] = useState(0); // 댓글 수는 단순 표시용

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleSubscribe = () => {
    setIsSubscribed((prev) => !prev);
    setSubscriptions((prev) => (isSubscribed ? prev - 1 : prev + 1));
  };

  return (
    <div className="flex flex-row gap-[16px] text-body2">
      <div onClick={handleSubscribe} role="button" className="flex flex-row gap-[6px] items-center">
        <BookmarkIcon
          className={`w-[14px] h-[14px] ${isSubscribed ? "fill-white stroke-none" : "fill-none stroke-white"}`}
        />
        <span>{subscriptions}</span>
      </div>
      <div onClick={handleLike} role="button" className="flex flex-row gap-[6px] items-center">
        <HeartIcon
          className={`w-[14px] h-[14px] ${isLiked ? "fill-white stroke-none" : "fill-none stroke-white"}`}
        />
        <span>{likes}</span>
      </div>
      <div className="flex flex-row gap-[6px] items-center">
        <CommentIcon className="w-[14px] h-[14px]" />
        <span>{comments}</span>
      </div>
    </div>
  );
};

export default PlaylistActions;
