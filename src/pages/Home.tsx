import PlaylistCard from "@/components/common/PlaylistCard";
import Header from "@/layout/Header";
import { usePlaylistSearch } from "@/hooks/usePlaylistSearch";
import { usePlaylists } from "@/hooks/usePlaylists";

/** 플레이리스트 추천 페이지 */
const Home = () => {
  const { data: playlists = [] } = usePlaylists();
  const { filteredPlaylists, setSearchKeyword } = usePlaylistSearch(playlists);

  return (
    <>
      <Header onSearch={setSearchKeyword} />
      <div className="mb-[16px] ml-[19px] mt-[10px]">
        <h1 className="text-body1-bold">추천 플레이리스트</h1>
      </div>
      {filteredPlaylists.length > 0 ? (
        <ul>
          {filteredPlaylists.map((playlist) => (
            <li key={playlist.id}>
              <PlaylistCard
                id={playlist.id}
                title={playlist.title}
                thumbnailUrl={playlist.thumbnail_image}
                userImage={playlist.user.profile_image}
                isOwner={playlist.is_owner}
                // subscribeCount={playlist.subscribe_count}
                // likeCount={playlist.like_count}
                // commentCount={playlist.comment_count}
              />
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-body mt-[100px] flex items-center justify-center text-font-muted">
          검색 결과가 없습니다
        </div>
      )}
    </>
  );
};

export default Home;
