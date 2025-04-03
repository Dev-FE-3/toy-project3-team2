import { Outlet, useLocation } from "react-router-dom";

import NavBar from "./NavBar";
import Header from "./Header";

const Layout = () => {
  const location = useLocation();

  const hideAll = location.pathname === "/login";
  const hideNavOnly = ["/signup", "/user/edit", "/playlist/create"].includes(location.pathname);

  return (
    <div className="flex flex-col h-screen">
      {!hideAll && <Header />}
      <div className="flex-1 pt-[44px]">
        <Outlet />
      </div>

      {!hideAll && !hideNavOnly && <NavBar />}
    </div>
  );
};

export default Layout;
