import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import errorIcon from "../assets/icons/error.svg";
import successIcon from "../assets/icons/success.svg";
import { useState } from "react";

const Signup = () => {
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(false);
  const [isNicknameValid, setIsNicknameValid] = useState<boolean | null>(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 회원가입 로직 구현
  };

  return (
    <div className="px-4">
      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block text-body2">
            이메일*
          </label>
          <div className="flex gap-2">
            <Input
              id="email"
              type="email"
              placeholder="이메일을 입력해주세요"
              className="flex-grow"
              required
            />
            <Button type="button">중복확인</Button>
          </div>
          {isEmailValid === false && (
            <p className="mt-2 text-sub text-red-500">
              <img src={errorIcon} alt="error" className="mr-1 inline-block h-4 w-4" />
              가입된 이메일입니다.
            </p>
          )}
          {isEmailValid === true && (
            <p className="mt-2 text-sub text-green-500">
              <img src={successIcon} alt="success" className="mr-1 inline-block h-4 w-4" />
              사용 가능한 이메일입니다.
            </p>
          )}
        </div>
        <div>
          <label htmlFor="nickname" className="mb-2 block text-body2">
            닉네임*
          </label>
          <div className="flex gap-2">
            <Input
              id="nickname"
              type="text"
              placeholder="닉네임을 입력해주세요"
              className="flex-grow"
              required
            />
            <Button type="button">중복확인</Button>
          </div>
          {isNicknameValid === false && (
            <p className="mt-2 text-sub text-red-500">
              <img src={errorIcon} alt="error" className="mr-1 inline-block h-4 w-4" />
              사용 중인 닉네임입니다.
            </p>
          )}
          {isNicknameValid === true && (
            <p className="mt-2 text-sub text-green-500">
              <img src={successIcon} alt="success" className="mr-1 inline-block h-4 w-4" />
              사용 가능한 닉네임입니다.
            </p>
          )}
        </div>
        <Input
          id="password"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          required
          label="비밀번호*"
        />
        <Input
          id="passwordConfirm"
          type="password"
          placeholder="비밀번호를 다시 입력해주세요"
          required
          label="비밀번호 확인*"
        />
        <Button type="submit" variant="full">
          회원가입
        </Button>
      </form>
    </div>
  );
};

export default Signup;
