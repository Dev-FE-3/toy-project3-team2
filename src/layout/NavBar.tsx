import { Link } from "react-router-dom";

import Home from "../assets/icons/home.svg";
import BookMark from "../assets/icons/bookmark.svg";
import Add from "../assets/icons/add.svg";
import User from "../assets/icons/user.svg";

const menuItems = [
  { path: "/", icon: Home, label: "홈" },
  { path: "/subscriptions", icon: BookMark, label: "구독" },
  { path: "/playlist/create", icon: Add, label: "생성" },
  { path: "/mypage", icon: User, label: "마이페이지" },
];

function NavBar() {
  return (
    <nav className="fixed bottom-0 flex w-full max-w-[430px] h-[58px] justify-around items-center bg-[#202525] rounded-t-[10px]">
      {menuItems.map(({ path, icon, label }) => (
        <Link key={path} to={path} className="flex flex-col items-center gap-1">
          <img src={icon} alt={label} />
          <p className="text-center text-white text-[10px]">{label}</p>
        </Link>
      ))}
    </nav>
  );
}

export default NavBar;
