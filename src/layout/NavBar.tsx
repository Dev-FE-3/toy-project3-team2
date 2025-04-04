import { Link, useLocation } from "react-router-dom";

import Home from "../assets/icons/home.svg";
import FillHome from "../assets/icons/fill-home.svg";
import BookMark from "../assets/icons/bookmark.svg";
import FillBookMark from "../assets/icons/fill-bookmark.svg";
import Add from "../assets/icons/add.svg";
import User from "../assets/icons/user.svg";
import FillUser from "../assets/icons/fill-user.svg";

const menuItems = [
  { path: "/", icon: [Home, FillHome], label: "홈" },
  { path: "/subscriptions", icon: [BookMark, FillBookMark], label: "구독" },
  { path: "/playlist/create", icon: [Add, ""], label: "생성" },
  { path: "/mypage", icon: [User, FillUser], label: "마이페이지" },
];

const NavBar = () => {
  const location = useLocation(); // 현재 URL 가져오기

  return (
    <nav className="fixed bottom-0 flex w-full max-w-[430px] h-[58px] justify-around items-center bg-background-container rounded-t-[10px]">
      {menuItems.map(({ path, icon, label }) => {
        const isActive = location.pathname === path; // 현재 URL과 메뉴 path 비교

        return (
          <Link
            key={path}
            to={path}
            className={`flex flex-col items-center justify-center gap-1 w-full h-full ${
              isActive ? "text-main text-tab-bold" : "text-primary"
            }`}
          >
            <div className="w-[20px] flex justify-center items-center">
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
