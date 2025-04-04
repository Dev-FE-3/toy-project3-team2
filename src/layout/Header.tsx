import { Link, useLocation, useNavigate } from "react-router-dom";

import ArrowLeft from "../assets/icons/arrow-left.svg";
import Logo from "../assets/icons/logo.svg";
import Search from "../assets/icons/search.svg";

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
  };

  let title = titleMap[location.pathname] || "페이지";

  if (location.pathname.startsWith("/playlist/") && location.pathname !== "/playlist/create") {
    title = "플레이리스트 상세";
  }

  // 홈일 경우 로고 + 검색 아이콘
  if (location.pathname === "/" || location.pathname === "/subscriptions") {
    return (
      <header className="absolute top-0 w-full max-w-[430px] flex items-center justify-between p-4">
        <Link to={"/"}>
          <img src={Logo} alt="logo" className="h-6" />
        </Link>

        <button>
          <img src={Search} alt="search" className="h-6" />
        </button>
      </header>
    );
  }

  return (
    <header className="absolute top-0 w-full max-w-[430px] flex items-center justify-center px-4 py-[10px]">
      <button onClick={() => navigate(-1)} className="absolute left-4">
        <img src={ArrowLeft} alt="back" />
      </button>
      <p className="w-full text-center text-title">{title}</p>
    </header>
  );
};

export default Header;
