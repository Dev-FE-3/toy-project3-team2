import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Comments from "@/components/playlistDetail/Comments";
import Player from "@/components/playlistDetail/Player";
import PlaylistSkeleton from "@/components/playlistDetail/playlistSkeleton";
import Videos from "@/components/playlistDetail/Videos";
import { usePlaylistDetail } from "@/hooks/queries/usePlaylistDetail";
import { Video } from "@/types/video";

const PlaylistDetail = () => {
  const { id: playlistId } = useParams<{ id: string }>();
  const { data: playlist, isLoading, isError, error } = usePlaylistDetail(playlistId);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // 플레이리스트 데이터가 도착하면 첫 번째 비디오로 설정
  useEffect(() => {
    if (playlist?.videos.length) {
      setSelectedVideo(playlist.videos[0]);
    }
  }, [playlist]);

  if (isLoading) return <PlaylistSkeleton />;
  if (isError) return <div>{error instanceof Error ? error.message : "에러가 발생했어요."}</div>;
  if (!playlist) return <div>해당 플레이리스트를 찾을 수 없어요.</div>;
  if (!selectedVideo) return null;

  return (
    <section>
      <Player playlist={playlist} video={selectedVideo} />
      <Videos
        videos={playlist.videos}
        onSelect={setSelectedVideo}
        selectedVideoId={selectedVideo.id ?? ""}
      />
      <Comments />
    </section>
  );
};

export default PlaylistDetail;
