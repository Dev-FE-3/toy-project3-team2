/** 사용자 정보를 수정하는 페이지 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserInfoQuery } from "@/hooks/queries/useUserInfoQuery";
import supabase from "@/services/supabase/supabaseClient";
import uploadProfileImage from "@/services/supabase/uploadProfileImage";
import useUserStore from "@/store/useUserStore";
import axiosInstance from "@/services/axios/axiosInstance";

import { useNicknameCheckMutation } from "@/hooks/queries/nicknameCheckMutation";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { TextArea } from "@/components/common/TextArea";
import { showToast } from "@/utils/toast";
import { validateNickname, validatePassword } from "@/utils/validation";

import errorIcon from "@/assets/icons/error.svg";
import successIcon from "@/assets/icons/success.svg";
import Camera from "@/assets/icons/camera.svg?react";

const EditProfile = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { data: userInfo } = useUserInfoQuery(user?.id);

  // 상태 관리
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [description, setDescription] = useState("");
  const [isNicknameValid, setIsNicknameValid] = useState<"unchecked" | "valid" | "invalid">(
    "unchecked",
  );
  const [isPasswordValid, setIsPasswordValid] = useState<boolean | null>(null);
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean | null>(null);
  const [isNicknameCheckSubmitted, setIsNicknameCheckSubmitted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 초기값 세팅
  useEffect(() => {
    if (userInfo) {
      setNickname(userInfo.nickname || "");
      setDescription(userInfo.description || "");
      setPreviewImage(userInfo.profile_image || null);
    }
  }, [userInfo]);

  // 닉네임 중복 검사
  const nicknameCheckMutation = useNicknameCheckMutation({
    userId: user?.id,
    onSuccess: (isValid) => {
      setIsNicknameValid(isValid ? "valid" : "invalid");
    },
    onError: (error) => {
      console.error("중복 확인 문제:", error);
    },
  });

  const handleNicknameCheck = () => {
    setIsNicknameCheckSubmitted(true);
    const isChanged = nickname !== user?.nickname;

    if (nickname && isChanged && validateNickname(nickname)) {
      nicknameCheckMutation.mutate(nickname);
    } else {
      setIsNicknameValid("invalid");
    }
  };

  // 프로필 이미지 변경
  const onProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // 프로필 저장
  const updateProfileMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("유저 정보 없음");

      let imageUrl = previewImage;

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
        { profile_image: imageUrl, nickname, description },
        { params: { id: `eq.${user.id}` }, headers: { Prefer: "return=representation" } },
      );
      return data[0];
    },
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      queryClient.invalidateQueries();
      showToast("success", "정보 변경이 완료되었습니다");

      navigate(`/mypage/${updatedUser.id}`);
    },
    onError: (error) => {
      console.error("업데이트 실패:", error);
    },
  });

  // 저장 버튼 활성화 조건
  const isFormValid = () => {
    const isImageChanged = selectedImage !== null;
    const isNicknameChanged = nickname !== userInfo?.nickname;
    const isDescriptionChanged = description !== userInfo?.description;
    const isPasswordEntered = password !== "";

    // 아무것도 변경하지 않은 경우
    const nothingChanged =
      !isImageChanged && !isNicknameChanged && !isPasswordEntered && !isDescriptionChanged;
    if (nothingChanged) return false;

    // 닉네임을 변경한 경우
    if (isNicknameChanged) {
      if (!isNicknameCheckSubmitted || isNicknameValid !== "valid") return false;
    }

    // 위 조건 통과했으면 버튼 활성화
    return true;
  };

  // 폼 제출
  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    const isPasswordEntered = password !== "";

    // 비밀번호 유효성 검사
    if (isPasswordEntered) {
      const isValid = validatePassword(password);
      const isMatch = password === passwordCheck;

      setIsPasswordValid(isValid);
      setIsPasswordMatch(isMatch);

      if (!isValid || !isMatch) return;
    }

    if (!isFormValid()) return;

    updateProfileMutation.mutate();
  };

  return (
    <form className="px-[16px]" onSubmit={onSubmit}>
      {/* 프로필 이미지 */}
      <div className="mb-[20px] mt-[50px] text-center">
        <div className="relative inline-block">
          <label htmlFor="profile" className="cursor-pointer">
            {previewImage && (
              <img
                className="mx-auto h-[80px] w-[80px] rounded-full object-cover brightness-[0.6]"
                src={previewImage}
                alt="User Profile"
              />
            )}
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
              maxLength={15}
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <Button
              variant="small"
              type="button"
              disabled={!nickname || nickname === userInfo?.nickname}
              onClick={handleNicknameCheck}
            >
              중복확인
            </Button>
          </div>
          {isNicknameCheckSubmitted && isNicknameValid === "invalid" && (
            <p className="mt-2 text-sub text-red-500">
              <img src={errorIcon} alt="error" className="mr-1 inline-block h-4 w-4" />
              {validateNickname(nickname)
                ? "사용 중인 닉네임입니다."
                : "2~15자의 한글, 영문, 숫자만 사용 가능합니다."}
            </p>
          )}
          {isNicknameCheckSubmitted && isNicknameValid === "valid" && (
            <p className="mt-2 text-sub text-green-500">
              <img src={successIcon} alt="success" className="mr-1 inline-block h-4 w-4" />
              사용 가능한 닉네임입니다.
            </p>
          )}
        </li>
        <li>
          <Input
            htmlFor="user-password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            label="비밀번호"
            maxLength={32}
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
            maxLength={32}
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
          />
          {isSubmitted && password && !isPasswordValid && (
            <p className="mt-2 text-sub text-red-500">
              <img src={errorIcon} alt="error" className="mr-1 inline-block h-4 w-4" />
              비밀번호는 8~32자이며, 영문, 숫자, 특수문자 중 최소 2개 이상을 포함해야 합니다.
            </p>
          )}
          {isSubmitted && password && passwordCheck && !isPasswordMatch && (
            <p className="mt-2 text-sub text-red-500">
              <img src={errorIcon} alt="error" className="mr-1 inline-block h-4 w-4" />
              비밀번호와 비밀번호 확인이 일치하지 않습니다.
            </p>
          )}
        </li>
        <li>
          <TextArea
            htmlFor="user-description"
            placeholder="소개글을 입력하세요"
            label="소개"
            maxLength={300}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </li>
      </ul>

      <Button type="submit" variant="full" fixed disabled={!isFormValid()}>
        저장
      </Button>
    </form>
  );
};

export default EditProfile;
