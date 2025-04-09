import { useState } from "react";
import PlaylistActions from "../components/common/PlaylistAction";

interface Video {
  id: number;
  title: string;
  url: string;
  thumbnail: string;
}

interface Playlist {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

interface PlaylistWithVideos extends Playlist {
  videos: Video[];
}

const Player = ({ playlist, video }: { playlist: Playlist; video: Video }) => {
  // youtube URL을 embed용 URL로 변환
  const getEmbedUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const hostname = urlObj.hostname;
      let videoId = "";

      if (hostname === "youtu.be") {
        videoId = urlObj.pathname.slice(1);
      } else if (hostname === "www.youtube.com" || hostname === "youtube.com") {
        const queryVideoId = urlObj.searchParams.get("v");
        if (queryVideoId) {
          videoId = queryVideoId;
        }
      }

      if (!videoId) {
        return url; // 예외 처리
      }

      const params = new URLSearchParams({
        autoplay: "1", // 자동재생
        mute: "1", // 음소거(자동재생 하려면 필수)
        controls: "1", // 컨트롤러 숨기려면 0
        modestbranding: "1", // 유튜브 로고 최소화
        rel: "0", // 관련 영상 안 보이도록
      });

      return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
    } catch {
      console.warn("잘못된 URL 형식입니다:", url);
      return "";
    }
  };

  const embedUrl = getEmbedUrl(video.url);

  return (
    <>
      {/* 영상 영역 */}
      <div className="relative w-full pt-[56.25%]">
        {/* 16:9 비율 */}
        <iframe
          className="absolute left-0 top-0 h-full w-full"
          src={embedUrl}
          title={video.title}
          allowFullScreen
        />
      </div>

      {/* 콘텐츠 영역 */}
      <div className="px-4 pb-6 pt-3">
        {/* 유저 정보 */}
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-row gap-2.5">
            <img
              src="https://i.pinimg.com/736x/17/c1/d9/17c1d903910937ecfd18943ee06279c2.jpg"
              alt="ijisun 프로필 이미지"
              className="h-6 w-6 rounded-full"
            />
            <p>ijisun</p>
          </div>
          <div className="text-sub">
            <p>등록일 {playlist.created_at}</p>
          </div>
        </div>

        {/* 플레이리스트 정보 */}
        <div className="pt-4">
          <h3 className="text-body1-bold">{playlist.title}</h3>
          <p className="mb-4 mt-2 text-sub2">{playlist.description}</p>
          <PlaylistActions />
        </div>
      </div>
    </>
  );
};

const Videos = ({
  videos,
  onSelect,
  selectedVideoId,
}: {
  videos: Video[];
  onSelect: (video: Video) => void;
  selectedVideoId: number;
}) => {
  return (
    <div className="border-y border-solid border-[#333] py-4">
      <h3 className="pl-4 text-body1-bold">재생목록</h3>
      <div className="scrollbar-hide overflow-x-auto">
        <ul className="mt-4 flex flex-row gap-3">
          {videos.map((video, index) => {
            const isActive = video.id === selectedVideoId;
            return (
              <li
                key={index}
                className={`flex w-[150px] shrink-0 cursor-pointer flex-col gap-2 ${index === 0 ? "ml-4" : ""} ${isActive ? "opacity-100" : "opacity-60"}`}
                onClick={() => onSelect(video)}
              >
                <div className="h-21 flex w-full items-center justify-center overflow-hidden rounded-[4px] bg-black">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h4 className="line-clamp-2 text-sub">{video.title}</h4>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

const PlaylistDetail = () => {
  // 퍼블리싱용 더미 데이터
  const playlist: PlaylistWithVideos = {
    id: 1,
    title: "[Ghibli OST Playlist] 감성 충만 지브리 OST 연주곡 모음집",
    description:
      "오늘의 플레이리스트는 제가 좋아하는 지브리 애니메이션의 OST 연주곡 모음입니다. 좋아요와 구독 부탁드려요 :)",
    created_at: "2025.04.04",
    videos: [
      {
        id: 1,
        title:
          "[Playlist] 지브리의 피아노 OST 모음은 제가 공부하면서들을 수있어서 좋았어요 💖 (나우시카에서 아리에 티까지)",
        url: "https://youtu.be/U34kLXjdw90?si=jfI4WIPgtIw_Ol5I",
        thumbnail: "https://i.pinimg.com/736x/bd/be/56/bdbe56b288ca641737df89b143f189a1.jpg",
      },
      {
        id: 2,
        title: "[공연실황] 기쿠지로의 여름 OST SUMMER I 지브리 & 디즈니 OST FESTA",
        url: "https://youtu.be/47E2E95cON4?si=PvrQR2mzVU698XGU",
        thumbnail: "https://img.youtube.com/vi/47E2E95cON4/maxresdefault.jpg",
      },
      {
        id: 3,
        title:
          "공부할때 듣기 좋은 지브리 ost 모음 ㅣ 센과 치히로 하울의 움직이는 성 마녀 배달부 키키 토토로 ㅣ 수면 공부 카페 음악 ㅣ 중간 광고 없음",
        url: "https://youtu.be/ASCMw-UCafA?si=beymKHYnPa18COPI",
        thumbnail: "https://i.pinimg.com/736x/cb/a3/8c/cba38c134fde13266f08fa7706e4640a.jpg",
      },
      {
        id: 4,
        title:
          "[Playlist] 지브리의 피아노 OST 모음은 제가 공부하면서들을 수있어서 좋았어요 💖 (나우시카에서 아리에 티까지)",
        url: "https://youtu.be/U34kLXjdw90?si=jfI4WIPgtIw_Ol5I",
        thumbnail: "https://i.pinimg.com/736x/bd/be/56/bdbe56b288ca641737df89b143f189a1.jpg",
      },
      {
        id: 5,
        title: "[공연실황] 기쿠지로의 여름 OST SUMMER I 지브리 & 디즈니 OST FESTA",
        url: "https://youtu.be/47E2E95cON4?si=PvrQR2mzVU698XGU",
        thumbnail: "https://img.youtube.com/vi/47E2E95cON4/maxresdefault.jpg",
      },
      {
        id: 6,
        title:
          "공부할때 듣기 좋은 지브리 ost 모음 ㅣ 센과 치히로 하울의 움직이는 성 마녀 배달부 키키 토토로 ㅣ 수면 공부 카페 음악 ㅣ 중간 광고 없음",
        url: "https://youtu.be/ASCMw-UCafA?si=beymKHYnPa18COPI",
        thumbnail: "https://i.pinimg.com/736x/cb/a3/8c/cba38c134fde13266f08fa7706e4640a.jpg",
      },
    ],
  };

  const [selectedVideo, setSelectedVideo] = useState<Video>(playlist.videos[0]);

  return (
    <>
      <Player playlist={playlist} video={selectedVideo} />
      <Videos
        videos={playlist.videos}
        onSelect={setSelectedVideo}
        selectedVideoId={selectedVideo.id}
      />
    </>
  );
};

export default PlaylistDetail;
