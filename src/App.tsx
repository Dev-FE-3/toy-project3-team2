// import { useState, useEffect } from "react";
// import axiosInstance from "./services/axios/axiosInstance";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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

// interface PlaylistItem {
//   id: number;
//   title: string;
//   info: string;
// }

// QueryClient 인스턴스 생성
const queryClient = new QueryClient();

function App() {
  // const [items, setItems] = useState<PlaylistItem[]>([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axiosInstance.get<PlaylistItem[]>("/playlist");

  //       console.log(response.data);
  //       console.log(response.data);

  //       setItems(response.data || []);
  //     } catch (error) {
  //       console.error("데이터 불러오기 실패:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  return (
    <QueryClientProvider client={queryClient}>
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
        {/* <h1>플레이리스트</h1>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <h2>제목: {item.title}</h2>
              <p>소개글: {item.info}</p>
            </li>
          ))}
        </ul> */}
      </Router>
    </QueryClientProvider>
  );
}

export default App;
