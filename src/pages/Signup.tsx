import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import errorIcon from "../assets/icons/error.svg";
import successIcon from "../assets/icons/success.svg";
import { useState } from "react";
import { supabase } from "../services/supabase/supabaseClient";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(false);
  const [isNicknameValid, setIsNicknameValid] = useState<boolean | null>(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      // 비밀번호 확인 로직
      return;
    }

    //회원가입 시도
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          nickname: nickname || "",
        },
      },
    });

    //회원가입 에러 처리
    if (error) {
      console.error("회원가입 에러:", error.message);
      return;
    }

    // 회원가입 성공 처리
    console.log("회원가입 성공:", data);
    navigate("/login");
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
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
          htmlFor="passwordConfirm"
          type="password"
          placeholder="비밀번호를 다시 입력해주세요"
          required
          label="비밀번호 확인*"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <Button type="submit" variant="full">
          회원가입
        </Button>
      </form>
    </div>
  );
};

export default Signup;
