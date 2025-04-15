import { useQuery, useMutation, useQueryClient, InfiniteData } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import PlaylistCard from "../components/common/PlaylistCard";
import DropDownMenu from "../components/myPage/DropDownMenu";
import useUserStore from "../store/useUserStore";
import { useUserPlaylists } from "@/hooks/useUserPlaylists";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Playlist } from "../types/playlist";
import { User } from "../types/user";
import axiosInstance from "./../services/axios/axiosInstance";
import { showToast } from "@/utils/toast";

// fetch
const fetchUser = async (userId: string) => {
  const { data } = await axiosInstance.get<User[]>("/user", {
    params: {
      id: `eq.${userId}`,
      select: "*",
    },
  });
  return data[0];
};

// 플레이리스트 삭제
const deletePlaylist = async (playlistId: string) => {
  if (!confirm("정말 삭제하시겠습니까?")) return;

  // 댓글 삭제
  await axiosInstance.delete("/comment", {
    params: { playlist_id: `eq.${playlistId}` },
  });

  // 액션 삭제
  await axiosInstance.delete("/action", {
    params: { playlist_id: `eq.${playlistId}` },
  });

  // 비디오 삭제 (모두)
  await axiosInstance.delete("/video", {
    params: { playlist_id: `eq.${playlistId}` },
  });

  // 마지막으로 플레이리스트 삭제
  await axiosInstance.delete("/playlist", {
    params: { id: `eq.${playlistId}` },
  });

  // alert("플레이리스트 삭제 완료!");
  // react-toastify 사용
  showToast("success", "플레이리스트가 삭제되었습니다.");
  return playlistId;
};

const MyPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const {
    data: userInfo,
    isLoading: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: ["userInfo", userId],
    queryFn: () => fetchUser(userId!),
    enabled: !!userId,
  });

  const isOwner = user?.id === userId;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isPlaylistLoading,
    error: playlistError,
  } = useUserPlaylists(userId!, isOwner);

  const playlists = data?.pages.flatMap((page) => page.data) ?? [];

  const deleteMutation = useMutation({
    mutationFn: deletePlaylist,
    onSuccess: (deletedId) => {
      queryClient.setQueryData<InfiniteData<{ data: Playlist[]; nextPage: number | null }>>(
        ["userPlaylists", userId, isOwner],
        (old) =>
          old
            ? {
                ...old,
                pages: old.pages.map((page) => ({
                  ...page,
                  data: page.data.filter((item) => item.id !== deletedId),
                })),
              }
            : old,
      );
    },
    onError: (error) => {
      console.error("삭제 실패", error);
      alert("삭제에 실패했습니다.");
    },
  });

  const sortedItems = [...items].sort((a, b) => {
    const dateA = new Date(a.updated_at ?? a.created_at).getTime();
    const dateB = new Date(b.updated_at ?? b.created_at).getTime();

    return dateB - dateA;
  });

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  useEffect(() => {
    if (userError || playlistError) {
      navigate("/error");
    }
  }, [userError, playlistError, navigate]);

  if (isUserLoading || isPlaylistLoading) {
    return <div className="p-4">로딩 중...</div>;
  }

  return (
    <>
      {/* user 정보 */}
      <section className="flex flex-wrap items-center gap-[14px] p-[16px]">
        <img
          className="h-[60px] w-[60px] rounded-full object-cover"
          src={userInfo?.profile_image}
          alt="User Profile"
        />
        <div className="flex flex-grow flex-col gap-[4px]">
          <span>{userInfo?.nickname}</span>
          <span className="text-sub text-font-muted">구독 {userInfo?.subscribe_count ?? 0}</span>
        </div>
        <p className="my-[2px] w-full text-font-primary">
          {userInfo?.description || "소개글을 작성해주세요."}
        </p>
      </section>

      {/* user가 생성한 플레이리스트 */}
      <section className="border-t border-outline">
        <div className="px-[20px] py-[12px] text-right">
          <DropDownMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
        </div>
        {playlists.length > 0 ? (
          <ul>
            {sortedItems.map((item) => (
              <li key={item.id}>
                <PlaylistCard
                  id={item.id}
                  title={item.title}
                  thumbnailUrl={item.thumbnail_image}
                  isPublic={item.is_public}
                  isOwner={isOwner}
                  onDelete={handleDelete}
                />
              </li>
            ))}
            <div ref={targetRef} className="flex h-4 items-center justify-center">
              {isFetchingNextPage && <div>Loading more...</div>}
            </div>
          </ul>
        ) : (
          <p className="px-[16px]">생성한 플레이리스트가 없습니다.</p>
        )}
      </section>

      {isMenuOpen && (
        <div
          className="fixed inset-0 z-10 bg-overlay-primary"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </>
  );
};

export default MyPage;
