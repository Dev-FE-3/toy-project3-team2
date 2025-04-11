/** 사용자 정보를 수정하는 페이지 */

import { useState, useEffect } from "react";
import axiosInstance from "./../services/axios/axiosInstance";
import { getCurrentUserId } from "../services/supabase/supabaseClient";
import { User } from "../types/user";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import ProfileImageDefault from "../assets/imgs/profile-image-default.svg";
import Camera from "../assets/icons/camera.svg?react";

const EditProfile = () => {
  const [inputValue, setInputValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [passwordCheckValue, setPasswordCheckValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");
  const [user, setUser] = useState<User | null>(null);

  // user 정보 fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await getCurrentUserId();
        if (!userId) return null;

        const response = await axiosInstance.get<User[]>("/user", {
          params: {
            id: `eq.${userId}`,
            select: "*",
          },
        });

        setUser(response.data?.[0] ?? null);
      } catch (error) {
        console.error("데이터 불러오기 실패:", error);
      }
    };

    fetchData();
  }, []);

  // 초기값 설정
  useEffect(() => {
    if (!user) return;

    setInputValue(user.nickname || "");
    setTextareaValue(user.description || "");
  }, [user]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 저장
    alert("저장 완료!");
  };

  const onProfileChange = () => {
    // 프로필 이미지 변경
    alert("프로필 이미지 변경 완료!");
  };

  const handleCheck = () => {
    // 닉네임 중복 확인
    alert("중복 확인 완료!");
  };

  const isFormValid = inputValue && passwordValue && passwordCheckValue;

  return (
    <form className="px-[16px]" onSubmit={onSubmit}>
      {/* 프로필 이미지 */}
      <div className="mb-[20px] mt-[50px] text-center">
        <div className="relative inline-block">
          <label htmlFor="profile" className="cursor-pointer">
            <img
              className="mx-auto h-[80px] w-[80px] rounded-full object-cover brightness-[0.6]"
              src={user?.profile_image || ProfileImageDefault}
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
          <label htmlFor="user-nickname" className="text-body2">
            닉네임*
          </label>
          <div className="flex gap-[8px]">
            <Input
              id="user-nickname"
              className="flex-grow"
              type="text"
              placeholder="닉네임을 입력하세요"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              showDelete={!!inputValue}
            />
            <Button variant="small" type="button" disabled={!inputValue} onClick={handleCheck}>
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
            value={textareaValue}
            onChange={(e) => setTextareaValue(e.target.value)}
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
