import { useState } from "react";

import DropDownMenu from "@/components/myPage/DropDownMenu";
import PlaylistCard from "@/components/common/PlaylistCard";
import PlaylistEmpty from "@/components/common/PlaylistEmpty";
import { useUserPlaylistsQuery } from "@/hooks/queries/useUserPlaylistsQuery";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useDeletePlaylistMutation } from "@/hooks/queries/usePlaylistMutation";
import DROP_DOWN_MENU_OPTIONS from "@/constants/dropDownMenuOptions";

interface Props {
  userId: string;
  isOwner: boolean;
}

const UserPlaylistSection = ({ userId, isOwner }: Props) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sortOption, setSortOption] = useState("updated");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const selectedOption =
    DROP_DOWN_MENU_OPTIONS.find((opt) => opt.value === sortOption) ?? DROP_DOWN_MENU_OPTIONS[0];

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isPlaylistLoading,
    error: playlistError,
  } = useUserPlaylistsQuery(userId, isOwner, sortOption);

  const playlists = data?.pages.flatMap((page) => page.playlists);
  const deleteMutation = useDeletePlaylistMutation(userId, isOwner, sortOption);

  const { targetRef } = useInfiniteScroll({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage && !isLoadingMore) {
        setIsLoadingMore(true);
        setTimeout(() => {
          fetchNextPage();
          setIsLoadingMore(false);
        }, 1000);
      }
    },
  });

  if (playlistError) return <div>에러 발생</div>;
  if (isPlaylistLoading) return <div className="p-4">로딩 중...</div>;

  return (
    <section className="border-t border-outline">
      <div className="px-[20px] py-[12px] text-right">
        <DropDownMenu
          isOpen={isMenuOpen}
          setIsOpen={setIsMenuOpen}
          setSortOption={setSortOption}
          selected={selectedOption}
        />
      </div>

      {playlists && playlists.length > 0 ? (
        <ul>
          {playlists.map((item) => (
            <li key={item.id}>
              <PlaylistCard
                id={item.id}
                title={item.title}
                thumbnailUrl={item.thumbnail_image}
                isPublic={item.is_public}
                isOwner={isOwner}
                onDelete={() => deleteMutation.mutate(item.id)}
              />
            </li>
          ))}
          <div ref={targetRef} className="flex h-4 items-center justify-center">
            {(isFetchingNextPage || isLoadingMore) && <div>Loading more...</div>}
          </div>
        </ul>
      ) : (
        <PlaylistEmpty />
      )}

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-10 bg-overlay-primary"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </section>
  );
};

export default UserPlaylistSection;
