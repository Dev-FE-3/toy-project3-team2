import PlaylistActions from "../components/common/PlaylistAction";

const Player = () => {
  return (
    <>
      {/* 영상 영역 */}
      <div className="relative w-full pt-[56.25%]">
        {/* 16:9 비율 */}
        <iframe
          className="absolute left-0 top-0 h-full w-full"
          // 샘플 영상
          src="https://www.youtube.com/embed/sJrJO9ymOBw?si=dPsKJgsaqt6xquin"
          title="YouTube video player"
          allowFullScreen
        />
      </div>

      {/* 콘텐츠 영역 */}
      <div className="px-4 pb-6 pt-3">
        {/* 유저 정보 */}
        <div className="flex flex-row gap-2.5">
          <img
            src="https://i.pinimg.com/736x/17/c1/d9/17c1d903910937ecfd18943ee06279c2.jpg"
            alt="ijisun 프로필 이미지"
            className="h-6 w-6 rounded-full"
          />
          <p>ijisun</p>
        </div>

        {/* 플레이리스트 정보 */}
        <div className="pt-4">
          <h3 className="text-body1-bold">
            [Ghibli OST Playlist] 감성 충만 지브리 OST 연주곡 모음집
          </h3>
          <p className="mb-4 mt-2 text-sub2">
            안녕하세요. 오늘의 플레이리스트는 제가 좋아하는 지브리 애니메이션의 OST 연주곡
            모음입니다. 저의 플레이리스트가 마음에 드신다면 좋아요와 구독 부탁드려요 &#58; &#41;
          </p>
          <PlaylistActions />
        </div>
      </div>
    </>
  );
};

const PlaylistDetail = () => {
  return (
    <>
      <Player />
    </>
  );
};

export default PlaylistDetail;
