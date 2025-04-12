// src/routes/index.tsx
import { Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import Subscriptions from "../pages/Subscriptions";
import PlaylistCreate from "../pages/PlaylistCreate";
import PlaylistDetail from "../pages/PlaylistDetail";
import MyPage from "../pages/MyPage";
import EditProfile from "../pages/EditProfile";
import Guide from "../pages/Guide";
import ErrorPage from "../pages/ErrorPage";

import Layout from "../layout/Layout";

const AppRoutes = () => {
  return (
    <Routes>
      {/* 헤더 & 네비게이션 X */}
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<ErrorPage />} />

      {/* Layout이 적용된 페이지들 */}
      <Route element={<Layout />}>
        <Route path="/signup" element={<Signup />} />
        <Route path="/user/edit" element={<EditProfile />} />
        <Route path="/playlist/create" element={<PlaylistCreate />} />
        <Route path="/" element={<Home />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/playlist/:id" element={<PlaylistDetail />} />
        <Route path="/guide" element={<Guide />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
