/** 플레이리스트 생성 페이지 */

import { useState } from "react";

import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import Toggle from "../components/Toggle";

const PlaylistCreate = () => {
  const [isPublic, setIsPublic] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoList, setVideoList] = useState<string[]>([]);

  const handleAddVideo = () => {
    setVideoList([...videoList, videoUrl]);
    setVideoUrl("");
  };

  // 추후 개발
  const handleCreate = () => {
    alert("생성 완료!");
  };

  const isFormValid = title && description && videoList.length > 0;

  return (
    <main className="relative h-full px-4 pb-24">
      <section className="flex gap-[6px]">
        <div className="flex w-full justify-end py-4 text-sub">공개하기</div>
        <button onClick={() => setIsPublic((prev) => !prev)}>
          <Toggle isPublic={isPublic} />
        </button>
      </section>

      <form className="flex flex-col gap-5">
        <Input
          id="playlist-title"
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          label="제목*"
        />
        <Input
          id="playlist-description"
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
            <Button variant="small" onClick={handleAddVideo} disabled={!videoUrl}>
              추가
            </Button>
          </div>
        </div>
        {/** 임시 UI */}
        <section>
          <ul>
            {videoList.map((url, idx) => (
              <li key={idx}>{url}</li>
            ))}
          </ul>
        </section>
        <footer className="absolute bottom-4 left-0 w-full px-4">
          <Button variant="full" onClick={handleCreate} disabled={!isFormValid}>
            저장
          </Button>
        </footer>
      </form>
    </main>
  );
};

export default PlaylistCreate;
