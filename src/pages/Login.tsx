import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import ErrorIcon from "@/assets/icons/error.svg";
import Logo from "@/assets/imgs/logo.svg";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import supabase from "@/services/supabase/supabaseClient";
import useUserStore from "@/store/useUserStore";
import { showToast } from "@/utils/toast";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };
    checkSession();
  }, [navigate]);

  // 로그인 버튼 활성화 상태 체크
  const isLoginEnabled = email.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();

      if (!supabaseUser) {
        throw new Error("User not found");
      }

      const userData = {
        id: supabaseUser.id,
        email: supabaseUser.email ?? "",
        nickname: supabaseUser.user_metadata.nickname,
        profile_image: supabaseUser.user_metadata.profile_image ?? "",
        description: supabaseUser.user_metadata.description ?? "",
        subscribe_count: supabaseUser.user_metadata.subscribe_count ?? 0,
      };

      setUser(userData);
      console.log("유저 정보 저장 완료:", userData);

      console.log("로그인 성공:", data);
      navigate("/");

      showToast("success", `${userData.nickname}님, 환영합니다`);
    } catch (error) {
      console.error("로그인 에러:", error);
      setError("이메일과 비밀번호를 확인해주세요.");
    }
  };

  return (
    <div className="px-4">
      <div className="flex h-screen flex-col justify-center">
        <div className="mb-[60px] flex justify-center">
          <img src={Logo} alt="logo" className="h-[35px]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            data-testid="email-input"
            htmlFor="email"
            type="text"
            placeholder="이메일을 입력해주세요"
            className="mb-5"
            required
            label="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div>
            <Input
              data-testid="password-input"
              htmlFor="password"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              className="mb-6"
              required
              label="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && (
              <p className="mt-[-16px] text-sub text-red-500">
                <img src={ErrorIcon} alt="error" className="mr-1 inline-block h-4 w-4" />
                {error}
              </p>
            )}
          </div>
          <Button
            data-testid="login-button"
            type="submit"
            variant="full"
            disabled={!isLoginEnabled}
          >
            로그인
          </Button>
        </form>

        <div className="mt-10 text-center">
          <span className="mr-2 text-sub text-font-muted">아직 회원이 아니신가요?</span>
          <Link
            to="/signup"
            data-testid="signup-link"
            className="text-sub-bold text-font-primary hover:underline"
          >
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
