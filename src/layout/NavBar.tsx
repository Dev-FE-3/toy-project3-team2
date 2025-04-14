import { Link, useLocation } from "react-router-dom";
import useUserStore from "../store/useUserStore";
import Home from "../assets/icons/home.svg";
import FillHome from "../assets/icons/fill-home.svg";
import BookMark from "../assets/icons/bookmark.svg";
import FillBookMark from "../assets/icons/fill-bookmark.svg";
import Add from "../assets/icons/add.svg";
import User from "../assets/icons/user.svg";
import FillUser from "../assets/icons/fill-user.svg";

const NavBar = () => {
  const location = useLocation(); // 현재 URL 가져오기
  const user = useUserStore((state) => state.user);

  const menuItems = [
    { path: "/", icon: [Home, FillHome], label: "홈" },
    { path: "/subscriptions", icon: [BookMark, FillBookMark], label: "구독" },
    { path: "/playlist/create", icon: [Add, ""], label: "생성" },
    { path: user?.id ? `/mypage/${user.id}` : "/mypage", icon: [User, FillUser], label: "MY" },
  ];

  return (
    <nav className="fixed bottom-0 flex h-[58px] w-full max-w-[430px] items-center justify-around rounded-t-[10px] bg-background-container">
      {menuItems.map(({ path, icon, label }) => {
        const isActive = location.pathname === path; // 현재 URL과 메뉴 path 비교

        return (
          <Link
            key={path}
            to={path}
            className={`flex h-full w-full flex-col items-center justify-center gap-1 ${
              isActive ? "text-tab-bold text-main" : "text-primary"
            }`}
          >
            <div className="flex w-[20px] items-center justify-center">
              {isActive ? <img src={icon[1]} alt={label} /> : <img src={icon[0]} alt={label} />}
            </div>

            <span className="text-tab">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default NavBar;
