// src/routes/index.tsx
import { Routes, Route } from "react-router-dom";

import Layout from "@/layout/Layout";
import EditProfile from "@/pages/EditProfile";
import ErrorPage from "@/pages/ErrorPage";
import Guide from "@/pages/Guide";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import MyPage from "@/pages/MyPage";
import PlaylistCreate from "@/pages/PlaylistCreate";
import Signup from "@/pages/Signup";

import Subscriptions from "@/pages/Subscriptions";
import { ProtectedRoute } from "./ProtectedRoute";

import PlaylistDetail from "@/pages/PlaylistDetail";

const AppRoutes = () => {
  return (
    <Routes>
      {/* 헤더 & 네비게이션 X */}
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<ErrorPage />} />

      {/* Layout이 적용된 페이지들 */}
      <Route element={<Layout />}>
        <Route path="/signup" element={<Signup />} />
        <Route path="/guide" element={<Guide />} />
        {/* 로그인 필요한 페이지들 */}
        <Route element={<ProtectedRoute />}>
        <Route path="/user/edit" element={<EditProfile />} />
        <Route path="/playlist/create" element={<PlaylistCreate />} />
        <Route path="/playlist/:id" element={<PlaylistDetail />} />
        <Route path="/playlist/edit/:id" element={<PlaylistCreate />} />
        <Route path="/" element={<Home />} />
        <Route path="/mypage/:userId" element={<MyPage />} />
        <Route path="/subscriptions" element={<Subscriptions />} />
        <Route path="/playlist/:id" element={<PlaylistDetail />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
