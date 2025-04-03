interface PlaylistCardProps {
  title: string;
  thumbnailUrl: string;
  userImage?: string;
  showUserImage?: boolean;
  isPublic: boolean;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({
  title,
  thumbnailUrl,
  userImage,
  showUserImage = true,
  isPublic = true,
}) => {
  return (
    <div className="w-[100%]">
      {/* 썸네일 */}
      <div>
        <img src={thumbnailUrl} alt="Playlist Thumbnail" />
      </div>

      {/* 정보 영역 */}
      <div className="px-[16px] py-[12px] flex flex-row gap-[8px]">
        {/* 유저 프로필 이미지 (옵션) */}
        {showUserImage && userImage && (
          <img src={userImage} alt="User" className="w-[36px] h-[36px] rounded-full" />
        )}

        <div>
          {/* 플레이리스트 제목 */}
          <div className="text-font-primary text-body2">
            {/* 비공개 아이콘 */}
            {!isPublic && (
              <img
                src="/src/assets/icons/icon-lock.svg"
                className="w-[16px] h-[16px] inline mr-[4px]"
              />
            )}
            <span>{title}</span>
          </div>

          {/* 좋아요, 구독, 댓글 */}
          <div>{/* PlaylistActions 컴포넌트 들어감 */}</div>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCard;
