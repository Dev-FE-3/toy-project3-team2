import PlaylistCard from "../components/common/PlaylistCard";
import Header from "../layout/Header";
import { usePlaylistSearch } from "../hooks/usePlaylistSearch";

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
  const { playlists, users, handleSearch } = usePlaylistSearch();

  return (
    <>
      <Header onSearch={handleSearch} />
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
              subscribeCount={playlist.subscribe_count}
              likeCount={playlist.like_count}
              commentCount={playlist.comment_count}
            />
          </li>
        ))}
      </ul>
    </>
  );
};

export default Home;
