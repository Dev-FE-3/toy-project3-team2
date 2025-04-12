import { useState, useEffect } from "react";
import axiosInstance from "../services/axios/axiosInstance";

interface Playlist {
  id: string;
  title: string;
  thumbnail_image: string;
  creator_id: string;
  is_owner: boolean;
  subscribe_count: number;
  like_count: number;
  comment_count: number;
}

interface User {
  id: string;
  profile_image: string;
}

export const usePlaylistSearch = () => {
  const [playlists, setPlaylist] = useState<Playlist[]>([]);
  const [users, setUsers] = useState<{ [key: string]: User }>({});
  const [searchQuery, setSearchQuery] = useState("");

  // 플레이리스트 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 전체 플레이리스트 데이터 가져오기
        const playlistResponse = await axiosInstance.get<Playlist[]>("/playlist?select=*");
        let filteredPlaylists = playlistResponse.data;

        // 검색어가 있는 경우 클라이언트 사이드에서 필터링
        if (searchQuery) {
          filteredPlaylists = playlistResponse.data.filter((playlist) =>
            playlist.title.toLowerCase().includes(searchQuery.toLowerCase()),
          );
        }

        setPlaylist(filteredPlaylists);

        // creator_id 목록 추출
        const creatorIds = filteredPlaylists.map((playlist) => playlist.creator_id);

        // 사용자 정보 가져오기
        const userPromises = creatorIds.map((id) =>
          axiosInstance.get<User[]>(`/user?id=eq.${id}&select=id,profile_image`),
        );
        const userResponses = await Promise.all(userPromises);
        const userMap = userResponses.reduce(
          (acc, response) => {
            if (response.data && response.data.length > 0) {
              acc[response.data[0].id] = response.data[0];
            }
            return acc;
          },
          {} as { [key: string]: User },
        );

        setUsers(userMap);
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      }
    };

    fetchData();
  }, [searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return {
    playlists,
    users,
    handleSearch,
  };
};
