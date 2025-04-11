import { useState, useEffect } from "react";
import axiosInstance from "./../services/axios/axiosInstance";
import { useUserStore } from "../store/useUserStore";
import { Playlist } from "../types/playlist";
import PlaylistCard from "../components/common/PlaylistCard";
import DropDownMenu from "../components/myPage/DropDownMenu";
import ProfileImageDefault from "../assets/imgs/profile-image-default.svg";

const MyPage = () => {
  const user = useUserStore((state) => state.user);
  const [items, setItems] = useState<Playlist[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return null;

      try {
        const response = await axiosInstance.get<Playlist[]>("/playlist", {
          params: {
            creator_id: `eq.${user.id}`,
            select: "*",
          },
        });

        setItems(response.data || []);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
        return null;
      }
    };

    fetchData();
  }, [user?.id]);

  return (
    <>
      {/* user 정보 */}
      <section className="flex flex-wrap items-center gap-[14px] p-[16px]">
        <img
          className="h-[60px] w-[60px] rounded-full object-cover"
          src={user?.profile_image || ProfileImageDefault}
          alt="User? Profile"
        />
        <div className="flex flex-grow flex-col gap-[4px]">
          <span>{user?.nickname}</span>
          <span className="text-sub text-font-muted">구독 {user?.subscribe_count ?? 0}</span>
        </div>
        <p className="my-[2px] w-full text-font-primary">
          {user?.description || "소개글을 작성해주세요."}
        </p>
      </section>

      {/* user가 생성한 플레이리스트 */}
      <section className="border-t border-outline">
        <div className="px-[20px] py-[12px] text-right">
          <DropDownMenu />
        </div>
        {items.length ? (
          <ul>
            {items.map((item) => (
              <li key={item.id}>
                <PlaylistCard
                  id={item.id}
                  title={item.title}
                  thumbnailUrl={item.thumbnail_image}
                  isPublic={item.is_public}
                  isOwner={true}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-[16px]">생성한 플레이리스트가 없습니다.</p>
        )}
      </section>
    </>
  );
};

export default MyPage;
