/** 사용자 정보를 수정하는 페이지 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./../services/axios/axiosInstance";
import supabase from "../services/supabase/supabaseClient";
import uploadProfileImage from "../services/supabase/uploadProfileImage";
import useUserStore from "../store/useUserStore";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import ProfileImageDefault from "../assets/imgs/profile-image-default.svg";
import Camera from "../assets/icons/camera.svg?react";

const EditProfile = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [nickNameValue, setNickNameValue] = useState("");
  const [isNickNameValueAvailable, setIsNickNameValueAvailable] = useState<boolean | null>(null);
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordCheckValue, setPasswordCheckValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");

  const navigate = useNavigate();

  // 초기값 설정
  useEffect(() => {
    if (!user) return;

    setNickNameValue(user.nickname || "");
    setDescriptionValue(user.description || "");
  }, [user]);

  useEffect(() => {
    if (user?.profile_image && !previewImage) {
      setPreviewImage(user.profile_image);
    }
  }, [user?.profile_image, previewImage]);

  // 저장
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id) return;

    // 닉네임 중복 확인
    if (isNickNameValueAvailable === false) {
      alert("닉네임이 중복됩니다. 다른 닉네임을 입력해주세요.");
      return;
    }

    if (isNickNameValueAvailable === null) {
      alert("닉네임 중복확인을 해주세요.");
      return;
    }

    // 비밀번호 일치 확인
    if (passwordValue !== passwordCheckValue) {
      alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
      return;
    }

    try {
      // Supabase 업데이트
      let imageUrl = user.profile_image;

      if (selectedImage) {
        try {
          imageUrl = await uploadProfileImage(selectedImage, user.id);

          setPreviewImage(imageUrl);
        } catch (uploadErr) {
          alert("이미지 업로드에 실패했어요.");
          console.error(uploadErr);
          return null;
        }
      }

      if (passwordValue) {
        const { error: pwError } = await supabase.auth.updateUser({
          password: passwordValue,
        });

        if (pwError) {
          console.error("비밀번호 변경 실패:", pwError);
          alert("비밀번호 변경에 실패했어요.");
          return;
        }
      }

      const response = await axiosInstance.patch(
        "/user",
        {
          profile_image: imageUrl,
          nickname: nickNameValue,
          description: descriptionValue,
        },
        {
          params: { id: `eq.${user.id}` },
          headers: { Prefer: "return=representation" },
        },
      );

      // 전역 상태 업데이트
      setUser(response.data?.[0]);

      alert("저장 완료!");

      // 저장 후 마이페이지로 이동
      navigate("/mypage");
    } catch (error) {
      console.error("업데이트 실패:", error);
      return null;
    }
  };

  // 프로필 이미지 변경
  const onProfileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImage(file);

    // 미리보기
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 닉네임 중복 확인
  const handleCheck = async () => {
    try {
      const response = await axiosInstance.get("/user", {
        params: {
          nickname: `eq.${nickNameValue}`,
        },
      });

      const isDuplicate = response.data.length > 0 && response.data[0].id !== user?.id;

      if (isDuplicate) {
        alert("중복입니다");
        setIsNickNameValueAvailable(false);
      } else {
        alert("사용 가능한 닉네임입니다");
        setIsNickNameValueAvailable(true);
      }
    } catch (error) {
      console.error("중복확인 실패:", error);
      alert("중복 확인 중 문제가 발생했어요.");
    }
  };

  const isFormValid =
    !!nickNameValue && !!passwordValue && !!passwordCheckValue && isNickNameValueAvailable === true;

  return (
    <form className="px-[16px]" onSubmit={onSubmit}>
      {/* 프로필 이미지 */}
      <div className="mb-[20px] mt-[50px] text-center">
        <div className="relative inline-block">
          <label htmlFor="profile" className="cursor-pointer">
            <img
              className="mx-auto h-[80px] w-[80px] rounded-full object-cover brightness-[0.6]"
              src={(previewImage ?? user?.profile_image) || ProfileImageDefault}
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

      {/* input */}
      <ul className="flex flex-col gap-[20px]">
        <li>
          <label htmlFor="user-nicknameValue" className="text-body2">
            닉네임*
          </label>
          <div className="flex gap-[8px]">
            <Input
              id="user-nicknameValue"
              className="flex-grow"
              type="text"
              placeholder="닉네임을 입력하세요"
              value={nickNameValue}
              onChange={(e) => {
                setNickNameValue(e.target.value);
                setIsNickNameValueAvailable(null);
              }}
              showDelete={!!nickNameValue}
            />
            <Button variant="small" type="button" disabled={!nickNameValue} onClick={handleCheck}>
              중복확인
            </Button>
          </div>
        </li>
        <li>
          <label htmlFor="user-password" className="text-body2">
            비밀번호*
          </label>
          <Input
            id="user-password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={passwordValue}
            onChange={(e) => setPasswordValue(e.target.value)}
          />
        </li>
        <li>
          <label htmlFor="user-password-check" className="text-body2">
            비밀번호 확인*
          </label>
          <Input
            id="user-password-check"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
            value={passwordCheckValue}
            onChange={(e) => setPasswordCheckValue(e.target.value)}
          />
        </li>
        <li>
          <label htmlFor="user-info" className="text-body2">
            소개
          </label>
          <Input
            id="user-info"
            type="textarea"
            placeholder="소개글을 입력하세요"
            value={descriptionValue}
            onChange={(e) => setDescriptionValue(e.target.value)}
          />
        </li>
      </ul>

      <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-[430px] px-[16px]">
        <Button variant="full" type="submit" disabled={!isFormValid}>
          저장
        </Button>
      </div>
    </form>
  );
};

export default EditProfile;
