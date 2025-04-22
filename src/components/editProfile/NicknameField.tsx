import { validateNickname } from "@/utils/validation";
import { Input } from "@/components/common/Input";
import { Button } from "@/components/common/Button";
import errorIcon from "@/assets/icons/error.svg";
import successIcon from "@/assets/icons/success.svg";

interface NicknameFieldProps {
  nickname: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCheck: () => void;
  isSubmitted: boolean;
  isValid: "idle" | "valid" | "invalid";
  originalNickname: string;
}

const NicknameField = ({
  nickname,
  onChange,
  onCheck,
  isSubmitted,
  isValid,
  originalNickname,
}: NicknameFieldProps) => {
  const isChanged = nickname !== originalNickname;

  return (
    <li>
      <label htmlFor="user-nickname" className="mb-2 block text-body2">
        닉네임
      </label>
      <div className="flex gap-[8px]">
        <Input
          id="user-nickname"
          className="flex-grow"
          type="text"
          placeholder="닉네임을 입력하세요"
          maxLength={15}
          value={nickname}
          onChange={onChange}
        />
        <Button variant="small" type="button" disabled={!nickname || !isChanged} onClick={onCheck}>
          중복확인
        </Button>
      </div>

      {isSubmitted && isValid === "invalid" && (
        <p className="mt-2 text-sub text-red-500">
          <img src={errorIcon} alt="error" className="mr-1 inline-block h-4 w-4" />
          {validateNickname(nickname)
            ? "사용 중인 닉네임입니다."
            : "2~15자의 한글, 영문, 숫자만 사용 가능합니다."}
        </p>
      )}
      {isSubmitted && isValid === "valid" && (
        <p className="mt-2 text-sub text-green-500">
          <img src={successIcon} alt="success" className="mr-1 inline-block h-4 w-4" />
          사용 가능한 닉네임입니다.
        </p>
      )}
    </li>
  );
};

export default NicknameField;
