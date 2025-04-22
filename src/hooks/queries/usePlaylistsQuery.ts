import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPlaylistPage } from "../usePlaylists";
import { PlaylistCard } from "@/types/playlist";

interface UsePlaylistsOptions {
  order?: string;
  creator_id?: string;
  subscribed_by?: string;
  is_public?: boolean;
  title?: string;
}

export const usePlaylistsQuery = (options?: UsePlaylistsOptions) => {
  return useInfiniteQuery<{ data: PlaylistCard[]; nextPage?: number }>({
    queryKey: ["playlists", options],
    queryFn: ({ pageParam }) => fetchPlaylistPage({ pageParam: pageParam as number }, options),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
};
