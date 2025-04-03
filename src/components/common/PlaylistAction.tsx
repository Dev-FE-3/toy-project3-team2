import { useState } from "react";

interface PlaylistActionsProps {
  playlistId: string;
}

const PlaylistActions: React.FC<PlaylistActionsProps> = ({ playlistId }) => {
  // 기본 값으로 더미 데이터 사용 (API 연결 전까지)
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [likes, setLikes] = useState(0);
  const [subscriptions, setSubscriptions] = useState(0);
  const [comments] = useState(3); // 댓글 수는 단순 표시용

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
        <img
          className="w-[14px] h-[14px]"
          src={
            isSubscribed
              ? "src/assets/icons/icon-bookmark-fill.svg"
              : "src/assets/icons/icon-bookmark-line.svg"
          }
          alt="구독"
        />
        <span>{subscriptions}</span>
      </div>
      <div onClick={handleLike} role="button" className="flex flex-row gap-[6px] items-center">
        <img
          className="w-[15px] h-[15px]"
          src={
            isLiked
              ? "/src/assets/icons/icon-heart-fill.svg"
              : "/src/assets/icons/icon-heart-line.svg"
          }
          alt="좋아요"
        />
        <span>{likes}</span>
      </div>
      <div className="flex flex-row gap-[6px] items-center">
        <img className="w-[14px] h-[14px]" src="src/assets/icons/icon-comment.svg" alt="댓글" />
        <span>{comments}</span>
      </div>
    </div>
  );
};

export default PlaylistActions;
