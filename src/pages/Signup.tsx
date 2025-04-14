import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import ErrorIcon from "@/assets/icons/error.svg";
import SuccessIcon from "@/assets/icons/success.svg";
import { useState } from "react";
import supabase from "@/services/supabase/supabaseClient";
import { useNavigate } from "react-router-dom";
import DefaultProfileImage from "@/assets/imgs/profile-image-default.svg";

const Signup = () => {
  const navigate = useNavigate();
  const [isEmailValid, setIsEmailValid] = useState<boolean | null>(null);
  const [isNicknameValid, setIsNicknameValid] = useState<boolean | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [nickname, setNickname] = useState("");

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

  // 중복 확인 함수 수정
  const checkDuplicate = async (type: "email" | "nickname", value: string) => {
    try {
      // 닉네임일 경우 유효성 먼저 검사
      if (type === "nickname" && !validateNickname(value)) {
        setIsNicknameValid(false);
        return;
      }

      const { error } = await supabase.from("user").select(type).eq(type, value).single();

      if (error) {
        // 에러가 발생했지만, 데이터가 없는 경우 (사용 가능)
        if (error.code === "PGRST116") {
          type === "email" ? setIsEmailValid(true) : setIsNicknameValid(true);
          return;
        }
        console.error(`${type} 중복 확인 에러:`, error);
        return;
      }

      // 데이터가 있으면 이미 사용 중
      type === "email" ? setIsEmailValid(false) : setIsNicknameValid(false);
    } catch (error) {
      console.error(`${type} 중복 확인 중 에러 발생:`, error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !nickname || !password || !passwordConfirm) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    if (!isEmailValid || !isNicknameValid) {
      alert("이메일과 닉네임 중복 확인을 해주세요.");
      return;
    }

    if (!validatePassword(password)) {
      alert("비밀번호는 8~32자이며, 영문, 숫자, 특수문자 중 최소 2개 이상을 포함해야 합니다.");
      return;
    }

    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      const { data } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            nickname: nickname || "",
            profile_image: DefaultProfileImage,
          },
        },
      });

      console.log("회원가입 성공:", data);
      // 회원가입 후 로그아웃 처리
      await supabase.auth.signOut();

      navigate("/login");
    } catch (error) {
      console.error("회원가입 에러:", error);
      alert("회원가입 중 오류가 발생했습니다.");
    }
  };

  // 이메일, 닉네임 중복확인 버튼 활성화 상태 체크
  const isEmailCheckEnabled = email.trim() !== "";
  const isNicknameCheckEnabled = nickname.trim() !== "";

  // 회원가입 버튼 활성화 상태 체크
  const isSignupEnabled =
    email.trim() !== "" &&
    nickname.trim() !== "" &&
    password.trim() !== "" &&
    passwordConfirm.trim() !== "";

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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button
              type="button"
              onClick={() => checkDuplicate("email", email)}
              disabled={!isEmailCheckEnabled}
            >
              중복확인
            </Button>
          </div>
          {isEmailValid === false && (
            <p className="mt-2 text-sub text-red-500">
              <img src={ErrorIcon} alt="error" className="mr-1 inline-block h-4 w-4" />
              가입된 이메일입니다.
            </p>
          )}
          {isEmailValid === true && (
            <p className="mt-2 text-sub text-green-500">
              <img src={SuccessIcon} alt="success" className="mr-1 inline-block h-4 w-4" />
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
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
            />
            <Button
              type="button"
              onClick={() => checkDuplicate("nickname", nickname)}
              disabled={!isNicknameCheckEnabled}
            >
              중복확인
            </Button>
          </div>
          {isNicknameValid === false && (
            <p className="mt-2 text-sub text-red-500">
              <img src={ErrorIcon} alt="error" className="mr-1 inline-block h-4 w-4" />
              {validateNickname(nickname)
                ? "사용 중인 닉네임입니다."
                : "2~15자의 한글, 영문, 숫자만 사용 가능합니다."}
            </p>
          )}
          {isNicknameValid === true && (
            <p className="mt-2 text-sub text-green-500">
              <img src={SuccessIcon} alt="success" className="mr-1 inline-block h-4 w-4" />
              사용 가능한 닉네임입니다.
            </p>
          )}
        </div>
        <Input
          id="password"
          type="password"
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          label="비밀번호*"
        />
        <Input
          htmlFor="passwordConfirm"
          type="password"
          placeholder="비밀번호를 다시 입력해주세요"
          label="비밀번호 확인*"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
        />
        <Button type="submit" variant="full" fixed disabled={!isSignupEnabled}>
          회원가입
        </Button>
      </form>
    </div>
  );
};

export default Signup;
