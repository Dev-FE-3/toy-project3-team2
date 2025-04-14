import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useRef, useState, useEffect, RefObject } from "react";

import supabase from "@/services/supabase/supabaseClient";
import axiosInstance from "@/services/axios/axiosInstance";

import useUserStore from "@/store/useUserStore";

import ArrowLeft from "@/assets/icons/arrow-left.svg?react";
import Logo from "@/assets/imgs/logo.svg?react";
import Search from "@/assets/icons/search.svg?react";

import OverflowMenu from "@/components/common/OverflowMenu";
import SearchBar from "@/components/common/SearchBar";

type HeaderProps = {
  onSearch?: (query: string) => void;
};

const Header = ({ onSearch }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [playlistTitle, setPlaylistTitle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef: RefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);
  const hiddenPaths = ["/login"];
  const { id: playlistId } = useParams();

  const { state } = location;
  const isOwner = state?.isOwner;

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
        } finally {
          setIsLoading(false); // 로딩 끝
        }
      }
    };

    fetchPlaylistTitle();
  }, [playlistId]);

  // 로딩 중에는 아무것도 렌더링하지 않음
  if (isLoading) {
    return null; // 또는 로딩 스피너 등 다른 컴포넌트를 보여줄 수 있습니다.
  }

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

  if (location.pathname.startsWith("/mypage")) {
    title = "마이페이지";
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

  const myPageMenu = [
    { label: "정보수정", action: () => navigate("/user/edit") },
    { label: "로그아웃", action: handleLogout },
  ];

  const playlistMenu = [
    { label: "수정", action: () => navigate(`/playlist/edit/${playlistId}`) },
    {
      label: "삭제",
      action: () => {
        if (confirm("정말 삭제하시겠습니까?")) {
          alert("삭제 완료");
        }
      },
    },
  ];

  // 현재 페이지에 따라 메뉴 결정
  const MENU_OPTIONS = location.pathname.startsWith("/mypage")
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
