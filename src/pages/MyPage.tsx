import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import useUserStore from "@/store/useUserStore";
import { useUserInfoQuery } from "@/hooks/queries/useUserInfoQuery";

import UserProfileSection from "@/components/myPage/UserProfileSection";
import UserPlaylistSection from "@/components/myPage/UserPlaylistSection";

const MyPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const user = useUserStore((state) => state.user);
  const navigate = useNavigate();
  const { data: userInfo, isLoading: isUserLoading, error: userError } = useUserInfoQuery(userId!);

  useEffect(() => {
    if (userError) {
      navigate("/error");
    }
  }, [userError, navigate]);

  if (isUserLoading) return <div className="p-4">로딩 중...</div>;

  const isOwner = user?.id === userId;

  return (
    <>
      {/* user 정보 */}
      <UserProfileSection userInfo={userInfo!} />

      {/* user가 생성한 플레이리스트 */}
      <UserPlaylistSection userId={userId!} isOwner={isOwner} />
    </>
  );
};

export default MyPage;
