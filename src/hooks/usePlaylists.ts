import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/axios/axiosInstance";
import useUserStore from "@/store/useUserStore";

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
}

const LIMIT = 5; // 한 번에 5개씩 가져오기

const fetchPlaylistPage = async (
  { pageParam = 0 }: { pageParam: number },
  options?: UsePlaylistsOptions,
) => {
  const start = pageParam * LIMIT;
  // const userId = useUserStore.getState().user?.id;
  try {
    // 구독 플레이리스트를 가져오는 경우
    if (options?.subscribed_by) {
      console.log("구독 플레이리스트 조회 시작 - 사용자 ID:", options.subscribed_by);

      // 1. actions 테이블에서 구독한 플레이리스트 ID 목록을 가져옴
      const { data: actions } = await axiosInstance.get(`/action`, {
        params: {
          select: "*",
          user_id: `eq.${options.subscribed_by}`,
          is_subscribed: "eq.true",
        },
      });

      console.log("actions 테이블 조회 결과:", actions);

      if (!actions?.length) {
        console.log("구독한 플레이리스트가 없습니다.");
        return { data: [], nextPage: undefined };
      }

      // playlist_id만 추출
      const playlistIds = actions.map((action: any) => action.playlist_id);
      console.log("추출된 playlist_id 목록:", playlistIds);

      // 2. 구독한 플레이리스트 ID로 플레이리스트를 조회
      const { data } = await axiosInstance.get<Playlist[]>(`/playlist`, {
        params: {
          select: "*,user:creator_id(profile_image)",
          id: `in.(${playlistIds.join(",")})`,
          is_public: "eq.true",
          offset: start,
          limit: LIMIT,
          order: options.order,
        },
      });

      return {
        data,
        nextPage: data.length === LIMIT ? pageParam + 1 : undefined,
      };
    }

    // 일반 플레이리스트 조회
    const { data } = await axiosInstance.get<Playlist[]>(`/playlist`, {
      params: {
        select: "*,user:creator_id(profile_image)",
        is_public: "eq.true",
        offset: start,
        limit: LIMIT,
        ...options,
      },
    });

    if (!data) {
      throw new Error("플레이리스트를 가져오는데 실패했습니다.");
    }
    if (!data) {
      throw new Error("플레이리스트를 가져오는데 실패했습니다.");
    }

    return {
      data,
      nextPage: data.length === LIMIT ? pageParam + 1 : undefined,
      nextPage: data.length === LIMIT ? pageParam + 1 : undefined,
    };
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

  const playlists = data?.pages.flatMap((page) => page.data) ?? [];

  return {
    playlists,
    isLoading,
    hasMore: hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  };
};
