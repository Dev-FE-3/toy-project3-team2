/** 사용자 정보를 수정하는 페이지 */

import { useState, useEffect } from "react";
import { useUserInfoQuery } from "@/hooks/queries/useUserInfoQuery";
import useUserStore from "@/store/useUserStore";
import { useNicknameCheckMutation } from "@/hooks/queries/useNicknameCheckMutation";
import { useUpdateProfileMutation } from "@/hooks/queries/useUpdateProfileMutation";

import ProfileImage from "@/components/editProfile/ProfileImage";
import NicknameField from "@/components/editProfile/NicknameField";
import PasswordField from "@/components/editProfile/PasswordField";
import DescriptionField from "@/components/editProfile/DescriptionField";
import { Button } from "@/components/common/Button";
import { validateNickname, validatePassword } from "@/utils/validation";

const EditProfile = () => {
  const user = useUserStore((state) => state.user);
  const { data: userInfo } = useUserInfoQuery(user?.id);
  const updateProfileMutation = useUpdateProfileMutation();

  // 상태 관리
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [description, setDescription] = useState("");
  const [isNicknameValid, setIsNicknameValid] = useState<"idle" | "valid" | "invalid">("idle");
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
    const isPasswordValid = validatePassword(password);
    const isPasswordMatch = password === passwordCheck;

    // 비밀번호 유효성 검사
    if (isPasswordEntered && (!isPasswordValid || !isPasswordMatch)) return;

    if (!isFormValid()) return;

    if (!user?.id) return;

    updateProfileMutation.mutate({
      userId: user.id,
      profileImage: selectedImage,
      previewImage,
      password,
      nickname,
      description,
    });
  };

  return (
    <form className="px-[16px]" onSubmit={onSubmit}>
      {/* 프로필 이미지 */}
      <ProfileImage
        previewImage={previewImage}
        onProfileChange={onProfileChange}
        email={user?.email}
      />

      {/* Input Fields */}
      <ul className="flex flex-col gap-[20px]">
        <NicknameField
          nickname={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onCheck={handleNicknameCheck}
          isSubmitted={isNicknameCheckSubmitted}
          isValid={isNicknameValid}
          originalNickname={userInfo?.nickname || ""}
        />
        <PasswordField
          password={password}
          passwordCheck={passwordCheck}
          onPasswordChange={(e) => setPassword(e.target.value)}
          onPasswordCheckChange={(e) => setPasswordCheck(e.target.value)}
          isSubmitted={isSubmitted}
        />
        <DescriptionField
          description={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </ul>

      <Button type="submit" variant="full" fixed disabled={!isFormValid()}>
        저장
      </Button>
    </form>
  );
};

export default EditProfile;
