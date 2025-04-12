/** 플레이리스트 구독 페이지 */

import PlaylistCard from "../components/common/PlaylistCard";

import PlaylistCard from "../components/common/PlaylistCard";

const Subscriptions = () => {
  return (
    <>
      <div className="mb-[16px] ml-[19px] mt-[10px]">
        <h1 className="text-body1-bold">구독 플레이리스트</h1>
      </div>
      <ul>
        <li>
          <PlaylistCard
            id="dummyId-001"
            title="[Ghibli OST Playlist] 감성 충만 지브리 OST 연주곡 모음집 | 마녀배달부 키키, 이웃집 토토로, 센과 치히로의 행방불명 등"
            thumbnailUrl="https://i.pinimg.com/736x/60/0c/b6/600cb65bd5f67e70a8fac0909e4c1ee6.jpg"
            userImage="https://i.pinimg.com/736x/17/c1/d9/17c1d903910937ecfd18943ee06279c2.jpg"
            isOwner={false}
            subscribe_count={0}
            like_count={0}
            comment_count={0}
          />
        </li>
        <li>
          <PlaylistCard
            id="dummyId-002"
            title="[Ghibli OST Playlist] 감성 충만 지브리 OST 연주곡 모음집 | 마녀배달부 키키, 이웃집 토토로, 센과 치히로의 행방불명 등"
            thumbnailUrl="https://i.pinimg.com/736x/60/0c/b6/600cb65bd5f67e70a8fac0909e4c1ee6.jpg"
            userImage="https://i.pinimg.com/736x/17/c1/d9/17c1d903910937ecfd18943ee06279c2.jpg"
            isOwner={false}
            subscribe_count={0}
            like_count={0}
            comment_count={0}
          />
        </li>
        <li>
          <PlaylistCard
            id="dummyId-002"
            title="[Ghibli OST Playlist] 감성 충만 지브리 OST 연주곡 모음집 | 마녀배달부 키키, 이웃집 토토로, 센과 치히로의 행방불명 등"
            thumbnailUrl="https://i.pinimg.com/736x/60/0c/b6/600cb65bd5f67e70a8fac0909e4c1ee6.jpg"
            userImage="https://i.pinimg.com/736x/17/c1/d9/17c1d903910937ecfd18943ee06279c2.jpg"
            isOwner={false}
            subscribe_count={0}
            like_count={0}
            comment_count={0}
          />
        </li>
      </ul>
    </>
  );
};

export default Subscriptions;
