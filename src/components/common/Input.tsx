import * as React from "react";
import { cn } from "../../utils/shadcn";
import IconEye from "../../assets/icons/eye.svg";
import IconEyeCrossed from "../../assets/icons/eye-crossed.svg";
import IconEyeCrossedPlaceholder from "../../assets/icons/eye-crossed-muted.svg";
import IconDelete from "../../assets/icons/delete.svg";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showDelete?: boolean;
  label?: string;
  htmlFor?: string;
  value?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, onChange, value = "", htmlFor, showDelete, label, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(value);

    React.useEffect(() => {
      if (value !== undefined) {
        setInputValue(value);
      }
    }, [value]);
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

    const baseClassName = cn(
      "flex w-full rounded bg-background-input px-3 py-[15px] !text-sub text-font-primary placeholder:text-font-placeholder focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      "border-[1px] border-transparent focus:border-font-placeholder",
      (type === "password" || (showDelete && hasValue)) && "pr-10",
    );
    const sharedProps = {
      onChange: handleChange,
      ref,
      value: inputValue,
      ...props,
    };

    let inputElement;
    switch (type) {
      case "round":
        inputElement = (
          <input
            className={cn(
              baseClassName,
              "h-[37px] rounded-[30px] border-font-placeholder bg-transparent",
            )}
            {...sharedProps}
          />
        );
        break;
      default:
        inputElement = (
          <input
            type={type === "password" && showPassword ? "text" : type}
            className={cn(baseClassName, "h-[40px]")}
            {...sharedProps}
          />
        );
        break;
    }

    return (
      <div className={cn("relative flex flex-col gap-2", className)}>
        {label && (
          <label htmlFor={htmlFor} className="text-body2">
            {label}
          </label>
        )}
        <div className="relative">
          {inputElement}
          {showDelete &&
            hasValue && ( // delete옵션 있으면, 값 있을 때 X아이콘
              <button
                type="button"
                onClick={handleDelete}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              >
                <img src={IconDelete} alt="입력값 삭제" className="h-4 w-4" />
              </button>
            )}
          {type === "password" && ( // type:password일 때 눈 아이콘
            <button
              type="button"
              onClick={hasValue ? () => setShowPassword((prev) => !prev) : undefined}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2",
                !hasValue && "cursor-default",
                showDelete && hasValue && "right-9",
              )}
            >
              <img
                src={
                  hasValue ? (showPassword ? IconEye : IconEyeCrossed) : IconEyeCrossedPlaceholder
                }
                alt="비밀번호 보기"
                className="h-6 w-6"
              />
            </button>
          )}
        </div>
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
