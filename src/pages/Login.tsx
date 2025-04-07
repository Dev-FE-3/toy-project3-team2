import Logo from "../assets/imgs/logo.svg";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";

const Login = () => {
  return (
    <div className="flex h-screen flex-col justify-center">
      <div className="mb-[60px] flex justify-center">
        <img src={Logo} alt="logo" className="h-[35px]" />
      </div>

      {/* 이메일 / 비밀번호 */}
      <p className="mb-2 text-sub2">이메일</p>
      <Input type="email" placeholder="이메일을 입력하세요" className="mb-5" />
      <p className="mb-2 text-sub2">비밀번호</p>
      <Input type="password" placeholder="비밀번호를 입력하세요" className="mb-6" />

      {/* 로그인 버튼 */}
      <Button variant="full" className="mb-10">
        로그인
      </Button>

      {/* 회원가입하러 가기 */}
      <div className="text-center">
        <span className="mr-2 text-sub text-font-muted">아직 회원이 아니신가요?</span>
        <a className="cursor-pointer text-sub-bold text-font-primary hover:underline">회원가입</a>
      </div>
    </div>
  );
};

export default Login;
