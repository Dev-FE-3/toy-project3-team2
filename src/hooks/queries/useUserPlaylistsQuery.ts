import { useInfiniteQuery } from "@tanstack/react-query";
import { useUserPlaylists } from "../useUserPlaylists";

// 마이페이지 플레이리스트 쿼리
export const useUserPlaylistsQuery = (creatorId: string, isOwner: boolean, order: string) => {
  return useInfiniteQuery({
    queryKey: ["userPlaylists", creatorId, isOwner, order],
    queryFn: ({ pageParam = 0 }) => useUserPlaylists({ pageParam, creatorId, isOwner, order }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    enabled: !!creatorId,
  });
};
