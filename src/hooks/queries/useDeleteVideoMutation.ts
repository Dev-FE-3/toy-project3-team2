import { useMutation } from "@tanstack/react-query";

import axiosInstance from "@/services/axios/axiosInstance";

// 비디오 삭제 API
export const deleteVideo = (playlist_id: string, video_id: string) => {
  return axiosInstance.delete(`/video?playlist_id=eq.${playlist_id}&id=eq.${video_id}`);
};

// 비디오 삭제 뮤테이션
export const useDeleteVideoMutation = () => {
  return useMutation({
    mutationFn: ({ playlist_id, video_id }: { playlist_id: string; video_id: string }) =>
      deleteVideo(playlist_id, video_id),
  });
};
