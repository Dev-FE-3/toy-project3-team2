/** 사용자 정보를 수정하는 페이지 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./../services/axios/axiosInstance";
import supabase from "../services/supabase/supabaseClient";
import uploadProfileImage from "../services/supabase/uploadProfileImage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useUserStore from "../store/useUserStore";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import ProfileImageDefault from "../assets/imgs/profile-image-default.svg";
import Camera from "../assets/icons/camera.svg?react";
import { TextArea } from "../components/common/TextArea";

const EditProfile = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isNicknameAvailable, setIsNicknameAvailable] = useState<boolean | null>(null);

  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [description, setDescription] = useState("");

  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [originalNickname, setOriginalNickname] = useState("");
  const [originalDescription, setOriginalDescription] = useState("");

  // 초기값 세팅
  useEffect(() => {
    if (!user) return;

    setNickname(user.nickname || "");
    setOriginalNickname(user.nickname || "");

    setDescription(user.description || "");
    setOriginalDescription(user.description || "");

    setPreviewImage(user.profile_image || null);
    setOriginalImage(user.profile_image || null);
  }, [user]);

  const nicknameCheckMutation = useMutation({
    mutationFn: async (nickname: string) => {
      const { data } = await axiosInstance.get("/user", {
        params: { nickname: `eq.${nickname}` },
      });
      return data;
    },
    onSuccess: (data) => {
      const isDuplicate = data.length > 0 && data[0].id !== user?.id;
      if (isDuplicate) {
        alert("이미 사용 중인 닉네임입니다.");
        setIsNicknameAvailable(false);
      } else {
        alert("사용 가능한 닉네임입니다.");
        setIsNicknameAvailable(true);
      }
    },
    onError: () => {
      alert("중복 확인 중 문제가 발생했어요.");
    },
  });

  const handleCheck = () => {
    if (!nickname || nickname === originalNickname) return;

    nicknameCheckMutation.mutate(nickname);
  };

  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("유저 정보 없음");

      let imageUrl = user.profile_image;

      if (selectedImage) {
        imageUrl = await uploadProfileImage(selectedImage, user.id);
        setPreviewImage(imageUrl);
      }

      if (password) {
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw new Error("비밀번호 변경 실패");
      }

      const { data } = await axiosInstance.patch(
        "/user",
        {
          profile_image: imageUrl,
          nickname,
          description,
        },
        {
          params: { id: `eq.${user.id}` },
          headers: { Prefer: "return=representation" },
        },
      );

      return data[0];
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries();
      alert("저장 완료되었습니다.");
      navigate(`/mypage/${updatedUser.id}`);
    },
    onError: (error) => {
      console.error("업데이트 실패:", error);
      alert("업데이트 중 문제가 발생했어요.");
    },
  });

  const validateForm = () => {
    if (nickname !== originalNickname) {
      if (isNicknameAvailable === null) {
        alert("닉네임 중복확인을 해주세요.");
        return;
      }

      if (isNicknameAvailable === false) {
        alert("이미 사용 중인 닉네임입니다.");
        return;
      }
    }

    if (password !== passwordCheck) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    return true;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    if (!validateForm()) return;

    updateProfileMutation.mutate();
  };

  const onProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const isChanged =
    nickname !== originalNickname ||
    description !== originalDescription ||
    password !== "" ||
    selectedImage !== null;

  return (
    <form className="px-[16px]" onSubmit={onSubmit}>
      {/* 프로필 이미지 */}
      <div className="mb-[20px] mt-[50px] text-center">
        <div className="relative inline-block">
          <label htmlFor="profile" className="cursor-pointer">
            <img
              className="mx-auto h-[80px] w-[80px] rounded-full object-cover brightness-[0.6]"
              src={previewImage || ProfileImageDefault}
              alt="User Profile"
            />
            <Camera className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
          </label>
          <input
            id="profile"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onProfileChange}
          />
        </div>
        <span className="mt-[8px] block">{user?.email}</span>
      </div>

      {/* Input Fields */}
      <ul className="flex flex-col gap-[20px]">
        <li>
          <label htmlFor="user-nickname" className="mb-2 block text-body2">
            닉네임
          </label>
          <div className="flex gap-[8px]">
            <Input
              id="user-nickname"
              className="flex-grow"
              type="text"
              placeholder="닉네임을 입력하세요"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setIsNicknameAvailable(null);
              }}
            />
            <Button
              variant="small"
              type="button"
              disabled={!nickname || nickname === originalNickname}
              onClick={handleCheck}
            >
              중복확인
            </Button>
          </div>
        </li>
        <li>
          <Input
            htmlFor="user-password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            label="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </li>
        <li>
          <Input
            htmlFor="user-passwordCheck"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            label="비밀번호 확인"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
        </li>
        <li>
          <TextArea
            htmlFor="user-description"
            placeholder="소개글을 입력하세요"
            label="소개"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </li>
      </ul>

      <Button variant="full" type="submit" disabled={!isChanged} fixed>
        저장
      </Button>
    </form>
  );
};

export default EditProfile;
