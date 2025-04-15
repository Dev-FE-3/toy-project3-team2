/** 플레이리스트 추천 페이지 */

import { useEffect, useState } from "react";

import PlaylistCard from "@/components/common/PlaylistCard";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { usePlaylists } from "@/hooks/usePlaylists";
import Header from "@/layout/Header";
import useUserStore from "@/store/useUserStore";

const Home = () => {
  // const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const userId = useUserStore.getState().user?.id;

  const { playlists, isLoading, hasMore, fetchNextPage, isFetchingNextPage } = usePlaylists({
    order: "subscribe_count.desc,updated_at.desc",
    creator_id: `neq.${userId}`,
    title: searchKeyword ? `ilike.%${searchKeyword}%` : undefined,
  });

  const [isLoadingMore, setIsLoadingMore] = useState(false);

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
      <Header onSearch={setSearchKeyword} />
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
