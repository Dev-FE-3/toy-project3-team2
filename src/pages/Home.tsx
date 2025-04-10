import { useEffect, useState } from "react";
import PlaylistCard from "../components/common/PlaylistCard";
import axiosInstance from "../services/axios/axiosInstance";

/** 플레이리스트 추천 페이지 */

// 플레이리스트 타입 정의
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

const Home = () => {
  const [playlists, setPlaylist] = useState<Playlist[]>([]);
  const [users, setUsers] = useState<{ [key: string]: User }>({});

  // 플레이리스트 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 플레이리스트 데이터 가져오기
        const playlistResponse = await axiosInstance.get<Playlist[]>("/playlist?select=*");
        setPlaylist(playlistResponse.data);

        // creator_id 목록 추출
        const creatorIds = playlistResponse.data.map((playlist) => playlist.creator_id);

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
  }, []);

  return (
    <>
      <div className="mb-[16px] ml-[19px] mt-[10px]">
        <h1 className="text-body1-bold">추천 플레이리스트</h1>
      </div>
      <ul>
        {playlists.map((playlist) => (
          <li key={playlist.id}>
            <PlaylistCard
              id={playlist.id}
              title={playlist.title}
              thumbnailUrl={playlist.thumbnail_image}
              userImage={users[playlist.creator_id]?.profile_image}
              isOwner={playlist.is_owner}
              subscribe_count={playlist.subscribe_count}
              like_count={playlist.like_count}
              comment_count={playlist.comment_count}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default Home;
