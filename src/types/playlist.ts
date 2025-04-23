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

export interface PlaylistDetailData extends Playlist {
  videos: Video[];
  user?: {
    id: string;
    nickname: string;
    profile_image: string;
  };
}

export interface NewPlaylistPayload {
  title: string;
  description: string;
  creator_id: string;
  thumbnail_image: string;
  is_public: boolean;
}

export interface EditPlaylistPayload {
  title: string;
  description: string;
  updated_at: string;
  thumbnail_image: string;
  is_public: boolean;
}

export interface PlaylistParams {
  creator_id: string;
  select: string;
  limit: number;
  offset: number;
  order: string;
  is_public?: string;
}
