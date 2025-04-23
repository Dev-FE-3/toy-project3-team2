import { useMutation } from "@tanstack/react-query";

import axiosInstance from "@/services/axios/axiosInstance";
import { Video } from "@/types/video";

// 비디오 추가 API
export const createVideos = (videos: Video[]) => {
  return Promise.all(videos.map((video) => axiosInstance.post("/video", video)));
};

// 비디오 추가 뮤테이션
export const useCreateVideosMutation = () => {
  return useMutation({
    mutationFn: (videos: Video[]) => createVideos(videos),
  });
};
