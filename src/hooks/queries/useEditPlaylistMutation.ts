import { useMutation } from "@tanstack/react-query";

import axiosInstance from "@/services/axios/axiosInstance";
import { EditPlaylistPayload } from "@/types/playlist";

// 플레이리스트 수정 API
export const editPlaylist = (playlist_id: string, payload: EditPlaylistPayload) => {
  return axiosInstance.patch(`/playlist?id=eq.${playlist_id}`, payload);
};

// 플레이리스트 수정 뮤테이션
export const useEditPlaylistMutation = () => {
  return useMutation({
    mutationFn: ({ playlist_id, payload }: { playlist_id: string; payload: EditPlaylistPayload }) =>
      editPlaylist(playlist_id, payload),
  });
};
