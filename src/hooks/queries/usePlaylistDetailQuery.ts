import { useQuery } from "@tanstack/react-query";
import axiosInstance from "@/services/axios/axiosInstance";
import { PlaylistDetailData } from "@/types/playlist";

// 데이터 가져오기
const fetchPlaylistDetail = async (playlistId: string): Promise<PlaylistDetailData> => {
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

export const usePlaylistDetailQuery = (playlistId?: string) => {
  return useQuery<PlaylistDetailData>({
    queryKey: ["playlist", playlistId],
    queryFn: () => fetchPlaylistDetail(playlistId!),
    enabled: !!playlistId,
  });
};
