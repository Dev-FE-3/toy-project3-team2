import { Outlet, useLocation } from "react-router-dom";

import NavBar from "./NavBar";
import Header from "./Header";

const Layout = () => {
  const location = useLocation();

  const hideAll = location.pathname === "/login";
  const hideNavOnly = ["/signup", "/user/edit", "/playlist/create"].includes(location.pathname);

  // h-screen을 사용하면 콘텐츠가 길어질 때 배경이 흰색으로 깨지는 이슈 발생
  // min-h-screen으로 수정하여 콘텐츠 길이에 따라 유동적으로 높이 조절되도록 함
  // 네브바는 fixed이므로, 아래 콘텐츠가 가려지지 않도록 pb-[58px] 추가

  return (
    <div className="flex min-h-screen flex-col">
      {!hideAll && <Header />}
      <div className="pt-[56px]">
        <Outlet />
      </div>

      {!hideAll && !hideNavOnly && <NavBar />}
    </div>
  );
};

export default Layout;
