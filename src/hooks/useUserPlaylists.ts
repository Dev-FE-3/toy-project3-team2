import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/axios/axiosInstance";
import { Playlist } from "@/types/playlist";

const LIMIT = 3;

interface FetchParams {
  pageParam?: number;
  creatorId: string;
  isOwner: boolean;
  order: string;
}

interface PlaylistParams {
  creator_id: string;
  select: string;
  limit: number;
  offset: number;
  order: string;
  is_public?: string;
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

  const { data } = await axiosInstance.get<Playlist[]>("/playlist", { params });
  return {
    data,
    nextPage: data.length === LIMIT ? pageParam + 1 : null,
  };
};

export const useUserPlaylists = (creatorId: string, isOwner: boolean, order: string) => {
  return useInfiniteQuery({
    queryKey: ["userPlaylists", creatorId, isOwner, order],
    queryFn: ({ pageParam = 0 }) => fetchUserPlaylists({ pageParam, creatorId, isOwner, order }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    enabled: !!creatorId,
  });
};
