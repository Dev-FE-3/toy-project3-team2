/** 사용자 정보를 수정하는 페이지 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./../services/axios/axiosInstance";
import supabase from "../services/supabase/supabaseClient";
import uploadProfileImage from "../services/supabase/uploadProfileImage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useUserStore from "../store/useUserStore";
import { Input } from "../components/common/Input";
import { TextArea } from "../components/common/TextArea";
import { Button } from "../components/common/Button";
import Camera from "../assets/icons/camera.svg?react";
import errorIcon from "@/assets/icons/error.svg";
import successIcon from "@/assets/icons/success.svg";
import { showToast } from "@/utils/toast";

enum NicknameValidation {
  Unchecked = "unchecked",
  Valid = "valid",
  Invalid = "invalid",
}

const EditProfile = () => {
  const user = useUserStore((state) => state.user);
  const setUser = useUserStore((state) => state.setUser);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // 프로필 이미지
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);

  // 닉네임
  const [nickname, setNickname] = useState("");
  const [originalNickname, setOriginalNickname] = useState("");
  const [isNicknameValid, setIsNicknameValid] = useState<NicknameValidation>(
    NicknameValidation.Unchecked,
  );

  // 비밀번호
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [isPasswordValid, setIsPasswordValid] = useState<boolean | null>(null);
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean | null>(null);

  // 소개글
  const [description, setDescription] = useState("");
  const [originalDescription, setOriginalDescription] = useState("");

  const [isSubmitted, setIsSubmitted] = useState(false);

  // 닉네임 유효성 검사 함수 추가
  const validateNickname = (value: string) => {
    // 한글, 영문, 숫자만 사용 가능
    const regex = /^[ㄱ-ㅎㅏ-ㅣ가-힣a-zA-Z0-9]{2,15}$/;
    return regex.test(value);
  };

  // 비밀번호 유효성 검사 함수 추가
  const validatePassword = (value: string) => {
    // 최소 8자, 최대 32자
    if (value.length < 8 || value.length > 32) return false;

    // 영문, 숫자, 특수문자 중 최소 2개 조합
    const hasLetter = /[a-zA-Z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const conditions = [hasLetter, hasNumber, hasSpecialChar];
    const metConditions = conditions.filter(Boolean).length;

    return metConditions >= 2;
  };

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

  // 비밀번호 체크
  useEffect(() => {
    if (!password && !passwordCheck) {
      setIsPasswordValid(null);
      setIsPasswordMatch(null);
      return;
    }

    setIsPasswordValid(validatePassword(password));
    setIsPasswordMatch(password === passwordCheck);
  }, [password, passwordCheck]);

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
        setIsNicknameValid(NicknameValidation.Invalid);
      } else {
        setIsNicknameValid(NicknameValidation.Valid);
      }
    },
    onError: () => {
      alert("중복 확인 중 문제가 발생했어요.");
    },
  });

  const handleCheck = () => {
    if (!nickname || nickname === originalNickname) return;

    if (!validateNickname(nickname)) {
      setIsNicknameValid(NicknameValidation.Invalid);
      return;
    }

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
      // alert("저장 완료되었습니다.");
      // react-toastify 사용
      showToast("success", "저장되었습니다.");

      navigate(`/mypage/${updatedUser.id}`);
    },
    onError: (error) => {
      console.error("업데이트 실패:", error);
      alert("업데이트 중 문제가 발생했어요.");
    },
  });

  const validateForm = () => {
    // 닉네임 중복 확인
    if (nickname !== originalNickname) {
      if (isNicknameValid === NicknameValidation.Unchecked) {
        setIsNicknameValid(NicknameValidation.Unchecked);
        return false;
      } else if (isNicknameValid === NicknameValidation.Invalid) {
        return false;
      }
    }

    // 비밀번호 유효성
    if (password) {
      const isPwValid = validatePassword(password);
      const isPwMatch = password === passwordCheck;

      setIsPasswordValid(isPwValid);
      setIsPasswordMatch(isPwMatch);

      if (!isPwValid || !isPwMatch) {
        return false;
      }
    } else {
      setIsPasswordValid(null);
      setIsPasswordMatch(null);
    }

    return true;
  };

  // 저장
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitted(true);

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

  const isNicknameCheckRequired = nickname !== originalNickname;

  const isFormChanged =
    nickname !== originalNickname ||
    description !== originalDescription ||
    selectedImage !== null ||
    !!password;

  const isFormValidForSubmit =
    isFormChanged && (!isNicknameCheckRequired || isNicknameValid === NicknameValidation.Valid);

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
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setIsNicknameValid(NicknameValidation.Unchecked);
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
          {isSubmitted &&
            nickname !== originalNickname &&
            isNicknameValid === NicknameValidation.Unchecked && (
              <p className="mt-2 text-sub text-red-500">
                <img src={errorIcon} alt="error" className="mr-1 inline-block h-4 w-4" />
                닉네임 중복 확인을 해주세요.
              </p>
            )}
          {isNicknameValid === NicknameValidation.Invalid && (
            <p className="mt-2 text-sub text-red-500">
              <img src={errorIcon} alt="error" className="mr-1 inline-block h-4 w-4" />
              {validateNickname(nickname)
                ? "사용 중인 닉네임입니다."
                : "2~15자의 한글, 영문, 숫자만 사용 가능합니다."}
            </p>
          )}
          {isNicknameValid === NicknameValidation.Valid && (
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
          {isSubmitted && isPasswordValid === false && (
            <p className="mt-2 text-sub text-red-500">
              <img src={errorIcon} alt="error" className="mr-1 inline-block h-4 w-4" />
              비밀번호는 8~32자이며, 영문, 숫자, 특수문자 중 최소 2개 이상을 포함해야 합니다.
            </p>
          )}

          {isSubmitted && isPasswordMatch === false && (
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
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </li>
      </ul>

      <Button variant="full" type="submit" disabled={!isFormValidForSubmit} fixed>
        저장
      </Button>
    </form>
  );
};

export default EditProfile;
