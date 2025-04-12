interface ToggleProps {
  isPublic: boolean;
}

const Toggle = ({ isPublic }: ToggleProps) => {
  return (
    <svg
      className="h-[20px] w-[36px]"
      viewBox="0 0 36 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        className={`transition-colors duration-300`}
        width="36"
        height="20"
        rx="10"
        fill={isPublic ? "#27C49A" : "#363838"}
      />
      <rect
        className={`transition-all duration-300`}
        x={isPublic ? 18 : 2}
        y={2}
        width="16"
        height="16"
        rx="8"
        fill="white"
      />
    </svg>
  );
};

export default Toggle;
