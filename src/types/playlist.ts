import { Video } from "./video";

export interface Playlist {
  id: string;
  title: string;
  description: string;
  creator_id: string;
  thumbnail_image: string;
  like_count: number;
  subscribe_count: number;
  comment_count: number;
  is_liked: boolean;
  is_subscribed: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlaylistWithVideos extends Playlist {
  videos: Video[];
}
