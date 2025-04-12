export interface Comment {
  id: string;
  playlist_id: string;
  author_id: string;
  content: string;
  created_at: string;
  user: {
    nickname: string;
    profile_image: string;
  };
}
