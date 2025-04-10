import { Link, useLocation, useNavigate } from "react-router-dom";

import ArrowLeft from "../assets/icons/arrow-left.svg?react";
import Logo from "../assets/imgs/logo.svg?react";
import Search from "../assets/icons/search.svg?react";

import OverflowMenu from "../components/common/OverflowMenu";
import { useState } from "react";
import { Input } from "../components/common/Input";

type HeaderProps = {
  onSearch?: (query: string) => void;
};

const Header = ({ onSearch }: HeaderProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const hiddenPaths = ["/login"];

  if (hiddenPaths.includes(location.pathname)) {
    return null;
  }

  const titleMap: { [key: string]: string } = {
    "/signup": "회원가입",
    "/mypage": "마이페이지",
    "/user/edit": "정보 수정",
    "/playlist/create": "플레이리스트 생성",
    "/guide": "컴포넌트 가이드",
  };

  let title = titleMap[location.pathname] || "페이지";

  if (location.pathname.startsWith("/playlist/") && location.pathname !== "/playlist/create") {
    title = "플레이리스트 상세";
  }

  const MENU_OPTIONS = [
    { label: "정보수정", action: () => navigate("/user/edit") },
    { label: "로그아웃", action: () => alert("로그아웃 클릭") },
  ];

  return (
    <header className="fixed top-0 z-10 flex h-[60px] w-full max-w-[430px] items-center bg-background-main px-4">
      {/* 왼쪽 영역 */}
      <div className="absolute left-4 flex items-center">
        {location.pathname === "/" || location.pathname === "/subscriptions" ? (
          <Link to={"/"}>
            <Logo className="h-[22px] w-[93px]" />
          </Link>
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

      {/* 오른쪽 영역 */}
      <div className="absolute right-4 flex items-center">
        {location.pathname === "/" || location.pathname === "/subscriptions" ? (
          <button>
            <Search />
          </button>
        ) : (
          location.pathname === "/mypage" && <OverflowMenu options={MENU_OPTIONS} iconSize={24} />
        )}
      </div>
    </header>
  );
};

export default Header;
