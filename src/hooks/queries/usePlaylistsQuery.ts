import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchPlaylistPage } from "../usePlaylists";

interface UsePlaylistsOptions {
  order?: string;
  creator_id?: string;
  subscribed_by?: string;
  is_public?: boolean;
  title?: string;
}

export const usePlaylistsQuery = (options?: UsePlaylistsOptions) => {
  return useInfiniteQuery({
    queryKey: ["playlists", options],
    queryFn: ({ pageParam }) => fetchPlaylistPage({ pageParam }, options),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
  });
};
