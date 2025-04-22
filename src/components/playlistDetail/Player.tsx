import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Lock from "@/assets/icons/lock.svg?react";
import PlaylistActions from "@/components/common/PlaylistAction";
import { PlaylistDetailData } from "@/types/playlist";
import { Video } from "@/types/video";
import { formatDate } from "@/utils/formatData";
import { getEmbedUrl } from "@/utils/getEmbedUrl";

const MAX_DESCRIPTION_PREVIEW_LENGTH = 60;

const Player = ({ playlist, video }: { playlist: PlaylistDetailData; video: Video }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  // 소개글 더보기
  const isClamped = playlist.description.length > MAX_DESCRIPTION_PREVIEW_LENGTH;
  const visibleText = isExpanded
    ? playlist.description
    : playlist.description.slice(0, MAX_DESCRIPTION_PREVIEW_LENGTH);

  // 임베드용 url 저장
  const embedUrl = getEmbedUrl(video.url);

  const creator = playlist.user;

  // 유저 정보 클릭 시 마이페이지로 이동
  const handleCreatorClick = () => {
    if (creator?.id) {
      navigate(`/mypage/${creator.id}`);
    }
  };

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
          <div className="flex cursor-pointer gap-2.5" onClick={handleCreatorClick}>
            <img src={creator?.profile_image} className="h-6 w-6 rounded-full" />
            <p>{creator?.nickname}</p>
          </div>
          <div className="text-sub">
            <p>등록일 {formatDate(playlist.created_at)}</p>
          </div>
        </div>

        {/* 플레이리스트 정보 */}
        <div>
          <h3 className="align-baseline text-body1-bold">
            {!playlist.is_public && <Lock className="mr-2 mt-[-2px] inline w-4" />}
            {playlist.title}
          </h3>
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
          <PlaylistActions playlistId={playlist.id} />
        </div>
      </section>
    </>
  );
};

export default Player;
