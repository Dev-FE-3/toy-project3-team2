/** 플레이리스트 생성 페이지 */

import { useState } from "react";

import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import Toggle from "../components/playlistCreate/Toggle";
import VideoCard from "../components/playlistCreate/VideoCard";

import { Video } from "../types/video";

import { getYoutubeMeta } from "../utils/getYoutubeMeta";

type NewVideoForPlaylist = Pick<Video, "url" | "title" | "thumbnail">;

const PlaylistCreate = () => {
  const [isPublic, setIsPublic] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoList, setVideoList] = useState<NewVideoForPlaylist[]>([]);

  const handleAddVideo = async () => {
    const meta = await getYoutubeMeta(videoUrl);
    if (!meta) return;

    setVideoList([
      ...videoList,
      {
        url: videoUrl,
        title: meta.title,
        thumbnail: meta.thumbnailUrl,
      },
    ]);

    setVideoUrl(""); // 영상 링크 input 초기화
  };

  const handleDeleteVideo = (index: number) => {
    setVideoList((prev) => prev.filter((_, i) => i !== index));
  };

  // TODO: API 개발 및 연동
  const handleCreate = () => {
    alert("생성 완료!");
  };

  const isFormValid = title && description && videoList.length > 0;

  return (
    <main className="flex flex-col px-4 pb-[72px]">
      <section className="flex gap-[6px]">
        <div className="flex w-full justify-end py-4 text-sub">공개하기</div>
        <button onClick={() => setIsPublic((prev) => !prev)}>
          <Toggle isPublic={isPublic} />
        </button>
      </section>
      <form className="flex flex-col gap-5">
        <Input
          htmlFor="playlist-title"
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label="제목*"
        />
        <Input
          htmlFor="playlist-description"
          type="textarea"
          placeholder="소개글을 입력해주세요"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          label="소개*"
        />
        <div className="flex flex-col gap-2">
          <label htmlFor="video-url" className="text-body2-medium">
            영상 링크 추가*
          </label>
          <div className="flex gap-2">
            <Input
              id="video-url"
              type="url"
              placeholder="영상 링크를 입력해주세요"
              className="flex-grow"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              showDelete={!!videoUrl}
            />
            <Button type="button" variant="small" onClick={handleAddVideo} disabled={!videoUrl}>
              추가
            </Button>
          </div>
        </div>

        <ul className="grid grid-cols-2 gap-4">
          {videoList.map((video, idx) => (
            <VideoCard key={idx} index={idx} video={video} onDelete={handleDeleteVideo} />
          ))}
        </ul>

        {/** 버튼 */}
        <div className="fixed bottom-4 left-0 right-0 z-10 mx-auto w-full max-w-[430px] px-4">
          <Button variant="full" onClick={handleCreate} disabled={!isFormValid}>
            저장
          </Button>
        </div>
      </form>
    </main>
  );
};

export default PlaylistCreate;
