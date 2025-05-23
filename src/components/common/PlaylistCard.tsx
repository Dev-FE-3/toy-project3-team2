import { useNavigate } from "react-router-dom";

import Lock from "@/assets/icons/lock.svg?react";

import OverflowMenu from "./OverflowMenu";
import PlaylistActions from "./PlaylistAction";
import { ModalDelete } from "./ModalDelete";
import { useState } from "react";

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

  // 모달을 제어할 상태 추가
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [playlistToDelete, setPlaylistToDelete] = useState<string | null>(null); // 삭제할 플레이리스트 ID

  const menuOptions = [
    { label: "수정", action: () => navigate(`/playlist/edit/${id}`) },
    {
      label: "삭제",
      action: () => {
        setPlaylistToDelete(id); // 삭제할 플레이리스트 ID 설정
        setIsModalOpen(true); // 모달 열기
      },
    },
  ];

  // 삭제 확인 모달
  const confirmDelete = () => {
    if (playlistToDelete) {
      onDelete?.(playlistToDelete); // 삭제 함수 호출
      setIsModalOpen(false); // 모달 닫기
    }
  };

  const cancelDelete = () => {
    setIsModalOpen(false); // 모달 닫기
  };

  const handleCardClick = () => {
    navigate(`/playlist/${id}`);
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
      <div className="flex flex-row px-4 py-3">
        {/* 유저 프로필 이미지 (타인의 플레이리스트만 표시) */}
        {!isOwner && userImage && (
          <img src={userImage} alt="User" className="mr-2 h-9 w-9 rounded-full" />
        )}

        <div className="flex-1">
          {/* 플레이리스트 제목 */}
          <div className="flex items-start justify-between">
            <div className="flex flex-row gap-1">
              {/* 비공개 아이콘 */}
              {!isPublic && <Lock className="mr-1 mt-[2px] inline h-4 w-4" />}
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
            className="mb-[6px] mt-2"
            onClick={(e) => e.stopPropagation()} // 이벤트 버블링 방지
          >
            <PlaylistActions playlistId={id} />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ModalDelete isOpen={isModalOpen} onClose={cancelDelete} onConfirm={confirmDelete} />
      )}
    </div>
  );
};

export default PlaylistCard;
