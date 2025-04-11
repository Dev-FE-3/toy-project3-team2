import { useState } from "react";
import { PlaylistDetailData } from "../../types/playlist";
import { Video } from "../../types/video";
import PlaylistActions from "../common/PlaylistAction";
import { formatDate } from "../../utils/formatData";

const MAX_DESCRIPTION_PREVIEW_LENGTH = 60;

export const Player = ({ playlist, video }: { playlist: PlaylistDetailData; video: Video }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isClamped = playlist.description.length > MAX_DESCRIPTION_PREVIEW_LENGTH;
  const visibleText = isExpanded
    ? playlist.description
    : playlist.description.slice(0, MAX_DESCRIPTION_PREVIEW_LENGTH);

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
        autoplay: "0", // 자동재생
        mute: "0", // 음소거(자동재생 하려면 필수)
        controls: "0", // 컨트롤러 숨기려면 0
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
  const creator = playlist.user;

  return (
    <>
      {/* 영상 영역 */}
      <section className="relative w-full pt-[56.25%]">
        {/* 16:9 비율 */}
        <iframe
          className="absolute left-0 top-0 h-full w-full"
          src={embedUrl}
          title={video.title}
          allowFullScreen
        />
      </section>

      {/* 콘텐츠 영역 */}
      <section className="space-y-4 px-4 pb-6 pt-3">
        {/* 유저 정보 */}
        <div className="flex items-center justify-between">
          <div className="flex gap-2.5">
            <img src={creator?.profile_image} className="h-6 w-6 rounded-full" />
            <p>{creator?.nickname}</p>
          </div>
          <div className="text-sub">
            <p>등록일 {formatDate(playlist.created_at)}</p>
          </div>
        </div>

        {/* 플레이리스트 정보 */}
        <div>
          <h3 className="text-body1-bold">{playlist.title}</h3>
          <p className="mb-4 mt-2 text-sub2">
            {visibleText}
            {!isExpanded && isClamped && (
              <>
                <span className="text-sub2">... </span>
                <button
                  onClick={() => setIsExpanded(true)}
                  className="ml-1 text-sub2 text-font-more hover:underline"
                >
                  더보기
                </button>
              </>
            )}
          </p>
          <PlaylistActions />
        </div>
      </section>
    </>
  );
};
