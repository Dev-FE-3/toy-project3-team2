import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query";

import axiosInstance from "@/services/axios/axiosInstance";
import { Playlist } from "@/types/playlist";
import { showToast } from "@/utils/toast";

// 플레이리스트 삭제 API
export const deletePlaylist = async (playlistId: string): Promise<string> => {
  await axiosInstance.delete("/comment", {
    params: { playlist_id: `eq.${playlistId}` },
  });

  await axiosInstance.delete("/action", {
    params: { playlist_id: `eq.${playlistId}` },
  });

  await axiosInstance.delete("/video", {
    params: { playlist_id: `eq.${playlistId}` },
  });

  await axiosInstance.delete("/playlist", {
    params: { id: `eq.${playlistId}` },
  });

  return playlistId;
};

// 플레이리스트 삭제 뮤테이션
export const useDeletePlaylistMutation = (userId: string, isOwner: boolean, sortOption: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePlaylist,
    onSuccess: (deletedId) => {
      showToast("success", "플레이리스트가 삭제되었습니다.");

      queryClient.setQueryData<InfiniteData<{ playlists: Playlist[]; nextPage: number | null }>>(
        ["userPlaylists", userId, isOwner, sortOption],
        (old) =>
          old
            ? {
                ...old,
                pages: old.pages.map((page) => ({
                  ...page,
                  playlists: page.playlists.filter((item) => item.id !== deletedId),
                })),
              }
            : old,
      );
    },
    onError: (error) => {
      console.error("삭제 실패", error);
    },
  });
};
