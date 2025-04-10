import { Link, useLocation, useNavigate } from "react-router-dom";

import ArrowLeft from "../assets/icons/arrow-left.svg";
import Logo from "../assets/imgs/logo.svg";
import Search from "../assets/icons/search.svg";
import cross from "../assets/icons/cross.svg";
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

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  // 홈일 경우 로고 + 검색 아이콘
  if (location.pathname === "/" || location.pathname === "/subscriptions") {
    return (
      <header className="absolute top-0 flex w-full max-w-[430px] items-center justify-between p-4">
        {!isSearchOpen && (
          <Link to={"/"} className="py-[7px]">
            <img src={Logo} alt="logo" className="h-6" />
          </Link>
        )}

        {!isSearchOpen ? (
          <button onClick={() => setIsSearchOpen(true)}>
            <img src={Search} alt="search" className="h-6" />
          </button>
        ) : (
          <div className="flex w-full items-center gap-3">
            <Input
              type="round"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              placeholder="검색어를 입력해주세요"
              className="flex-1"
            />
            <button onClick={() => setIsSearchOpen(false)}>
              <img src={cross} alt="close" className="h-6" />
            </button>
          </div>
        )}
      </header>
    );
  }

  const MENU_OPTIONS = [
    { label: "정보수정", action: () => navigate("/user/edit") },
    { label: "로그아웃", action: () => alert("로그아웃 클릭") },
  ];

  return (
    <header className="absolute top-0 flex w-full max-w-[430px] items-center justify-center px-4 py-[10px]">
      <button onClick={() => navigate(-1)} className="absolute left-4">
        <img src={ArrowLeft} alt="back" />
      </button>
      <h1 className="w-full text-center text-title">{title}</h1>

      {location.pathname === "/mypage" && (
        <div className="absolute right-4">
          <OverflowMenu options={MENU_OPTIONS} iconSize={24} />
        </div>
      )}
    </header>
  );
};

export default Header;
