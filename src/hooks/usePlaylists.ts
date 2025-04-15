import { useInfiniteQuery } from "@tanstack/react-query";

import axiosInstance from "@/services/axios/axiosInstance";
// import useUserStore from "@/store/useUserStore";

interface Playlist {
  id: string;
  title: string;
  thumbnail_image: string;
  is_owner: boolean;
  user: {
    profile_image: string;
  };
}

interface UsePlaylistsOptions {
  order?: string;
  creator_id?: string;
  subscribed_by?: string;
  is_public?: boolean;
  title?: string;
}

interface PlaylistParams {
  select: string;
  is_public: string;
  offset: number;
  limit: number;
  title?: string;
  order?: string;
  creator_id?: string;
}

const LIMIT = 5; // 한 번에 5개씩 가져오기

const fetchPlaylistPage = async (
  { pageParam = 0 }: { pageParam: number },
  options?: UsePlaylistsOptions,
) => {
  const start = pageParam * LIMIT;
  try {
    // 구독하지 않은 플레이리스트를 가져오는 경우
    if (options?.subscribed_by?.startsWith("neq.")) {
      const userId = options.subscribed_by.replace("neq.", "");

      // 1. actions 테이블에서 구독한 플레이리스트 ID 목록을 가져옴
      const { data: actions } = await axiosInstance.get(`/action`, {
        params: {
          select: "*",
          user_id: `eq.${userId}`,
          is_subscribed: "eq.true",
        },
      });

      const subscribedPlaylistIds =
        actions?.map((action: { playlist_id: string }) => action.playlist_id) || [];

      // 2. 구독하지 않은 플레이리스트를 조회
      const { data } = await axiosInstance.get<Playlist[]>(`/playlist`, {
        params: {
          select: "*,user:creator_id(profile_image)",
          id: `not.in.(${subscribedPlaylistIds.join(",")})`,
          is_public: "eq.true",
          offset: start,
          limit: LIMIT,
          order: options.order,
          title: options.title,
          creator_id: options.creator_id,
        },
      });

      return {
        data,
        nextPage: data.length === LIMIT ? pageParam + 1 : undefined,
      };
    }

    // 구독한 플레이리스트 가져오는 로직
    if (options?.subscribed_by) {
      const { data: actions } = await axiosInstance.get(`/action`, {
        params: {
          select: "*",
          user_id: `eq.${options.subscribed_by}`,
          is_subscribed: "eq.true",
        },
      });

      if (!actions?.length) {
        return { data: [], nextPage: undefined };
      }

      const playlistIds = actions.map((action: { playlist_id: string }) => action.playlist_id);

      const { data } = await axiosInstance.get<Playlist[]>(`/playlist`, {
        params: {
          select: "*,user:creator_id(profile_image)",
          id: `in.(${playlistIds.join(",")})`,
          is_public: "eq.true",
          offset: start,
          limit: LIMIT,
          order: options.order,
          title: options.title,
        },
      });

      return {
        data,
        nextPage: data.length === LIMIT ? pageParam + 1 : undefined,
      };
    }

    throw new Error("subscribed_by 옵션이 필요합니다.");
  } catch (error) {
    console.error("Error in fetchPlaylistPage:", error);
    throw error;
  }
};

export const usePlaylists = (options?: UsePlaylistsOptions) => {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["playlists", options],
    queryFn: ({ pageParam }) => fetchPlaylistPage({ pageParam }, options),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });

  const playlists = data?.pages.flatMap((page) => page.data) ?? [];

  return {
    playlists,
    isLoading,
    hasMore: hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  };
};
