import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Video } from "../types/video";
import { usePlaylistDetail } from "../hooks/usePlaylistDetail";
import Player from "../components/playlistDetail/Player";
import Videos from "../components/playlistDetail/Videos";
import PlaylistSkeleton from "../components/playlistDetail/playlistSkeleton";

const PlaylistDetail = () => {
  const { id: playlistId } = useParams<{ id: string }>();
  const { data: playlist, isLoading, isError, error } = usePlaylistDetail(playlistId);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // 플레이리스트 데이터가 도착하면 첫 번째 비디오로 설정
  useEffect(() => {
    if (!selectedVideo && playlist?.videos.length) {
      setSelectedVideo(playlist.videos[0]);
    }
  }, [playlist, selectedVideo]);

  if (isLoading) return <PlaylistSkeleton />;
  if (isError) return <div>{error instanceof Error ? error.message : "에러가 발생했어요."}</div>;
  if (!playlist || !selectedVideo) return <div>해당 플레이리스트를 찾을 수 없어요.</div>;

  return (
    <section>
      <Player playlist={playlist} video={selectedVideo} />
      <Videos
        videos={playlist.videos}
        onSelect={setSelectedVideo}
        selectedVideoId={selectedVideo.id}
      />
    </section>
  );
};

export default PlaylistDetail;
