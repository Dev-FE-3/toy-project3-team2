/** 플레이리스트 생성 페이지 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";

import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import { TextArea } from "../components/common/TextArea";
import Toggle from "../components/playlistCreate/Toggle";
import VideoCard from "../components/playlistCreate/VideoCard";

import { Video } from "../types/video";
import { getYoutubeMeta } from "../utils/getYoutubeMeta";
import axiosInstance from "../services/axios/axiosInstance";
import { useUserStore } from "../store/useUserStore";

type NewVideoForPlaylist = Pick<Video, "url" | "title" | "thumbnail">;

interface NewVideoPayload extends NewVideoForPlaylist {
  playlist_id: string;
}

interface NewPlaylistPayload {
  title: string;
  description: string;
  creator_id: string;
  thumbnail_image: string;
  is_public: boolean;
}

const PlaylistCreate = () => {
  const [isPublic, setIsPublic] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoList, setVideoList] = useState<NewVideoForPlaylist[]>([]);

  const user = useUserStore((state) => state.user);

  const navigate = useNavigate();

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

  // 플레이리스트 생성 뮤테이션
  const createPlaylistMutation = useMutation({
    mutationFn: (payload: NewPlaylistPayload) => axiosInstance.post("/playlist", payload),
  });

  // 영상 추가 뮤테이션
  const addVideosMutation = useMutation({
    mutationFn: (payload: NewVideoPayload[]) =>
      Promise.all(payload.map((payload) => axiosInstance.post("/video", payload))),
  });

  const handleCreate = async () => {
    if (!user) return;

    const playlistPayload: NewPlaylistPayload = {
      title,
      description,
      creator_id: user.id,
      thumbnail_image: videoList[0].thumbnail,
      is_public: isPublic,
    };

    try {
      // 플레이리스트 생성
      const { data } = await createPlaylistMutation.mutateAsync(playlistPayload);
      const newPlaylistId = data[0].id; // 생성된 playlist id를 반환 받음

      // 영상 추가
      const videoPayloads: NewVideoPayload[] = videoList.map((video) => ({
        playlist_id: newPlaylistId,
        ...video,
      }));

      await addVideosMutation.mutateAsync(videoPayloads);

      // 폼 초기화
      setTitle("");
      setDescription("");
      setVideoList([]);
      setIsPublic(false);

      navigate("/mypage");
    } catch (error) {
      console.error("생성 중 오류:", error);
    }
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
        <TextArea
          htmlFor="playlist-description"
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

        <Button type="button" variant="full" onClick={handleCreate} disabled={!isFormValid} fixed>
          저장
        </Button>
      </form>
    </main>
  );
};

export default PlaylistCreate;
