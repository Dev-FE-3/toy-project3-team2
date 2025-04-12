const PlaylistSkeleton = () => (
  <div className="animate-fadeIn animate-pulse">
    {/* 영상 플레이어 영역 */}
    <section className="relative w-full bg-[#2A2C2C] pt-[56.25%]" />

    {/* 콘텐츠 영역 */}
    <section className="space-y-4 px-4 pb-6 pt-3">
      {/* 유저 정보 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-6 w-6 rounded-full bg-[#3A3D3D]" />
          <div className="h-4 w-20 rounded bg-[#3A3D3D]" />
        </div>
        <div className="h-4 w-24 rounded bg-[#3A3D3D]" />
      </div>

      {/* 플레이리스트 정보 */}
      <div className="space-y-2">
        <div className="h-5 w-full rounded bg-[#3A3D3D]" />
        <div className="h-5 w-3/4 rounded bg-[#3A3D3D]" />
        <div className="h-4 w-full rounded bg-[#3A3D3D]" />
        <div className="h-4 w-2/3 rounded bg-[#3A3D3D]" />
      </div>

      {/* 액션 버튼 영역 대체 */}
      <div className="flex gap-4">
        <div className="h-4 w-2/5 rounded bg-[#3A3D3D]" />
      </div>
    </section>

    {/* 재생목록 영역 */}
    <section className="border-y border-[#333] py-4">
      <div className="mb-3 ml-4 h-6 w-24 rounded bg-[#3A3D3D]" />
      <div className="scrollbar-hide overflow-x-auto">
        <ul className="flex gap-3 px-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="w-[150px] flex-shrink-0 space-y-2">
              <div className="h-[84px] w-full rounded-[4px] bg-[#3A3D3D]" />
              <div className="h-3 w-full rounded bg-[#3A3D3D]" />
              <div className="h-3 w-3/4 rounded bg-[#3A3D3D]" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  </div>
);

export default PlaylistSkeleton;
