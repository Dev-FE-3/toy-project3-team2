import { useQuery } from "@tanstack/react-query";
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

const fetchPlaylists = async () => {
  const { data } = await axiosInstance.get<Playlist[]>(`/playlist`, {
    params: {
      select: "*,user:creator_id(profile_image)",
    },
  });

  if (!data) {
    throw new Error("플레이리스트를 가져오는데 실패했습니다.");
  }

  return data;
};

export const usePlaylists = () => {
  return useQuery<Playlist[]>({
    queryKey: ["playlists"],
    queryFn: fetchPlaylists,
  });
};
