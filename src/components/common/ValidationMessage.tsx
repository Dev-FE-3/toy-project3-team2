import ErrorIcon from "@/assets/icons/error.svg";
import SuccessIcon from "@/assets/icons/success.svg";

interface ValidationMessageProps {
  type: "error" | "success";
  message: string;
  className?: string;
}

const ValidationMessage = ({ type, message, className }: ValidationMessageProps) => {
  const icon = type === "error" ? ErrorIcon : SuccessIcon;
  const textColor = type === "error" ? "text-error" : "text-success";

  return (
    <p className={`mt-2 text-sub ${textColor} ${className}`}>
      <img src={icon} alt={type} className="mr-1 inline-block h-4 w-4" />
      {message}
    </p>
  );
};

export { ValidationMessage };
