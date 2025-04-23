import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/axios/axiosInstance";

// 액션 정보 가져오기
const fetchPlaylistActionInfo = async (playlistId: string, userId: string) => {
  const [actionRes, playlistRes] = await Promise.all([
    axiosInstance.get("/action", {
      params: {
        playlist_id: `eq.${playlistId}`,
        user_id: `eq.${userId}`,
        select: "*",
      },
    }),
    axiosInstance.get("/playlist", {
      params: {
        id: `eq.${playlistId}`,
        select: "like_count, subscribe_count",
      },
    }),
  ]);

  const action = actionRes.data?.[0];
  const playlist = playlistRes.data?.[0];

  return {
    isLiked: action?.is_liked ?? false,
    isSubscribed: action?.is_subscribed ?? false,
    likes: playlist?.like_count ?? 0,
    subscriptions: playlist?.subscribe_count ?? 0,
  };
};

export const usePlaylistActionInfoQuery = (playlistId: string, userId?: string) => {
  return useQuery({
    queryKey: ["playlistAction", playlistId, userId],
    queryFn: async () => {
      if (!userId) return null;

      return fetchPlaylistActionInfo(playlistId, userId);
    },
    enabled: !!userId, // userId가 있을 때만 쿼리 실행
  });
};
