import { Button } from "./Button";
import BrokenNote from "../../assets/icons/broken-not.svg?react";
import { useNavigate } from "react-router-dom";

interface ErrorProps {
  title?: string;
  description?: string;
}

export default function Error({
  title = "요청하신 페이지를 찾을 수 없습니다",
  description = "홈으로 이동해 다른 플레이리스트를 확인해 보세요",
}: ErrorProps) {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen flex-col justify-between px-4 text-font-primary">
      <div className="flex flex-1 flex-col items-center justify-center pb-5">
        <BrokenNote />
        <h1 className="mb-3 mt-8 text-body1-bold tracking-wide">{title}</h1>
        <p className="text-sub">{description}</p>
      </div>
      <div className="pb-4">
        <Button type="button" variant="full" onClick={() => navigate("/")}>
          홈으로 돌아가기
        </Button>
      </div>
    </div>
  );
}
