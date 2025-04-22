/** 플레이리스트 추천 페이지 */
import { useState } from "react";

import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { usePlaylistsQuery } from "@/hooks/queries/usePlaylistsQuery";
import useSearchStore from "@/store/useSearchStore";
import useUserStore from "@/store/useUserStore";
import PlaylistList from "@/components/common/PlaylistList";

const Home = () => {
  const searchKeyword = useSearchStore((state) => state.searchKeyword);
  const userId = useUserStore.getState().user?.id;
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { playlists, hasMore, isLoading, fetchNextPage, isFetchingNextPage } = usePlaylistsQuery({
    order: "subscribe_count.desc,updated_at.desc",
    creator_id: `neq.${userId}`,
    subscribed_by: `neq.${userId}`,
    title: searchKeyword ? `ilike.%${searchKeyword}%` : undefined,
  });

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
      <PlaylistList
        playlists={playlists}
        targetRef={targetRef}
        isFetchingNextPage={isFetchingNextPage}
        isLoadingMore={isLoadingMore}
      />
    </>
  );
};

export default Home;
