/** 플레이리스트 추천 페이지 */

import { useEffect } from "react";
import PlaylistCard from "@/components/common/PlaylistCard";
import Header from "@/layout/Header";
// import { usePlaylistSearch } from "@/hooks/usePlaylistSearch";
import { usePlaylists } from "@/hooks/usePlaylists";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import useUserStore from "@/store/useUserStore";
// import { useNavigate } from "react-router-dom";

const Home = () => {
  // const navigate = useNavigate();
  const userId = useUserStore.getState().user?.id;
  const { playlists, isLoading, hasMore, fetchNextPage, isFetchingNextPage } = usePlaylists({
    order: "subscribe_count.desc",
    creator_id: `neq.${userId}`,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const { targetRef } = useInfiniteScroll({
    onIntersect: () => {
      if (hasMore && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <>
      {/* <Header onSearch={setSearchKeyword} /> */}
      <Header />
      <div className="mb-[16px] ml-[19px] mt-[10px]">
        <h1 className="text-body1-bold">추천 플레이리스트</h1>
      </div>
      {playlists.length > 0 ? (
        <ul>
          {playlists.map((playlist) => (
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
          <div ref={targetRef} className="flex h-4 items-center justify-center">
            {isFetchingNextPage && <div>Loading more...</div>}
          </div>
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
