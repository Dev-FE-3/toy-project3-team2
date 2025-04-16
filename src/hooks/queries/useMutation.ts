import axiosInstance from "@/services/axios/axiosInstance";
import { EditPlaylistPayload, NewPlaylistPayload } from "@/types/playlist";
import { Video } from "@/types/video";
import { useMutation } from "@tanstack/react-query";

export const useCreatePlaylistMutation = () => {
  return useMutation({
    mutationFn: (payload: NewPlaylistPayload) => axiosInstance.post("/playlist", payload),
  });
};

export const useEditPlaylistMutation = () => {
  return useMutation({
    mutationFn: ({ playlist_id, payload }: { playlist_id: string; payload: EditPlaylistPayload }) =>
      axiosInstance.patch(`/playlist?id=eq.${playlist_id}`, payload),
  });
};

export const useAddVideosMutation = () => {
  return useMutation({
    mutationFn: (payload: Video[]) =>
      Promise.all(payload.map((payload) => axiosInstance.post("/video", payload))),
  });
};

export const useDeleteVideoMutation = () => {
  return useMutation({
    mutationFn: ({ video_id, playlist_id }: { video_id: string; playlist_id: string }) =>
      axiosInstance.delete(`/video?playlist_id=eq.${playlist_id}&id=eq.${video_id}`),
  });
};
