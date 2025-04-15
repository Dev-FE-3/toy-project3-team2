/** 플레이리스트 구독 페이지 */

import { useEffect, useState } from "react";

import PlaylistCard from "@/components/common/PlaylistCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { usePlaylists } from "@/hooks/usePlaylists";
import Header from "@/layout/Header";
// import { usePlaylistSearch } from "@/hooks/usePlaylistSearch";
import useUserStore from "@/store/useUserStore";

const Subscriptions = () => {
  const userId = useUserStore.getState().user?.id;
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { playlists, isLoading, hasMore, fetchNextPage, isFetchingNextPage } = usePlaylists({
    order: "updated_at.desc",
    subscribed_by: userId,
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const { targetRef } = useInfiniteScroll({
    onIntersect: () => {
      if (hasMore && !isFetchingNextPage && !isLoadingMore) {
        setIsLoadingMore(true);
        setTimeout(() => {
          fetchNextPage();
          setIsLoadingMore(false);
        }, 1000);
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
      <Header />
      <div className="mb-[16px] ml-[19px] mt-[10px]">
        <h1 className="text-body1-bold">구독 플레이리스트</h1>
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
              />
            </li>
          ))}
          <div ref={targetRef} className="flex h-4 items-center justify-center">
            {(isFetchingNextPage || isLoadingMore) && <div>Loading more...</div>}
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

export default Subscriptions;
