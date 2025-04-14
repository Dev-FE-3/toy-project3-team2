export interface Video {
  id?: string;
  playlist_id: string;
  title: string;
  url: string;
  thumbnail: string;
}

export type NewVideoForPlaylist = Pick<Video, "url" | "title" | "thumbnail"> & {
  id?: string;
};
