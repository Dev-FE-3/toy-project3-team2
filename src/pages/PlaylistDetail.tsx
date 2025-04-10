import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "../services/supabase/supabaseClient";
import { Player } from "../components/playlistDetail/Player";
import { Videos } from "../components/playlistDetail/Videos";
import { Playlist } from "../types/playlist";
import { Video } from "../types/video";

export interface PlaylistWithVideos extends Playlist {
  videos: Video[];
}

// 데이터 가져오기
const fetchPlaylist = async (id: string): Promise<PlaylistWithVideos> => {
  const { data: playlist, error: playlistError } = await supabase
    .from("playlist")
    .select("*")
    .eq("id", id)
    .single();

  if (playlistError || !playlist) {
    throw new Error("플레이리스트를 가져오는데 실패했습니다.");
  }

  const { data: videos, error: videosError } = await supabase
    .from("video")
    .select("*")
    .eq("playlist_id", id);

  if (videosError || !videos) {
    throw new Error("비디오 목록을 가져오는 데 실패했습니다.");
  }

  return { ...playlist, videos };
};

const PlaylistDetail = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: playlist,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["playlist", id],
    queryFn: () => fetchPlaylist(id!),
    enabled: !!id, // id가 있을 때만 요청
  });
  // 퍼블리싱용 더미 데이터
  // const playlist: PlaylistWithVideos = {
  //   id: "dummy-1",
  //   title: "[Ghibli OST Playlist] 감성 충만 지브리 OST 연주곡 모음집",
  //   description:
  //     "오늘의 플레이리스트는 제가 좋아하는 지브리 애니메이션의 OST 연주곡 모음입니다. 좋아요와 구독 부탁드려요 :)",
  //   creator_id: "", // 퍼블리싱 용
  //   thumbnail_image: "", // 퍼블리싱 용
  //   like_count: 10, // 퍼블리싱 용
  //   subscribe_count: 3, // 퍼블리싱 용
  //   comment_count: 5, // 퍼블리싱 용
  //   is_liked: false, // 퍼블리싱 용
  //   is_subscribed: false, // 퍼블리싱 용
  //   is_public: true, // 퍼블리싱 용
  //   created_at: "2025.04.04",
  //   updated_at: "", // 퍼블리싱 용
  //   videos: [
  //     {
  //       id: "1",
  //       playlist_id: "dummy-1",
  //       title:
  //         "[Playlist] 지브리의 피아노 OST 모음은 제가 공부하면서들을 수있어서 좋았어요 💖 (나우시카에서 아리에 티까지)",
  //       url: "https://youtu.be/U34kLXjdw90?si=jfI4WIPgtIw_Ol5I",
  //       thumbnail: "https://i.pinimg.com/736x/bd/be/56/bdbe56b288ca641737df89b143f189a1.jpg",
  //     },
  //     {
  //       id: "2",
  //       playlist_id: "dummy-1",
  //       title: "[공연실황] 기쿠지로의 여름 OST SUMMER I 지브리 & 디즈니 OST FESTA",
  //       url: "https://youtu.be/47E2E95cON4?si=PvrQR2mzVU698XGU",
  //       thumbnail: "https://img.youtube.com/vi/47E2E95cON4/maxresdefault.jpg",
  //     },
  //     {
  //       id: "3",
  //       playlist_id: "dummy-1",
  //       title:
  //         "공부할때 듣기 좋은 지브리 ost 모음 ㅣ 센과 치히로 하울의 움직이는 성 마녀 배달부 키키 토토로 ㅣ 수면 공부 카페 음악 ㅣ 중간 광고 없음",
  //       url: "https://youtu.be/ASCMw-UCafA?si=beymKHYnPa18COPI",
  //       thumbnail: "https://i.pinimg.com/736x/cb/a3/8c/cba38c134fde13266f08fa7706e4640a.jpg",
  //     },
  //     {
  //       id: "4",
  //       playlist_id: "dummy-1",
  //       title:
  //         "[Playlist] 지브리의 피아노 OST 모음은 제가 공부하면서들을 수있어서 좋았어요 💖 (나우시카에서 아리에 티까지)",
  //       url: "https://youtu.be/U34kLXjdw90?si=jfI4WIPgtIw_Ol5I",
  //       thumbnail: "https://i.pinimg.com/736x/bd/be/56/bdbe56b288ca641737df89b143f189a1.jpg",
  //     },
  //     {
  //       id: "5",
  //       playlist_id: "dummy-1",
  //       title: "[공연실황] 기쿠지로의 여름 OST SUMMER I 지브리 & 디즈니 OST FESTA",
  //       url: "https://youtu.be/47E2E95cON4?si=PvrQR2mzVU698XGU",
  //       thumbnail: "https://img.youtube.com/vi/47E2E95cON4/maxresdefault.jpg",
  //     },
  //     {
  //       id: "6",
  //       playlist_id: "dummy-1",
  //       title:
  //         "공부할때 듣기 좋은 지브리 ost 모음 ㅣ 센과 치히로 하울의 움직이는 성 마녀 배달부 키키 토토로 ㅣ 수면 공부 카페 음악 ㅣ 중간 광고 없음",
  //       url: "https://youtu.be/ASCMw-UCafA?si=beymKHYnPa18COPI",
  //       thumbnail: "https://i.pinimg.com/736x/cb/a3/8c/cba38c134fde13266f08fa7706e4640a.jpg",
  //     },
  //   ],
  // };

  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  // 플레이리스트 데이터가 도착하면 첫 번째 비디오로 설정
  useEffect(() => {
    if (!selectedVideo && playlist?.videos.length) {
      setSelectedVideo(playlist.videos[0]);
    }
  }, [playlist, selectedVideo]);

  if (isLoading) return <div>플레이리스트를 불러오는 중이에요...</div>;
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
