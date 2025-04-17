/** 플레이리스트 생성 페이지 */

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { TextArea } from "@/components/common/TextArea";
import Toggle from "@/components/playlistCreate/Toggle";
import VideoCard from "@/components/playlistCreate/VideoCard";
import { usePlaylistDetail } from "@/hooks/usePlaylistDetail";
import useUserStore from "@/store/useUserStore";
import { NewVideoForPlaylist, Video } from "@/types/video";
import { getYoutubeMeta } from "@/utils/getYoutubeMeta";
import { areVideoListsEqual } from "@/utils/video";
import { showToast } from "@/utils/toast";
import {
  useAddVideosMutation,
  useCreatePlaylistMutation,
  useDeleteVideoMutation,
  useEditPlaylistMutation,
} from "@/hooks/queries/usePlaylistMutation";
import { EditPlaylistPayload, NewPlaylistPayload } from "@/types/playlist";

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

  const [deletedVideoIds, setDeletedVideoIds] = useState<string[]>([]);

  const [isFormValid, setIsFormValid] = useState(false);

  const user = useUserStore((state) => state.user);

  const navigate = useNavigate();
  const { id } = useParams(); // 수정 모드일 경우 playlist id 존재

  const playlist = usePlaylistDetail(id); // playlist id 값을 통해 playlist data 조회

  // 훅 호출
  const createPlaylistMutation = useCreatePlaylistMutation();
  const editPlaylistMutation = useEditPlaylistMutation();
  const addVideosMutation = useAddVideosMutation();
  const deleteVideoMutation = useDeleteVideoMutation();

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
    if (videoList.length === 1)
      return showToast("info", "플레이리스트에는 최소 한 개 이상의 영상이 필요합니다.");

    setVideoList((prev) => prev.filter((_, i) => i !== index));

    const videoToDelete = videoList[index];

    // 수정 모드이고 id가 있는 경우, 삭제 예정 목록에 추가
    if (id && typeof videoToDelete.id === "string") {
      setDeletedVideoIds((prev) => [...prev, videoToDelete.id as string]);
    }
  };

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

      navigate(`/playlist/${newPlaylistId}`);

      showToast("success", "플레이리스트가 생성되었습니다");
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
      await editPlaylistMutation.mutateAsync({
        playlist_id: id,
        payload: playlistPayload,
      });

      // 영상이 변경된 경우
      if (!areVideoListsEqual(initialVideoList, videoList)) {
        // 기존꺼 삭제
        if (deletedVideoIds.length > 0) {
          await Promise.all(
            deletedVideoIds.map((video_id) => {
              return deleteVideoMutation.mutateAsync({
                video_id,
                playlist_id: id,
              });
            }),
          );
        }

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

      navigate(`/playlist/${id}`);
      showToast("success", "플레이리스트가 수정되었습니다");
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

    const isEmpty = title.length === 0 || description.length === 0 || videoList.length === 0;

    setIsFormValid(hasChanges && !isEmpty);
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
          maxLength={50}
          data-testid="title-input"
        />
        <TextArea
          htmlFor="playlist-description"
          placeholder="소개글을 입력해주세요"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          label="소개*"
          maxLength={500}
          data-testid="description-input"
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
              data-testid="video-input"
            />
            <Button
              type="button"
              variant="small"
              onClick={handleAddVideo}
              disabled={!videoUrl}
              data-testid="add-video-button"
            >
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

        <Button
          type="button"
          variant="full"
          onClick={handleSubmit}
          disabled={!isFormValid}
          fixed
          data-testid="submit-button"
        >
          {!id ? "생성" : "저장"}
        </Button>
      </form>
    </main>
  );
};

export default PlaylistCreate;
