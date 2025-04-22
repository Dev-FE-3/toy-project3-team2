import { useInfiniteQuery } from "@tanstack/react-query";
import { PlaylistParams } from "@/types/playlist";
import { getPlaylists } from "@/api/playlist";

const LIMIT = 3;

interface FetchParams {
  pageParam?: number;
  creatorId: string;
  isOwner: boolean;
  order: string;
}

const fetchUserPlaylists = async ({ pageParam = 0, creatorId, isOwner, order }: FetchParams) => {
  const offset = pageParam * LIMIT;

  const orderBy =
    order === "updated"
      ? "updated_at.desc"
      : order === "subscribe"
        ? "subscribe_count.desc"
        : order === "like"
          ? "like_count.desc"
          : "updated_at.desc";

  const params: PlaylistParams = {
    creator_id: `eq.${creatorId}`,
    select: "*",
    limit: LIMIT,
    offset,
    order: orderBy,
  };

  if (!isOwner) {
    params.is_public = "eq.true";
  }

  const response = await getPlaylists(params);
  const playlists = response.data;

  return {
    playlists,
    nextPage: playlists.length === LIMIT ? pageParam + 1 : null,
  };
};

// 마이페이지 플레이리스트 쿼리
export const useUserPlaylistsQuery = (creatorId: string, isOwner: boolean, order: string) => {
  return useInfiniteQuery({
    queryKey: ["userPlaylists", creatorId, isOwner, order],
    queryFn: ({ pageParam = 0 }) => fetchUserPlaylists({ pageParam, creatorId, isOwner, order }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    enabled: !!creatorId,
  });
};
