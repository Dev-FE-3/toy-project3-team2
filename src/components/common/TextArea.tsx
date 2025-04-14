import * as React from "react";
import { cn } from "../../utils/shadcn";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  htmlFor?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, htmlFor, value, onChange, ...props }, ref) => {
    const [inputValue, setInputValue] = React.useState(value);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setInputValue(e.target.value);
      onChange?.(e);
    };

    const baseClassName = cn(
      "w-full rounded bg-background-input px-3 !text-sub text-font-primary placeholder:text-font-placeholder focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
      "border-[1px] border-transparent focus:border-font-placeholder",
    );

    return (
      <div className={cn("relative flex flex-col gap-2", className)}>
        {label && (
          <label htmlFor={htmlFor} className="text-body2">
            {label}
          </label>
        )}
        <div className="relative">
          <textarea
            id={htmlFor}
            className={cn(baseClassName, "h-[99px] resize-none py-[12px]")}
            ref={ref}
            value={inputValue}
            onChange={handleChange}
            {...props}
          />
        </div>
      </div>
    );
  },
);

TextArea.displayName = "TextArea";

export { TextArea };
