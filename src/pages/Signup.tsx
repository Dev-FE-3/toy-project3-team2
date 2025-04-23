import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import DefaultProfileImage from "@/assets/imgs/profile-image-default.svg";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { ValidationMessage } from "@/components/common/ValidationMessage";
import { NO_DATA_ERROR } from "@/constants/signupError";
import supabase from "@/services/supabase/supabaseClient";
import { showToast } from "@/utils/toast";
import { validateEmail, validateNickname, validatePassword } from "@/utils/validation";
interface SignupForm {
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
}

const Signup = () => {
  const navigate = useNavigate();
  const [emailVerified, setEmailVerified] = useState(false);
  const [nicknameVerified, setNicknameVerified] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
  } = useForm<SignupForm>();

  // 중복 확인 함수
  const checkDuplicate = async (type: "email" | "nickname", value: string) => {
    try {
      if (type === "email" && !validateEmail(value)) {
        setError("email", { message: "이메일 형식이 맞지 않습니다." });
        setEmailVerified(false);
        return;
      }

      if (type === "nickname" && !validateNickname(value)) {
        setError("nickname", { message: "2~15자의 한글, 영문, 숫자만 사용 가능합니다." });
        setNicknameVerified(false);
        return;
      }

      const { error } = await supabase.from("user").select(type).eq(type, value).single();

      if (error) {
        // 데이터가 존재하지 않으면 사용 가능
        if (error.code === NO_DATA_ERROR) {
          clearErrors(type);
          if (type === "email") {
            setEmailVerified(true);
          } else {
            setNicknameVerified(true);
          }
          return;
        }
        console.error(`${type} 중복 확인 에러:`, error);
        return;
      }
      // 데이터가 존재하면 이미 사용 중
      setError(type, {
        message: type === "email" ? "가입된 이메일입니다." : "사용 중인 닉네임입니다.",
      });
      if (type === "email") {
        setEmailVerified(false);
      } else {
        setNicknameVerified(false);
      }
    } catch (error) {
      console.error(`${type} 중복 확인 중 에러 발생:`, error);
    }
  };

  const onSubmit = async (data: SignupForm) => {
    const { email, password, nickname } = data;

    try {
      await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nickname: nickname || "",
            profile_image: DefaultProfileImage,
          },
        },
      });

      // 회원가입 후 로그아웃 처리
      await supabase.auth.signOut();
      navigate("/login");
      showToast("success", "회원가입이 완료되었습니다");
    } catch (error) {
      console.error("회원가입 에러:", error);
    }
  };

  const email = watch("email");
  const nickname = watch("nickname");
  const password = watch("password");
  const passwordConfirm = watch("passwordConfirm");

  const isEmailCheckEnabled = email?.trim() !== "";
  const isNicknameCheckEnabled = nickname?.trim() !== "";

  return (
    <div data-testid="signup-page" className="px-4">
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-5">
        <div>
          <label htmlFor="email" className="mb-2 block text-body2">
            이메일*
          </label>
          <div className="flex gap-2">
            <Input
              id="email"
              type="text"
              autoComplete="email"
              placeholder="이메일을 입력해주세요"
              className="flex-grow"
              {...register("email", {
                validate: (value) => validateEmail(value) || "이메일 형식이 맞지 않습니다.",
              })}
            />
            <Button
              type="button"
              onClick={() => checkDuplicate("email", email)}
              disabled={!isEmailCheckEnabled}
            >
              중복확인
            </Button>
          </div>
          {errors.email && <ValidationMessage type="error" message={errors.email.message || ""} />}
          {emailVerified && !errors.email && (
            <ValidationMessage type="success" message="사용 가능한 이메일입니다." />
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
              autoComplete="nickname"
              placeholder="닉네임을 입력해주세요"
              className="flex-grow"
              {...register("nickname", {
                validate: (value) =>
                  validateNickname(value) || "2~15자의 한글, 영문, 숫자만 사용 가능합니다.",
              })}
            />
            <Button
              type="button"
              onClick={() => checkDuplicate("nickname", nickname)}
              disabled={!isNicknameCheckEnabled}
            >
              중복확인
            </Button>
          </div>
          {errors.nickname && (
            <ValidationMessage type="error" message={errors.nickname.message || ""} />
          )}
          {nicknameVerified && !errors.nickname && (
            <ValidationMessage type="success" message="사용 가능한 닉네임입니다." />
          )}
        </div>

          <Input
            htmlFor="password"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            label="비밀번호*"
            autoComplete="new-password"
            value={password || ""}
            {...register("password", {})}
          />

        <div>
          <Input
            htmlFor="passwordConfirm"
            type="password"
            placeholder="비밀번호를 다시 입력해주세요"
            label="비밀번호 확인*"
            autoComplete="new-password"
            value={passwordConfirm || ""}
            {...register("passwordConfirm", {
              validate: (value) => {
                if (!validatePassword(password)) {
                  return "비밀번호는 8~32자이며, 영문, 숫자, 특수문자 중 최소 2개 이상을 포함해야 합니다.";
                }
                return value === password || "비밀번호가 일치하지 않습니다.";
              },
            })}
          />
          {errors.passwordConfirm && (
            <ValidationMessage type="error" message={errors.passwordConfirm.message || ""} />
          )}
        </div>

        <Button
          type="submit"
          variant="full"
          fixed
          disabled={
            !email ||
            !nickname ||
            !password ||
            !passwordConfirm ||
            !emailVerified ||
            !nicknameVerified
          }
        >
          회원가입
        </Button>
      </form>
    </div>
  );
};

export default Signup;
