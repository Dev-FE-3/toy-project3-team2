import { Link, useLocation, useNavigate } from "react-router-dom";

import ArrowLeft from "../assets/icons/arrow-left.svg";
import Logo from "../assets/imgs/logo.svg";
import Search from "../assets/icons/search.svg";
import OverflowMenu from "../components/common/OverflowMenu";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

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

  // 홈일 경우 로고 + 검색 아이콘
  if (location.pathname === "/" || location.pathname === "/subscriptions") {
    return (
      <header className="absolute top-0 flex h-[60px] w-full max-w-[430px] items-center justify-between px-4">
        <Link to={"/"}>
          <img src={Logo} alt="logo" className="h-6" />
        </Link>

        <button>
          <img src={Search} alt="search" className="h-6" />
        </button>
      </header>
    );
  }

  const MENU_OPTIONS = [
    { label: "정보수정", action: () => navigate("/user/edit") },
    { label: "로그아웃", action: () => alert("로그아웃 클릭") },
  ];

  return (
    <header className="fixed top-0 z-10 flex h-[60px] w-full max-w-[430px] items-center justify-center bg-background-main px-4">
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
