import { useQuery } from "@tanstack/react-query";
import { PlaylistDetailData } from "../types/playlist";
import axiosInstance from "../services/axios/axiosInstance";

// 데이터 가져오기
const fetchPlaylist = async (playlistId: string): Promise<PlaylistDetailData> => {
  const { data: playlistData } = await axiosInstance.get(`/playlist`, {
    params: {
      id: `eq.${playlistId}`,
      select: "*,user:creator_id(nickname,profile_image,id)",
    },
  });

  const { data: videosData } = await axiosInstance.get(`/video`, {
    params: {
      playlist_id: `eq.${playlistId}`,
      select: "*",
      order: "created_at.asc",
    },
  });

  if (!playlistData || playlistData.length === 0) {
    throw new Error("플레이리스트를 가져오는데 실패했습니다.");
  }

  return {
    ...playlistData[0],
    videos: videosData ?? [],
  };
};

export const usePlaylistDetail = (playlistId?: string) => {
  return useQuery<PlaylistDetailData>({
    queryKey: ["playlist", playlistId],
    queryFn: () => fetchPlaylist(playlistId!),
    enabled: !!playlistId,
  });
};