import * as React from "react";

import IconDelete from "@/assets/icons/delete.svg";
import IconEyeCrossedPlaceholder from "@/assets/icons/eye-crossed-muted.svg";
import IconEyeCrossed from "@/assets/icons/eye-crossed.svg";
import IconEye from "@/assets/icons/eye.svg";
import { cn } from "@/utils/shadcn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  showDelete?: boolean;
  label?: string;
  htmlFor?: string;
  inputClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { className, type, onChange, htmlFor, showDelete, label, inputClassName, value, ...props },
    ref,
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);

    const handleDelete = () => {
      if (onChange) {
        onChange({
          target: { value: "" },
        } as React.ChangeEvent<HTMLInputElement>);
      }
    };

    const baseClassName = cn(
      "w-full rounded bg-background-input px-3 !text-sub text-font-primary placeholder:text-font-placeholder focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      "border-[1px] border-transparent focus:border-font-placeholder",
      (type === "password" || (showDelete && value)) && "pr-10",
    );

    const sharedProps = {
      onChange,
      ref,
      value,
      id: htmlFor,
      ...props,
    };

    const inputElement = () => {
      if (type === "round") {
        return (
          <input
            className={cn(
              baseClassName,
              "rounded-[30px] border-font-placeholder bg-transparent py-[12px]",
              inputClassName,
            )}
            {...sharedProps}
          />
        );
      }
      return (
        <input
          type={type === "password" && showPassword ? "text" : type}
          className={cn(baseClassName, "py-[14px]", inputClassName)}
          {...sharedProps}
        />
      );
    };

    return (
      <div className={cn("relative flex flex-col gap-2", className)}>
        {label && (
          <label htmlFor={htmlFor} className="text-body2">
            {label}
          </label>
        )}
        <div className="relative">
          {inputElement()}
          {showDelete && value && (
            <button
              type="button"
              onClick={handleDelete}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            >
              <img src={IconDelete} alt="입력값 삭제" className="h-4 w-4" />
            </button>
          )}
          {type === "password" && (
            <button
              type="button"
              onClick={value ? () => setShowPassword((prev) => !prev) : undefined}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2",
                !value && "cursor-default",
                showDelete && value && "right-9",
              )}
            >
              <img
                src={value ? (showPassword ? IconEye : IconEyeCrossed) : IconEyeCrossedPlaceholder}
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
