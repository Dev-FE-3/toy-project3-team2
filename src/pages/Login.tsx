import Logo from "../assets/imgs/logo.svg";
import { Button } from "../components/common/Button";
import { Input } from "../components/common/Input";

const Login = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 로그인 로직 구현
  };

  return (
    <div className="px-4">
      <div className="flex h-screen flex-col justify-center">
        <div className="mb-[60px] flex justify-center">
          <img src={Logo} alt="logo" className="h-[35px]" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="mb-2 text-sub2">
              이메일
            </label>
            <Input
              id="email"
              type="email"
              placeholder="이메일을 입력해주세요"
              className="mb-5"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-2 text-sub2">
              비밀번호
            </label>
            <Input
              id="password"
              type="password"
              placeholder="비밀번호를 입력해주세요"
              className="mb-6"
              required
            />
          </div>

          <Button type="submit" variant="full" className="mb-10">
            로그인
          </Button>
        </form>

        <div className="text-center">
          <span className="mr-2 text-sub text-font-muted">아직 회원이 아니신가요?</span>
          <a className="cursor-pointer text-sub-bold text-font-primary hover:underline">회원가입</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
