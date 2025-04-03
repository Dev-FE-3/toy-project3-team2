import * as React from "react";
import { cn } from "../../utils/shadcn";
import IconEye from "../../assets/icons/icon-eye.svg";
import IconEyeCrossed from "../../assets/icons/icon-eye-crossed.svg";
import IconEyeCrossedPlaceholder from "../../assets/icons/icon-eye-crossed-placeholder.svg";
import IconDelete from "../../assets/icons/icon-delete.svg";

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
      onChange?.(e);
    };

    const handleDelete = () => {
      setInputValue("");
      if (onChange) {
        onChange({
          target: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    };

    return (
      <div className="relative">
        <input
          type={type === "password" && showPassword ? "text" : type}
          className={cn(
            "flex h-[40px] w-full rounded bg-background-input px-3 py-1 text-sub text-font-primary placeholder:text-font-placeholder focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
            "border border-transparent focus:border-outline",
            (type === "password" || (showDelete && hasValue)) && "pr-10",
            className,
          )}
          value={inputValue}
          onChange={handleChange}
          ref={ref}
          {...props}
        />
        {showDelete && hasValue && (
          <div
            onClick={handleDelete}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
          >
            <img src={IconDelete} alt="입력값 삭제" className="w-4 h-4" />
          </div>
        )}
        {type === "password" && (
          <div
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
              className="w-6 h-6"
            />
          </div>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
