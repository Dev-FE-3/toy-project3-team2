import { useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { Video } from "@/types/video";
import { EditPlaylistPayload, NewPlaylistPayload, Playlist } from "@/types/playlist";
import {
  addVideos,
  createPlaylist,
  deleteVideo,
  editPlaylist,
  deletePlaylist,
} from "@/api/playlist";
import { showToast } from "@/utils/toast";

// 플레이리스트 생성 뮤테이션
export const useCreatePlaylistMutation = () => {
  return useMutation({
    mutationFn: (payload: NewPlaylistPayload) => createPlaylist(payload),
  });
};

// 플레이리스트 수정 뮤테이션
export const useEditPlaylistMutation = () => {
  return useMutation({
    mutationFn: ({ playlist_id, payload }: { playlist_id: string; payload: EditPlaylistPayload }) =>
      editPlaylist(playlist_id, payload),
  });
};

// 비디오 추가 뮤테이션
export const useAddVideosMutation = () => {
  return useMutation({
    mutationFn: (videos: Video[]) => addVideos(videos),
  });
};

// 비디오 삭제 뮤테이션
export const useDeleteVideoMutation = () => {
  return useMutation({
    mutationFn: ({ playlist_id, video_id }: { playlist_id: string; video_id: string }) =>
      deleteVideo(playlist_id, video_id),
  });
};

// 플레이리스트 삭제 뮤테이션
export const useDeletePlaylistMutation = (userId: string, isOwner: boolean, sortOption: string) => {
  const queryClient = useQueryClient();
  const queryKey = ["userPlaylists", userId, isOwner, sortOption] as const;

  return useMutation({
    mutationFn: deletePlaylist,
    onMutate: async (deletedId: string) => {
      await queryClient.cancelQueries({ queryKey });

      const previousData =
        queryClient.getQueryData<InfiniteData<{ playlists: Playlist[]; nextPage: number | null }>>(
          queryKey,
        );

      queryClient.setQueryData<InfiniteData<{ playlists: Playlist[]; nextPage: number | null }>>(
        queryKey,
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

      return { previousData };
    },
    onSuccess: () => {
      showToast("success", "플레이리스트가 삭제되었습니다.");
    },
    onError: (error) => {
      console.error("삭제 실패", error);
    },
  });
};
