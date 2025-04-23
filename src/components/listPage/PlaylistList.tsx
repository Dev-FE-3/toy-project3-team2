import PlaylistCard from "@/components/common/PlaylistCard";
import { PlaylistCard as PlaylistCardType } from "@/types/playlist";

interface PlaylistListProps {
  playlists: PlaylistCardType[];
  targetRef: (node: HTMLDivElement | null) => void;
  isFetchingNextPage: boolean;
  isLoadingMore: boolean;
}

const PlaylistList = ({
  playlists,
  targetRef,
  isFetchingNextPage,
  isLoadingMore,
}: PlaylistListProps) => {
  if (playlists.length === 0) {
    return (
      <div className="text-body mt-[100px] flex items-center justify-center text-font-muted">
        검색 결과가 없습니다
      </div>
    );
  }

  return (
    <ul>
      {playlists.map((playlist) => (
        <li key={playlist.id}>
          <PlaylistCard
            id={playlist.id}
            title={playlist.title}
            thumbnailUrl={playlist.thumbnail_image}
            userImage={playlist.user?.profile_image ?? ""}
            isOwner={playlist.is_owner}
          />
        </li>
      ))}
      <div ref={targetRef} className="flex h-4 items-center justify-center">
        {(isFetchingNextPage || isLoadingMore) && <div>Loading more...</div>}
      </div>
    </ul>
  );
};

export default PlaylistList;
