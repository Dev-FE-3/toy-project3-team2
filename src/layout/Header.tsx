import { Link, useLocation, useNavigate } from "react-router-dom";
import supabase from "../services/supabase/supabaseClient";
import useUserStore from "../store/useUserStore";
import { useRef, useState, useEffect, RefObject } from "react";
import ArrowLeft from "../assets/icons/arrow-left.svg?react";
import Logo from "../assets/imgs/logo.svg?react";
import Search from "../assets/icons/search.svg?react";
import OverflowMenu from "../components/common/OverflowMenu";
import SearchBar from "../components/common/SearchBar";

type HeaderProps = {
  onSearch?: (query: string) => void;
};

const Header = ({ onSearch }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef: RefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);
  const hiddenPaths = ["/login"];

  // 페이지 이동 시 검색 상태 초기화
  useEffect(() => {
    setSearchQuery("");
    setIsSearchOpen(false);
    if (onSearch) {
      onSearch("");
    }
  }, [location.pathname]);

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
    title = "플레이리스트 상세";
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

  const MENU_OPTIONS = [
    { label: "정보수정", action: () => navigate("/user/edit") },
    { label: "로그아웃", action: handleLogout },
  ];

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
        <h1 className="w-full text-center text-title">{title}</h1>
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
          location.pathname.startsWith("/mypage") && (
            <OverflowMenu options={MENU_OPTIONS} iconSize={24} />
          )
        )}
      </div>
    </header>
  );
};

export default Header;
