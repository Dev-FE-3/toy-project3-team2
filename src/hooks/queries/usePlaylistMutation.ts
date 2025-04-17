import { useMutation } from "@tanstack/react-query";
import { Video } from "@/types/video";
import { EditPlaylistPayload, NewPlaylistPayload } from "@/types/playlist";
import { addVideos, createPlaylist, deleteVideo, editPlaylist } from "@/api/playlist";

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
