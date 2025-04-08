import PlaylistCard from "../components/common/PlaylistCard";
import DropDownMenu from "../components/DropDownMenu";

const MyPage = () => {
  return (
    <>
      {/* user 정보 */}
      <div className="flex flex-wrap items-center gap-[14px] p-[16px]">
        <img
          className="h-[60px] w-[60px] rounded-full object-cover"
          src="https://i.pinimg.com/736x/60/0c/b6/600cb65bd5f67e70a8fac0909e4c1ee6.jpg"
          alt="User Profile"
        />
        <div className="flex w-[calc(100%-74px)] flex-col gap-[4px]">
          <span>칠걸스</span>
          <span className="text-sub text-font-muted">구독 365</span>
        </div>
        <p className="my-[2px] w-full text-font-primary">소개글을 작성해주세요</p>
      </div>

      {/* user가 생성한 플레이리스트 */}
      <div className="border-t border-outline">
        <div className="px-[20px] py-[12px] text-right">
          <DropDownMenu />
        </div>
        <ul>
          <li>
            <PlaylistCard
              id="dummyId-001"
              title="[Ghibli OST Playlist] 감성 충만 지브리 OST 연주곡 모음집"
              thumbnailUrl="https://i.pinimg.com/736x/60/0c/b6/600cb65bd5f67e70a8fac0909e4c1ee6.jpg"
              isOwner={true}
            />
          </li>
          <li>
            <PlaylistCard
              id="dummyId-002"
              title="[Ghibli OST Playlist] 감성 충만 지브리 OST 연주곡 모음집"
              thumbnailUrl="https://i.pinimg.com/736x/60/0c/b6/600cb65bd5f67e70a8fac0909e4c1ee6.jpg"
              isPublic={false}
              isOwner={true}
            />
          </li>
          <li>
            <PlaylistCard
              id="dummyId-003"
              title="[Ghibli OST Playlist] 감성 충만 지브리 OST 연주곡 모음집"
              thumbnailUrl="https://i.pinimg.com/736x/60/0c/b6/600cb65bd5f67e70a8fac0909e4c1ee6.jpg"
              isPublic={false}
              isOwner={true}
            />
          </li>
        </ul>
      </div>
    </>
  );
};

export default MyPage;
