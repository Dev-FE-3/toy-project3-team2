/** 플레이리스트 추천 페이지 */
import { useState } from "react";

import PlaylistCard from "@/components/common/PlaylistCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { usePlaylistsQuery } from "@/hooks/queries/usePlaylistsQuery";
import useSearchStore from "@/store/useSearchStore";
import useUserStore from "@/store/useUserStore";

const Home = () => {
  const searchKeyword = useSearchStore((state) => state.searchKeyword);
  const userId = useUserStore.getState().user?.id;

  const { data, isLoading, hasNextPage, fetchNextPage, isFetchingNextPage } = usePlaylistsQuery({
    order: "subscribe_count.desc,updated_at.desc",
    creator_id: `neq.${userId}`,
    subscribed_by: `neq.${userId}`,
    title: searchKeyword ? `ilike.%${searchKeyword}%` : undefined,
  });

  const playlists = data?.pages.flatMap((page) => page.data) ?? [];
  const hasMore = hasNextPage;

  const [isLoadingMore, setIsLoadingMore] = useState(false);

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

export default Home;
