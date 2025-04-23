import { Outlet, useLocation } from "react-router-dom";

import Header from "./Header";
import NavBar from "./NavBar";
import { useEffect, useRef } from "react";

const Layout = () => {
  const location = useLocation();
  const contentRef = useRef<HTMLDivElement>(null); // 스크롤되는 div에 ref 연결

  const hideAll = location.pathname === "/login";
  const hideNavOnly = ["/signup", "/user/edit", "/playlist/create"].includes(location.pathname);

  useEffect(() => {
    // 페이지 이동 시 스크롤을 맨 위로 설정
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [location]); // location이 변경될 때마다 실행

  return (
    <div className="flex min-h-screen flex-col">
      {!hideAll && <Header />}
      <div
        ref={contentRef} // 스크롤 처리할 div
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
