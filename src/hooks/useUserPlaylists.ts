import axiosInstance from "@/services/axios/axiosInstance";
import { Playlist, PlaylistParams } from "@/types/playlist";

const LIMIT = 3;

interface FetchParams {
  pageParam?: number;
  creatorId: string;
  isOwner: boolean;
  order: string;
}

// 플레이리스트 조회 API
export const getPlaylists = (params: PlaylistParams) => {
  return axiosInstance.get<Playlist[]>("/playlist", { params });
};

export const fetchUserPlaylists = async ({
  pageParam = 0,
  creatorId,
  isOwner,
  order,
}: FetchParams) => {
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
