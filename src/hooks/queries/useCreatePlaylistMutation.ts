import { useMutation } from "@tanstack/react-query";

import axiosInstance from "@/services/axios/axiosInstance";
import { NewPlaylistPayload } from "@/types/playlist";

// 플레이리스트 생성 API
export const createPlaylist = (payload: NewPlaylistPayload) => {
  return axiosInstance.post("/playlist", payload);
};

// 플레이리스트 생성 뮤테이션
export const useCreatePlaylistMutation = () => {
  return useMutation({
    mutationFn: (payload: NewPlaylistPayload) => createPlaylist(payload),
  });
};
