import { useEffect, useState } from "react";

import BookmarkIcon from "@/assets/icons/bookmark.svg?react";
import CommentIcon from "@/assets/icons/comment.svg?react";
import HeartIcon from "@/assets/icons/heart.svg?react";
import { usePlaylistDetail } from "@/hooks/queries/usePlaylistDetail";
import { usePlaylistActionInfo } from "@/hooks/queries/usePlaylistActionInfo";
import axiosInstance from "@/services/axios/axiosInstance";
import useUserStore from "@/store/useUserStore";
import { useQueryClient } from "@tanstack/react-query";

interface PlaylistActionsProps {
  playlistId: string;
}

const PlaylistActions = ({ playlistId }: PlaylistActionsProps) => {
  // 유저 정보
  const currentUser = useUserStore((state) => state.user);
  const userId = currentUser?.id;

  // 유저의 액션 상태
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // 구독, 좋아요, 댓글 수
  const [subscriptions, setSubscriptions] = useState(0);
  const [likes, setLikes] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  // API 호출로 액션 정보 로드
  const { data: actionInfo } = usePlaylistActionInfo(playlistId, userId);
  const playlist = usePlaylistDetail(playlistId);
  const queryClient = useQueryClient();

  // 댓글 수 불러오기
  useEffect(() => {
    if (!playlist) return;

    setCommentCount(playlist?.data?.comment_count ?? 0);
  }, [playlist]);

  // 액션 정보 도착 시 상태 반영
  useEffect(() => {
    if (!actionInfo) return;

    setIsLiked(actionInfo.isLiked);
    setIsSubscribed(actionInfo.isSubscribed);
    setLikes(actionInfo.likes);
    setSubscriptions(actionInfo.subscriptions);
  }, [actionInfo]);

  // 좋아요 & 구독 통합 업데이트 함수
  const updateAction = async ({
    field,
    value,
  }: {
    field: "is_liked" | "is_subscribed";
    value: boolean;
  }) => {
    if (!userId) return;

    try {
      // 1. 기존 액션 row 있는지 확인
      const { data: actionData } = await axiosInstance.get("/action", {
        params: {
          playlist_id: `eq.${playlistId}`,
          user_id: `eq.${userId}`,
          select: "*",
        },
      });
      if (actionData.length === 0) {
        // 2. 없으면 새로 생성 (상태 필드는 false로 초기화)
        await axiosInstance.post("/action", {
          user_id: userId,
          playlist_id: playlistId,
          [field]: value,
          [field === "is_liked" ? "is_subscribed" : "is_liked"]: false,
        });
      } else {
        // 3. 있으면 해당 필드만 업데이트
        await axiosInstance.patch(
          "/action",
          { [field]: value },
          {
            params: {
              playlist_id: `eq.${playlistId}`,
              user_id: `eq.${userId}`,
            },
          },
        );
      }
    } catch (error) {
      console.error("action 업데이트 중 오류 발생:", error);
      throw error;
    }
  };

  // 좋아요 버튼 클릭 핸들러
  const handleLike = async () => {
    if (!userId) return;
    const newIsLiked = !isLiked;

    // 클라이언트 UI 먼저 업데이트
    setIsLiked(newIsLiked);
    setLikes((prev) => (newIsLiked ? prev + 1 : prev - 1));

    try {
      // action 테이블 업데이트
      await updateAction({ field: "is_liked", value: newIsLiked });

      // playlist 테이블의 like_count 업데이트
      await axiosInstance.patch(
        "/playlist",
        { like_count: newIsLiked ? likes + 1 : likes - 1 },
        { params: { id: `eq.${playlistId}` } },
      );
    } catch (error) {
      // 오류 발생 시 UI 롤백
      setIsLiked((prev) => !prev);
      setLikes((prev) => (newIsLiked ? prev - 1 : prev + 1));
      console.error("action 업데이트 중 오류 발생:", error);
    }
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

      if (userId) {
        queryClient.invalidateQueries({ queryKey: ["userInfo", userId] });
      }
    } catch (error) {
      // 오류 발생 시 UI 롤백
      setIsSubscribed((prev) => !prev);
      setSubscriptions((prev) => (newIsSubscribed ? prev - 1 : prev + 1));
      console.error("action 업데이트 중 오류 발생:", error);
    }
  };

  return (
    <div className="flex flex-row gap-[16px] text-body2">
      {/* 구독 버튼 */}
      <button
        data-testid="subscribe-button"
        onClick={handleSubscribe}
        role="button"
        className="flex flex-row items-center gap-[6px]"
      >
        <BookmarkIcon
          data-testid="subscribe-icon"
          className={`h-[14px] w-[14px] ${isSubscribed ? "fill-white stroke-none" : "fill-none stroke-white"}`}
        />
        <span data-testid="subscribe-count">{subscriptions}</span>
      </button>

      {/* 좋아요 버튼 */}
      <button
        data-testid="like-button"
        onClick={handleLike}
        role="button"
        className="flex flex-row items-center gap-[6px]"
      >
        <HeartIcon
          data-testid="like-icon"
          className={`h-[14px] w-[14px] ${isLiked ? "fill-white stroke-none" : "fill-none stroke-white"}`}
        />
        <span data-testid="like-count">{likes}</span>
      </button>

      {/* 댓글 수 */}
      <div className="flex flex-row items-center gap-[6px]">
        <CommentIcon className="h-[14px] w-[14px]" />
        <span>{commentCount}</span>
      </div>
    </div>
  );
};

export default PlaylistActions;
