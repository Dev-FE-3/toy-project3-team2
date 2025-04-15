import BrokenNote from "@/assets/icons/broken-note.svg?react";

const PlaylistEmpty = () => {
  return (
    <div className="mt-24 flex flex-1 flex-col items-center text-font-second">
      <BrokenNote className="opacity-50 brightness-90" />
      <h1 className="mb-3 mt-8 text-body1-bold tracking-wide">아직 저장된 음악이 없습니다</h1>
      <p className="text-sub">당신만의 플레이리스트를 만들어보세요</p>
    </div>
  );
};

export default PlaylistEmpty;
