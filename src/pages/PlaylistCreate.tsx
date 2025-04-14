/** 플레이리스트 생성 페이지 */

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import { TextArea } from "@/components/common/TextArea";
import Toggle from "@/components/playlistCreate/Toggle";
import VideoCard from "@/components/playlistCreate/VideoCard";

import { NewVideoForPlaylist, Video } from "@/types/video";
import { getYoutubeMeta } from "@/utils/getYoutubeMeta";
import { areVideoListsEqual } from "@/utils/video";
import { usePlaylistDetail } from "@/hooks/usePlaylistDetail";
import useUserStore from "@/store/useUserStore";
import axiosInstance from "@/services/axios/axiosInstance";

interface NewPlaylistPayload {
  title: string;
  description: string;
  creator_id: string;
  thumbnail_image: string;
  is_public: boolean;
}

interface EditPlaylistPayload {
  title: string;
  description: string;
  updated_at: string;
  thumbnail_image: string;
  is_public: boolean;
}

const PlaylistCreate = () => {
  const [isPublic, setIsPublic] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoList, setVideoList] = useState<NewVideoForPlaylist[]>([]);

  const [initialPublic, setInitialPublic] = useState(isPublic);
  const [initialTitle, setInitialTitle] = useState(title);
  const [initialDescription, setInitialDescription] = useState(description);
  const [initialVideoList, setInitialVideoList] = useState<NewVideoForPlaylist[]>([]);

  const [isFormValid, setIsFormValid] = useState(false);

  const user = useUserStore((state) => state.user);

  const navigate = useNavigate();
  const { id } = useParams(); // 수정 모드일 경우 id 존재

  const playlist = usePlaylistDetail(id); // playlist id 값을 통해 playlist data 조회

  // 기존 playlist 정보 매핑
  useEffect(() => {
    const loadPlaylist = async () => {
      if (!id || !playlist.data) return;

      const playlistData = playlist.data;

      try {
        setTitle(playlistData.title);
        setDescription(playlistData.description);
        setIsPublic(playlistData.is_public);
        setVideoList(playlistData.videos);

        setInitialTitle(playlistData.title);
        setInitialDescription(playlistData.description);
        setInitialVideoList(playlistData.videos);
        setInitialPublic(playlistData.is_public);
      } catch (error) {
        console.error("플레이리스트 정보를 불러오지 못했습니다.", error);
      }
    };

    loadPlaylist();
  }, [id, playlist.data]);

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

  const handleDeleteVideo = async (index: number) => {
    if (videoList.length === 1) return alert("영상은 하나 이상 존재해야 합니다.");

    const videoToDelete = videoList[index];

    // UI에서 index 기준으로 삭제
    setVideoList((prev) => prev.filter((_, i) => i !== index));

    // 수정 모드일 때 DB에서 삭제
    if (id && videoToDelete.id) {
      try {
        await deleteVideoMutation.mutateAsync({
          video_id: String(videoToDelete.id),
        });
      } catch (error) {
        console.error("영상 삭제 실패:", error);
      }
    }
  };

  // 플레이리스트 생성 뮤테이션
  const createPlaylistMutation = useMutation({
    mutationFn: (payload: NewPlaylistPayload) => axiosInstance.post("/playlist", payload),
  });

  // 플레이리스트 수정 뮤테이션
  const editPlaylistMutation = useMutation({
    mutationFn: (payload: EditPlaylistPayload) =>
      axiosInstance.patch(`/playlist?id=eq.${id}`, payload),
  });

  // 영상 추가 뮤테이션
  const addVideosMutation = useMutation({
    mutationFn: (payload: Video[]) =>
      Promise.all(payload.map((payload) => axiosInstance.post("/video", payload))),
  });

  // 영상 삭제 뮤테이션
  const deleteVideoMutation = useMutation({
    mutationFn: ({ video_id }: { video_id: string }) =>
      axiosInstance.delete(`/video?playlist_id=eq.${id}&id=eq.${video_id}`),
  });

  // 플레이리스트 생성하는 함수
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
      const videoPayloads: Video[] = videoList.map((video) => ({
        playlist_id: newPlaylistId,
        ...video,
      }));

      await addVideosMutation.mutateAsync(videoPayloads);

      // 폼 초기화
      setTitle("");
      setDescription("");
      setVideoList([]);
      setIsPublic(false);

      navigate(`/playlist/${newPlaylistId}`, { state: { isOwner: true } });
    } catch (error) {
      console.error("생성 중 오류:", error);
    }
  };

  // 플레이리스트 수정하는 함수
  const handleEdit = async () => {
    if (!user || !id) return;

    const playlistPayload: EditPlaylistPayload = {
      title,
      description,
      updated_at: new Date().toISOString(),
      thumbnail_image: videoList[0]?.thumbnail,
      is_public: isPublic,
    };

    try {
      await editPlaylistMutation.mutateAsync(playlistPayload);

      // 영상이 변경된 경우
      if (!areVideoListsEqual(initialVideoList, videoList)) {
        const newVideos = videoList.filter((video) => !video.id);

        const videoPayloads: Video[] = newVideos.map((video) => ({
          playlist_id: id,
          ...video,
        }));

        if (videoPayloads.length > 0) {
          await addVideosMutation.mutateAsync(videoPayloads);
        }
      }

      setTitle("");
      setDescription("");
      setVideoList([]);
      setIsPublic(false);

      navigate(`/playlist/${id}`, { state: { isOwner: true } });
    } catch (error) {
      console.error("수정 중 오류:", error);
    }
  };

  const handleSubmit = async () => {
    if (!id) {
      handleCreate();
    } else handleEdit();
  };

  useEffect(() => {
    const hasChanges =
      isPublic !== initialPublic ||
      title !== initialTitle ||
      description !== initialDescription ||
      !areVideoListsEqual(initialVideoList, videoList);

    setIsFormValid(hasChanges);
  }, [
    title,
    description,
    videoList,
    initialTitle,
    initialDescription,
    initialVideoList,
    isPublic,
    initialPublic,
  ]);

  return (
    <main className="flex flex-col px-4 pb-[29px]">
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
            <VideoCard
              key={video.id ?? idx}
              index={idx}
              video={video}
              onDelete={handleDeleteVideo}
            />
          ))}
        </ul>

        <Button type="button" variant="full" onClick={handleSubmit} disabled={!isFormValid} fixed>
          {!id ? "생성" : "저장"}
        </Button>
      </form>
    </main>
  );
};

export default PlaylistCreate;
