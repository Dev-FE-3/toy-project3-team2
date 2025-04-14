import { Skeleton } from "../common/skeleton";

const PlaylistSkeleton = () => (
  <div className="animate-fadeIn animate-pulse">
    {/* 영상 플레이어 영역 */}
    <Skeleton className="relative w-full pt-[56.25%]" />

    {/* 콘텐츠 영역 */}
    <section className="space-y-4 px-4 pb-6 pt-3">
      {/* 유저 정보 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-4 w-24" />
      </div>

      {/* 플레이리스트 정보 */}
      <div className="space-y-2">
        <Skeleton className="h-5 w-full" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* 액션 버튼 영역 대체 */}
      <div className="flex gap-4">
        <Skeleton className="h-4 w-2/5" />
      </div>
    </section>

    {/* 재생목록 영역 */}
    <section className="border-y border-[#333] py-4">
      <Skeleton className="mb-3 ml-4 h-6 w-24" />
      <div className="scrollbar-hide overflow-x-auto">
        <ul className="flex gap-3 px-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <li key={i} className="w-[150px] flex-shrink-0 space-y-2">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-3/4" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  </div>
);

export default PlaylistSkeleton;
