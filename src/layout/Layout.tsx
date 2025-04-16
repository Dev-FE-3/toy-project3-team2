import { Outlet, useLocation } from "react-router-dom";

import Header from "./Header";
import NavBar from "./NavBar";
import useSearchStore from "@/store/useSearchStore";

const Layout = () => {
  const location = useLocation();
  const setSearchKeyword = useSearchStore((state) => state.setSearchKeyword);

  const hideAll = location.pathname === "/login";
  const hideNavOnly = ["/signup", "/user/edit", "/playlist/create"].includes(location.pathname);

  return (
    <div className="flex min-h-screen flex-col">
      {!hideAll && <Header onSearch={setSearchKeyword} />}
      <div
        className="scrollbar-hide overflow-y-auto pt-[60px]"
        style={{ height: "calc(100vh - 60px)" }}
      >
        <Outlet />
      </div>

      {!hideAll && !hideNavOnly && <NavBar />}
    </div>
  );
};

export default Layout;
