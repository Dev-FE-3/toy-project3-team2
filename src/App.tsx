import { useEffect } from "react";
import axiosInstance from "./services/axios/axiosInstance";
import { supabase } from "./services/supabase/supabaseClient";
import { useUserStore } from "./store/useUserStore";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Subscriptions from "./pages/Subscriptions";
import PlaylistCreate from "./pages/PlaylistCreate";
import PlaylistDetail from "./pages/PlaylistDetail";
import MyPage from "./pages/MyPage";
import EditProfile from "./pages/EditProfile";

import Layout from "./layout/Layout";
import Guide from "./pages/Guide";

const InitUser = () => {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const fetchAndSetUser = async () => {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData.user) return;

      const userId = authData.user.id;
      const { data: userRes } = await axiosInstance.get("/user", {
        params: {
          id: `eq.${userId}`,
          select: "*",
        },
      });

      setUser(userRes?.[0] || null);
    };

    fetchAndSetUser();
  }, []);

  return null;
};

function App() {
  return (
    <>
      <InitUser />
      <Router>
        <Routes>
          {/* 헤더 & 네비게이션 X */}
          <Route path="/login" element={<Login />} />

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
      </Router>
    </>
  );
}

export default App;
