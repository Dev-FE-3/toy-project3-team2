/** 사용자 정보를 수정하는 페이지 */

import { useState } from "react";
import { Input } from "../components/common/Input";
import { Button } from "../components/common/Button";
import IconCamera from "../assets/icons/camera.svg?react";

const EditProfile = () => {
  const [inputValue, setInputValue] = useState("칠걸스");

  return (
    <form className="px-[16px]">
      {/* 프로필 이미지 */}
      <div className="mb-[20px] mt-[50px] text-center">
        <div className="relative">
          <img
            className="mx-auto mb-[8px] h-[80px] w-[80px] rounded-full object-cover"
            src="https://i.pinimg.com/736x/60/0c/b6/600cb65bd5f67e70a8fac0909e4c1ee6.jpg"
            alt="User Profile"
          />
          <IconCamera className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <span>chill-girls@gmail.com</span>
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
              defaultValue={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              showDelete
            />
            <Button variant="small">중복확인</Button>
          </div>
        </li>
        <li>
          <label htmlFor="user-password" className="text-body2">
            비밀번호*
          </label>
          <Input id="user-password" type="password" placeholder="비밀번호를 입력하세요" />
        </li>
        <li>
          <label htmlFor="user-password-check" className="text-body2">
            비밀번호 확인*
          </label>
          <Input
            id="user-password-check"
            type="password"
            placeholder="비밀번호를 다시 입력하세요"
          />
        </li>
        <li>
          <label htmlFor="user-info" className="text-body2">
            소개*
          </label>
          <Input id="user-info" type="textarea" placeholder="소개글을 입력하세요" />
        </li>
      </ul>

      <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-[430px] px-[16px]">
        <Button variant="full" type="submit">
          저장
        </Button>
      </div>
    </form>
  );
};

export default EditProfile;
