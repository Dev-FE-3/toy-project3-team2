import { useQuery } from "@tanstack/react-query";
import { PlaylistWithVideos } from "../types/playlist";
import axiosInstance from "../services/axios/axiosInstance";

// 데이터 가져오기
const fetchPlaylist = async (id: string): Promise<PlaylistWithVideos> => {
  const { data: playlistData } = await axiosInstance.get(`/playlist`, {
    params: {
      id: `eq.${id}`,
      select: "*",
    },
  });

  const { data: videosData } = await axiosInstance.get(`/video`, {
    params: {
      playlist_id: `eq.${id}`,
      select: "*",
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

export const usePlaylistDetail = (id?: string) => {
  return useQuery<PlaylistWithVideos>({
    queryKey: ["playlist", id],
    queryFn: () => fetchPlaylist(id!),
    enabled: !!id,
  });
};
