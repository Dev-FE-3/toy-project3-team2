import axiosInstance from "@/services/axios/axiosInstance";
import { EditPlaylistPayload, NewPlaylistPayload } from "@/types/playlist";
import { Video } from "@/types/video";

// 플레이리스트 생성 API
export const createPlaylist = (payload: NewPlaylistPayload) => {
  return axiosInstance.post("/playlist", payload);
};

// 플레이리스트 수정 API
export const editPlaylist = (playlist_id: string, payload: EditPlaylistPayload) => {
  return axiosInstance.patch(`/playlist?id=eq.${playlist_id}`, payload);
};

// 비디오 추가 API
export const addVideos = (videos: Video[]) => {
  return Promise.all(videos.map((video) => axiosInstance.post("/video", video)));
};

// 비디오 삭제 API
export const deleteVideo = (playlist_id: string, video_id: string) => {
  return axiosInstance.delete(`/video?playlist_id=eq.${playlist_id}&id=eq.${video_id}`);
};
