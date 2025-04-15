import { useEffect, useState } from "react";

import { usePlaylistDetail } from "@/hooks/usePlaylistDetail";
import BookmarkIcon from "@/assets/icons/bookmark.svg?react";
import HeartIcon from "@/assets/icons/heart.svg?react";
import CommentIcon from "@/assets/icons/comment.svg?react";

interface PlaylistActionsProps {
  playlistId: string;
}

const PlaylistActions = ({ playlistId }: PlaylistActionsProps) => {
  // 기본 값으로 더미 데이터 사용 (API 연결 전까지)
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [likes, setLikes] = useState(0);
  const [subscriptions, setSubscriptions] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  const playlist = usePlaylistDetail(playlistId);

  useEffect(() => {
    if (!playlist) return;

    setCommentCount(playlist?.data?.comment_count ?? 0);
  }, [playlist]);

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  // 구독 버튼 클릭 핸들러
  const handleSubscribe = async () => {
    if (!userId) return;
    const newIsSubscribed = !isSubscribed;

    // 클라이언트 UI 먼저 업데이트
    setIsSubscribed(newIsSubscribed);
    setSubscriptions((prev) => (newIsSubscribed ? prev + 1 : prev - 1));

    try {
      // action 테이블 업데이트
      await updateAction({ field: "is_subscribed", value: newIsSubscribed });

      // playlist 테이블의 subscription_count 업데이트
      await axiosInstance.patch(
        "/playlist",
        { subscribe_count: newIsSubscribed ? subscriptions + 1 : subscriptions - 1 },
        { params: { id: `eq.${playlistId}` } },
      );
    } catch (error) {
      // 오류 발생 시 UI 롤백
      setIsSubscribed((prev) => !prev);
      setSubscriptions((prev) => (newIsSubscribed ? prev - 1 : prev + 1));
      console.error("action 업데이트 중 오류 발생:", error);
    }
  };

  return (
    <div className="flex flex-row gap-[16px] text-body2">
      <button
        onClick={handleSubscribe}
        role="button"
        className="flex flex-row items-center gap-[6px]"
      >
        <BookmarkIcon
          className={`h-[14px] w-[14px] ${isSubscribed ? "fill-white stroke-none" : "fill-none stroke-white"}`}
        />
        <span>{subscriptions}</span>
      </button>
      <button onClick={handleLike} role="button" className="flex flex-row items-center gap-[6px]">
        <HeartIcon
          className={`h-[14px] w-[14px] ${isLiked ? "fill-white stroke-none" : "fill-none stroke-white"}`}
        />
        <span>{likes}</span>
      </button>
      <div className="flex flex-row items-center gap-[6px]">
        <CommentIcon className="h-[14px] w-[14px]" />
        <span>{commentCount}</span>
      </div>
    </div>
  );
};

export default PlaylistActions;