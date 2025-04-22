/** 플레이리스트 구독 페이지 */
import { useInfiniteScrollHandler } from "@/hooks/useInfiniteScrollHandler";
import { usePlaylistsQuery } from "@/hooks/queries/usePlaylistsQuery";
import useSearchStore from "@/store/useSearchStore";
import useUserStore from "@/store/useUserStore";
import PlaylistList from "@/components/listPage/PlaylistList";
import { ListPageSkeleton } from "@/components/listPage/ListpageSkeleton";

const Subscriptions = () => {
  const searchKeyword = useSearchStore((state) => state.searchKeyword);
  const userId = useUserStore.getState().user?.id;

  const { playlists, hasMore, isLoading, fetchNextPage, isFetchingNextPage } = usePlaylistsQuery({
    order: "updated_at.desc",
    subscribed_by: userId,
    title: searchKeyword ? `ilike.%${searchKeyword}%` : undefined,
  });

  const { targetRef, isLoadingMore } = useInfiniteScrollHandler({
    hasMore,
    isFetchingNextPage,
    fetchNextPage,
  });

  if (isLoading) {
    return <ListPageSkeleton />;
  }

  return (
    <>
      <div className="mb-[16px] ml-[19px] mt-[10px]">
        <h1 className="text-body1-bold">구독 플레이리스트</h1>
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

export default Subscriptions;
