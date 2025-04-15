import { useRef, useState, useEffect, RefObject } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

import supabase from "@/services/supabase/supabaseClient";
import axiosInstance from "@/services/axios/axiosInstance";

import useUserStore from "@/store/useUserStore";

import ArrowLeft from "@/assets/icons/arrow-left.svg?react";
import Logo from "@/assets/imgs/logo.svg?react";
import Search from "@/assets/icons/search.svg?react";

import OverflowMenu from "@/components/common/OverflowMenu";
import SearchBar from "@/components/common/SearchBar";

import { usePlaylistDetail } from "@/hooks/usePlaylistDetail";

type HeaderProps = {
  onSearch?: (query: string) => void;
  nickname?: string;
};

const Header = ({ onSearch }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [nickname, setNickname] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [playlistTitle, setPlaylistTitle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  const searchInputRef: RefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);
  const hiddenPaths = ["/login"];

  const { userId, id: playlistId } = useParams();
  const user = useUserStore((state) => state.user);

  const playlist = usePlaylistDetail(playlistId);

  useEffect(() => {
    if (!user) return;

    if (playlist.data?.creator_id === user.id) setIsOwner(true);
    else setIsOwner(false);
  }, [location, playlist.data?.creator_id, user]);

  // 페이지 이동 시 검색 상태 초기화
  useEffect(() => {
    setSearchQuery("");
    setIsSearchOpen(false);
    if (onSearch) {
      onSearch("");
    }
  }, [location.pathname]);

  // 플레이리스트 상세 제목 fetch
  useEffect(() => {
    const fetchPlaylistTitle = async () => {
      if (playlistId) {
        try {
          const { data, status } = await axiosInstance.get(
            `/playlist?id=eq.${playlistId}&select=title`,
          );
          if (status === 200 && data && data.length > 0) {
            setPlaylistTitle(data[0].title);
          } else {
            throw new Error("데이터 없음");
          }
        } catch (err) {
          console.error("플레이리스트 제목 불러오기 실패:", err);
          setPlaylistTitle("플레이리스트");
        }
      }
      setIsLoading(false);
    };

    fetchPlaylistTitle();
  }, [playlistId]);

  // 타이틀: 유저 닉네임
  useEffect(() => {
    const fetchNickname = async () => {
      if (userId) {
        try {
          const { data } = await axiosInstance.get(`/user`, {
            params: {
              id: `eq.${userId}`,
              select: "nickname",
            },
          });
          setNickname(data[0]?.nickname);
        } catch (error) {
          console.error("닉네임 가져오기 실패", error);
          setNickname("사용자");
        }
      }
    };

    fetchNickname();
  }, [userId]);

  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  const titleMap: { [key: string]: string } = {
    "/signup": "회원가입",
    "/user/edit": "정보 수정",
    "/playlist/create": "플레이리스트 생성",
    "/guide": "컴포넌트 가이드",
  };

  let title = "페이지";
  const currentUser = useUserStore.getState().user;

  if (location.pathname.startsWith("/mypage")) {
    if (currentUser && userId === currentUser.id) {
      title = "마이페이지";
    } else {
      title = nickname || "작성자";
    }
  } else if (
    location.pathname.startsWith("/playlist/") &&
    location.pathname !== "/playlist/create"
  ) {
    title = playlistTitle ?? "플레이리스트 상세";
  } else if (titleMap[location.pathname]) {
    title = titleMap[location.pathname];
  }

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("로그아웃 실패", error.message);
      return;
    }

    // 상태 초기화
    useUserStore.getState().clearUser();
    localStorage.removeItem("user-storage");

    // 로그인 페이지로 이동
    navigate("/login");
  };

  const deletePlaylist = async (playlistId: string) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;

    try {
      // 1. 댓글 삭제
      await axiosInstance.delete("/comment", {
        params: { playlist_id: `eq.${playlistId}` },
      });

      // 2. 액션 삭제
      await axiosInstance.delete("/action", {
        params: { playlist_id: `eq.${playlistId}` },
      });

      // 3. 비디오 삭제 (모두)
      await axiosInstance.delete("/video", {
        params: { playlist_id: `eq.${playlistId}` },
      });

      // 4. 플레이리스트 삭제
      await axiosInstance.delete("/playlist", {
        params: { id: `eq.${playlistId}` },
      });

      alert("플레이리스트 삭제 완료!");
      navigate("/");
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제에 실패했습니다. 나중에 다시 시도해주세요.");
    }
  };

  const myPageMenu = [
    { label: "정보수정", action: () => navigate("/user/edit") },
    { label: "로그아웃", action: handleLogout },
  ];

  const playlistMenu = [
    { label: "수정", action: () => navigate(`/playlist/edit/${playlistId}`) },
    { label: "삭제", action: () => playlistId && deletePlaylist(playlistId) }, // 삭제 버튼에 함수 연결
  ];

  // 현재 페이지에 따라 메뉴 결정
  const MENU_OPTIONS =
    location.pathname.startsWith("/mypage") && currentUser && userId === currentUser.id
      ? myPageMenu
      : location.pathname.startsWith("/playlist/") && isOwner
        ? playlistMenu
        : [];

  // 검색창 열기 및 포커스
  const handleSearchOpen = () => {
    setIsSearchOpen(true);
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 0);
  };

  return (
    <header className="fixed top-0 z-10 flex h-[60px] w-full max-w-[430px] items-center bg-background-main px-4">
      {/* 왼쪽 영역 */}
      <div className="absolute left-4 flex items-center">
        {location.pathname === "/" || location.pathname === "/subscriptions" ? (
          <>
            {!isSearchOpen && (
              <Link to={"/"}>
                <Logo className="h-[22px] w-[93px]" />
              </Link>
            )}
          </>
        ) : (
          <button onClick={() => navigate(-1)}>
            <ArrowLeft />
          </button>
        )}
      </div>

      {/* 가운데 영역 */}
      {location.pathname !== "/" && location.pathname !== "/subscriptions" && (
        <h1 className="line-clamp-1 w-full px-8 text-center text-title">{title}</h1>
      )}

      {/* 검색창 */}
      {isSearchOpen && (
        <SearchBar
          searchQuery={searchQuery}
          searchInputRef={searchInputRef}
          onSearchQueryChange={setSearchQuery}
          onSearch={onSearch || (() => {})}
          onClose={() => {
            setSearchQuery("");
            setIsSearchOpen(false);
            if (onSearch) {
              onSearch("");
            }
          }}
        />
      )}

      {/* 오른쪽 영역 */}
      <div className="absolute right-4 flex items-center">
        {location.pathname === "/" || location.pathname === "/subscriptions" ? (
          <>
            {!isSearchOpen && (
              <button onClick={handleSearchOpen}>
                <Search />
              </button>
            )}
          </>
        ) : (
          MENU_OPTIONS.length > 0 && <OverflowMenu options={MENU_OPTIONS} iconSize={24} />
        )}
      </div>
    </header>
  );
};

export default Header;
