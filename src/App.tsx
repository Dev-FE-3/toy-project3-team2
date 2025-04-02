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
    </>
  )
}

export default App
