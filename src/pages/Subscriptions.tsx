/** 플레이리스트 구독 페이지 */

import PlaylistCard from "../components/common/PlaylistCard";
import Header from "../layout/Header";
import { usePlaylistSearch } from "../hooks/usePlaylistSearch";

const Subscriptions = () => {
  const { playlists, users, handleSearch } = usePlaylistSearch();

  return (
    <>
      <Header onSearch={handleSearch} />
      <div className="mb-[16px] ml-[19px] mt-[10px]">
        <h1 className="text-body1-bold">구독 플레이리스트</h1>
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

export default Subscriptions;
