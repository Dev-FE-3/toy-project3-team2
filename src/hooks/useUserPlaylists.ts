import { useInfiniteQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/axios/axiosInstance";
import { Playlist } from "@/types/playlist";

const LIMIT = 5;

interface FetchParams {
  pageParam?: number;
  creatorId: string;
  isOwner: boolean;
}

interface PlaylistParams {
  creator_id: string;
  select: string;
  limit: number;
  offset: number;
  order: string;
  is_public?: string;
}

const fetchUserPlaylists = async ({ pageParam = 0, creatorId, isOwner }: FetchParams) => {
  const offset = pageParam * LIMIT;

  const params: PlaylistParams = {
    creator_id: `eq.${creatorId}`,
    select: "*",
    limit: LIMIT,
    offset,
    order: "updated_at.desc",
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

export const useUserPlaylists = (creatorId: string, isOwner: boolean) => {
  return useInfiniteQuery({
    queryKey: ["userPlaylists", creatorId, isOwner],
    queryFn: ({ pageParam = 0 }) => fetchUserPlaylists({ pageParam, creatorId, isOwner }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    enabled: !!creatorId,
  });
};
