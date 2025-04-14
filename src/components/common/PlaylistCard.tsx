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
  onDelete?: (id: string) => void;
}

const PlaylistCard = ({
  id,
  title,
  thumbnailUrl,
  userImage,
  isPublic = true,
  isOwner,
  onDelete,
}: PlaylistCardProps) => {
  const navigate = useNavigate();

  const menuOptions = [
    { label: "수정", action: () => navigate(`/playlist/edit/${id}`) },
    {
      label: "삭제",
      action: () => {
        if (confirm("정말 삭제하시겠습니까?")) {
          onDelete?.(id);
        }
      },
    },
  ];

  const handleCardClick = () => {
    navigate(`/playlist/${id}`, { state: { isOwner } });
  };

  return (
    <div className="cursor-pointer" onClick={handleCardClick}>
      {/* 썸네일 영역: 16:9 비율 */}
      <div className="relative aspect-video w-full">
        <img
          src={thumbnailUrl}
          alt="Playlist Thumbnail"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* 정보 영역 */}
      <div className="flex flex-row px-[16px] py-[12px]">
        {/* 유저 프로필 이미지 (타인의 플레이리스트만 표시) */}
        {!isOwner && userImage && (
          <img src={userImage} alt="User" className="mr-[8px] h-[36px] w-[36px] rounded-full" />
        )}

        <div className="flex-1">
          {/* 플레이리스트 제목 */}
          <div className="flex items-start justify-between">
            <div className="flex flex-row gap-1">
              {/* 비공개 아이콘 */}
              {!isPublic && (
                <img
                  src="/src/assets/icons/lock.svg"
                  className="mr-[4px] mt-[2px] inline h-[16px] w-[16px]"
                />
              )}
              {/* 제목 */}
              <h3 className="line-clamp-2 text-body2 leading-[1.5] text-font-primary">{title}</h3>
            </div>

            {/* 수정, 삭제 메뉴 (본인의 플레이리스트일 때만 표시) */}
            {isOwner && (
              <div onClick={(e) => e.stopPropagation()}>
                <OverflowMenu options={menuOptions} />
              </div>
            )}
          </div>

          {/* 좋아요, 구독, 댓글 */}
          <div
            className="mb-[6px] mt-[12px]"
            onClick={(e) => e.stopPropagation()} // 이벤트 버블링 방지
          >
            <PlaylistActions playlistId={id} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;
