import { useState, useEffect } from 'react';
import axiosInstance from './services/axios/axiosInstance';

interface PlaylistItem {
  id: number;
  title: string;
  info: string;
}

function App() {
  const [items, setItems] = useState<PlaylistItem[]>([]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await axiosInstance.get<PlaylistItem[]>('/playlist');

  //       console.log(response.data);

  //       setItems(response.data || []);
  //     } catch (error) {
  //       console.error("데이터 불러오기 실패:", error);
  //     }
  //   };

  //   fetchData();
  // }, []);
  
  return (
    <>
      <h1>플레이리스트</h1>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <h2>제목: {item.title}</h2>
            <p>소개글: {item.info}</p>
          </li>
        ))}
      </ul>
      <div className="min-h-screen flex flex-col items-center justify-center bg-background-main text-font-primary">
      <h1 className="text-4xl font-bold">Tailwind 색상 테스트</h1>
      <p className="text-font-second mt-2">이건 보조 텍스트 색상</p>
      <p className="text-font-muted mt-2">이건 muted 텍스트 색상</p>
      <p className="text-font-placeholder mt-2">이건 placeholder 텍스트 색상</p>

      <a href="#" className="text-font-primary hover:text-font-more mt-4 underline">
        이것은 링크입니다.
      </a>

      <div className="w-60 h-40 bg-background-input mt-6 flex items-center justify-center">
        <p className="text-font-primary">Input 배경</p>
      </div>

      <button className="mt-6 px-4 py-2 bg-main text-white rounded-lg hover:bg-opacity-80">
        메인 버튼
      </button>

      <div className="w-60 h-40 bg-overlay-primary mt-6 flex items-center justify-center">
        <p className="text-white">Overlay 배경</p>
      </div>
    </div>
    </>
  )
}

export default App
