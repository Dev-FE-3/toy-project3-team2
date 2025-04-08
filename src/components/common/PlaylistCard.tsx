import PlaylistActions from "./PlaylistAction";
import OverflowMenu from "./OverflowMenu";
import { useNavigate } from "react-router-dom";

interface PlaylistCardProps {
  id: string;
  title: string;
  thumbnailUrl: string;
  userImage?: string;
  isPublic?: boolean;
  isOwner: boolean;
}

const PlaylistCard = ({
  id,
  title,
  thumbnailUrl,
  userImage,
  isPublic = true,
  isOwner,
}: PlaylistCardProps) => {
  const navigate = useNavigate();

  const menuOptions = [
    { label: "수정", action: () => alert("수정") },
    { label: "삭제", action: () => alert("삭제") }
  ];
  
  const handleCardClick = () => {
    navigate(`/playlist/${id}`);
  };

  return (
    <div
      className="cursor-pointer"
      onClick={handleCardClick}
    >
      {/* 썸네일 */}
      <img src={thumbnailUrl} alt="Playlist Thumbnail" className="w-full object-cover" />

      {/* 정보 영역 */}
      <div className="px-[16px] py-[12px] flex flex-row">
        {/* 유저 프로필 이미지 (타인의 플레이리스트만 표시) */}
        {!isOwner && userImage && (
          <img src={userImage} alt="User" className="w-[36px] h-[36px] rounded-full mr-[8px]" />
        )}

        <div className="flex-1">
          {/* 플레이리스트 제목 */}
          <div className="flex justify-between items-start">
            {/* 비공개 아이콘 */}
            {!isPublic && (
              <img
                src="/src/assets/icons/lock.svg"
                className="w-[16px] h-[16px] inline mr-[4px] mt-[2px]"
              />
            )}
            {/* 제목 */}
            <h3 className="text-font-primary text-body2 leading-[1.5] line-clamp-2">{title}</h3>

            {/* 수정, 삭제 메뉴 (본인의 플레이리스트일 때만 표시) */}
            {isOwner && (
              <OverflowMenu options={menuOptions} />
            )}
          </div>

          {/* 좋아요, 구독, 댓글 */}
          <div
            className="mt-[12px] mb-[6px]"
            onClick={(e) => e.stopPropagation()} // 이벤트 버블링 방지
          >
            <PlaylistActions />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;
