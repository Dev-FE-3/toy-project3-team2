import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/imgs/logo.svg";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";
import { supabase } from "../services/supabase/supabaseClient";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 로그인 버튼 활성화 상태 체크
  const isLoginEnabled = email.trim() !== "" && password.trim() !== "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      // 로그인 성공 후 유저 정보 저장
      const {
        data: { user },
      } = await supabase.auth.getUser();
      console.log(user?.id);
      console.log("로그인 성공:", data);
      navigate("/");
    } catch (error) {
      console.error("로그인 에러:", error);
      alert("로그인 중 오류가 발생했습니다.");
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
            htmlFor="email"
            type="email"
            placeholder="이메일을 입력해주세요"
            className="mb-5"
            required
            label="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            htmlFor="password"
            type="password"
            placeholder="비밀번호를 입력해주세요"
            className="mb-6"
            required
            label="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="full" disabled={!isLoginEnabled}>
            로그인
          </Button>
        </form>

        <div className="mt-10 text-center">
          <span className="mr-2 text-sub text-font-muted">아직 회원이 아니신가요?</span>
          <Link to="/signup" className="text-sub-bold text-font-primary hover:underline">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
