import { useEffect, useState } from "react";
import useUserStore from "@/store/useUserStore";
import axiosInstance from "@/services/axios/axiosInstance";

import BookmarkIcon from "@/assets/icons/bookmark.svg?react";
import HeartIcon from "@/assets/icons/heart.svg?react";
import CommentIcon from "@/assets/icons/comment.svg?react";

interface PlaylistActionsProps {
  playlistId: string;
}

const PlaylistActions = ({ playlistId }: PlaylistActionsProps) => {
  const currentUser = useUserStore((state) => state.user);
  const userId = currentUser?.id;

  // 상태 관리
  const [isLiked, setIsLiked] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [likes, setLikes] = useState(0);
  const [subscriptions, setSubscriptions] = useState(0);
  // const [comments, setComments] = useState(0);

  // 유저와 플레이리스트에 대한 기존 액션 정보 불러오기
  useEffect(() => {
    if (!userId) return;

    const fetchActions = async () => {
      try {
        // 1. action 테이블에서 유저의 기존 상태 불러오기
        const { data: actionData } = await axiosInstance.get(`/action`, {
          params: {
            playlist_id: `eq.${playlistId}`,
            user_id: `eq.${userId}`,
            select: "*",
          },
        });

        if (actionData && actionData.length > 0) {
          const action = actionData[0];
          setIsLiked(action.is_liked);
          setIsSubscribed(action.is_subscribed);
        }

        // 2. playlist 테이블에서 좋아요/구독 수 불러오기
        const { data: playlistData } = await axiosInstance.get(`/playlist`, {
          params: {
            id: `eq.${playlistId}`,
            select: "like_count,subscribe_count",
          },
        });

        if (playlistData && playlistData.length > 0) {
          setLikes(playlistData[0].like_count);
          setSubscriptions(playlistData[0].subscribe_count);
        }
      } catch (error) {
        console.error("액션 정보를 불러오는 중 오류 발생:", error);
      }
    };

    fetchActions();
  }, [playlistId, userId]);

  // 좋아요/구독 통합 업데이트 함수
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
        <span>0</span> {/* 댓글 수 추후 구현 */}
      </div>
    </div>
  );
};

export default PlaylistActions;