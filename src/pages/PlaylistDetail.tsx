import PlaylistActions from "../components/common/PlaylistAction";

interface VideoThumbnail {
  thumbnail: string;
  title: string;
}

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

const Playlist = () => {
  const dummyVideoThumbnail: VideoThumbnail[] = [
    {
      thumbnail: "https://i.pinimg.com/736x/bd/be/56/bdbe56b288ca641737df89b143f189a1.jpg",
      title: "[Playlist] 이웃집 토토로 OST 피아노 연주 1시간 재생",
    },
    {
      thumbnail: "https://i.pinimg.com/736x/9f/d6/a5/9fd6a500d50ca13a85cb66440925e725.jpg",
      title: "귀를 기울이며 OST",
    },
    {
      thumbnail: "https://i.pinimg.com/736x/cb/a3/8c/cba38c134fde13266f08fa7706e4640a.jpg",
      title: "[지브리] 마녀배달부 키키 OST",
    },
  ];

  return (
    <div className="border-y border-solid border-[#333] py-4 pl-4">
      <h3 className="text-body1-bold">재생목록</h3>
      <ul className="mt-4 flex flex-row gap-3">
        {dummyVideoThumbnail.map((video, index) => (
          <li key={index} className="flex flex-col gap-2">
            <img src={video.thumbnail} alt={video.title} className="rounded-[4px]" />
            <h4 className="line-clamp-2 text-sub">{video.title}</h4>
          </li>
        ))}
      </ul>
    </div>
  );
};

const PlaylistDetail = () => {
  return (
    <>
      <Player />
      <Playlist />
    </>
  );
};

export default PlaylistDetail;
