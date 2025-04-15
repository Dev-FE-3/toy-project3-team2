import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "../services/axios/axiosInstance";

interface Playlist {
  id: string;
  title: string;
  thumbnail_image: string;
  is_owner: boolean;
  user: {
    profile_image: string;
  };
}

const LIMIT = 5; // 한 번에 5개씩 가져오기

const fetchPlaylistPage = async ({ pageParam = 0 }: { pageParam: number }) => {
  const start = pageParam * LIMIT;

  try {
    const { data } = await axiosInstance.get<Playlist[]>(`/playlist`, {
      params: {
        select: "*,user:creator_id(profile_image)",
        offset: start,
        limit: LIMIT,
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

export const usePlaylists = () => {
  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
    queryKey: ["playlists"],
    queryFn: ({ pageParam }) => fetchPlaylistPage({ pageParam }),
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
