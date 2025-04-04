import * as React from "react";
import { cn } from "../../utils/shadcn";
import IconEye from "../../assets/icons/eye.svg";
import IconEyeCrossed from "../../assets/icons/eye-crossed.svg";
import IconEyeCrossedPlaceholder from "../../assets/icons/eye-crossed-muted.svg";
import IconDelete from "../../assets/icons/delete.svg";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showDelete?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, value, onChange, defaultValue = "", showDelete, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(defaultValue);

    React.useEffect(() => {
      if (defaultValue) {
        setInputValue(defaultValue);
        if (onChange) {
          onChange({
            target: { value: defaultValue },
          } as React.ChangeEvent<HTMLInputElement>);
        }
      }
    }, []);

    const hasValue = !!inputValue;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setInputValue(e.target.value);
      onChange?.(e as React.ChangeEvent<HTMLInputElement>);
    };

    const handleDelete = () => {
      // X버튼(delete)
      setInputValue("");
      if (onChange) {
        onChange({
          target: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    };

    const baseClassName = cn(
      "flex w-full rounded bg-background-input px-3 py-1 !text-sub text-font-primary placeholder:text-font-placeholder focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      "border border-transparent focus:border-font-placeholder",
      (type === "password" || (showDelete && hasValue)) && "pr-10",
      className,
    );
    const sharedProps = {
      value: inputValue,
      onChange: handleChange,
      ref,
      ...props,
    };
    return (
      <div className="relative">
        {type === "textarea" ? (
          <textarea
            className={cn("h-[99px] resize-none", baseClassName, className)}
            rows={4}
            {...(sharedProps as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            type={type === "password" && showPassword ? "text" : type}
            className={cn("h-[40px]", baseClassName, className)}
            {...sharedProps}
          />
        )}
        {showDelete &&
          hasValue && ( // delete옵션 있으면, 값 있을 때 X아이콘
            <button
              onClick={handleDelete}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              <img src={IconDelete} alt="입력값 삭제" className="h-4 w-4" />
            </button>
          )}
        {type === "password" && ( // type:password일 때 눈 아이콘
          <button
            onClick={hasValue ? () => setShowPassword((prev) => !prev) : undefined}
            className={cn(
              "absolute right-3 top-1/2 -translate-y-1/2",
              hasValue && "cursor-pointer",
              showDelete && hasValue && "right-9",
            )}
          >
            <img
              src={hasValue ? (showPassword ? IconEye : IconEyeCrossed) : IconEyeCrossedPlaceholder}
              alt="비밀번호 보기"
              className="h-6 w-6"
            />
          </button>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
