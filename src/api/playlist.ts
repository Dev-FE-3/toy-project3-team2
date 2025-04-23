import axiosInstance from "@/services/axios/axiosInstance";
import {
  EditPlaylistPayload,
  NewPlaylistPayload,
  Playlist,
  PlaylistParams,
} from "@/types/playlist";
import { Video } from "@/types/video";

// 플레이리스트 조회 API
export const getPlaylists = (params: PlaylistParams) => {
  return axiosInstance.get<Playlist[]>("/playlist", { params });
};

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
