import { validatePassword } from "@/utils/validation";
import { Input } from "@/components/common/Input";
import errorIcon from "@/assets/icons/error.svg";

interface PasswordFieldProps {
  password: string;
  passwordCheck: string;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordCheckChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isSubmitted: boolean;
}

const PasswordField = ({
  password,
  passwordCheck,
  onPasswordChange,
  onPasswordCheckChange,
  isSubmitted,
}: PasswordFieldProps) => {
  const isPasswordValid = validatePassword(password);
  const isMatch = password === passwordCheck;

  return (
    <>
      <li>
        <Input
          htmlFor="user-password"
          type="password"
          placeholder="비밀번호를 입력하세요"
          label="비밀번호"
          maxLength={32}
          value={password}
          onChange={onPasswordChange}
        />
      </li>
      <li>
        <Input
          htmlFor="user-passwordCheck"
          type="password"
          placeholder="비밀번호를 다시 입력하세요"
          label="비밀번호 확인"
          maxLength={32}
          value={passwordCheck}
          onChange={onPasswordCheckChange}
        />

        {isSubmitted && password && !isPasswordValid && (
          <p className="mt-2 text-sub text-red-500">
            <img src={errorIcon} alt="error" className="mr-1 inline-block h-4 w-4" />
            비밀번호는 8~32자이며, 영문, 숫자, 특수문자 중 최소 2개 이상을 포함해야 합니다.
          </p>
        )}
        {isSubmitted && password && passwordCheck && !isMatch && (
          <p className="mt-2 text-sub text-red-500">
            <img src={errorIcon} alt="error" className="mr-1 inline-block h-4 w-4" />
            비밀번호와 비밀번호 확인이 일치하지 않습니다.
          </p>
        )}
      </li>
    </>
  );
};

export default PasswordField;
