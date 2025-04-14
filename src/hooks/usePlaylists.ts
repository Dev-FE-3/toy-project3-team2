import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "../services/axios/axiosInstance";
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
}

const LIMIT = 5; // 한 번에 5개씩 가져오기

const fetchPlaylistPage = async (
  { pageParam = 0 }: { pageParam: number },
  options?: UsePlaylistsOptions,
) => {
  const start = pageParam * LIMIT;
  // const userId = useUserStore.getState().user?.id;
  try {
    const { data } = await axiosInstance.get<Playlist[]>(`/playlist`, {
      params: {
        select: "*,user:creator_id(profile_image)",
        offset: start,
        limit: LIMIT,
        ...options,
      },
    });

    if (!data) {
      throw new Error("플레이리스트를 가져오는데 실패했습니다.");
    }

    return {
      data,
      nextPage: pageParam + 1,
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
    getNextPageParam: (lastPage) =>
      lastPage.data.length === LIMIT ? lastPage.nextPage : undefined,
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
