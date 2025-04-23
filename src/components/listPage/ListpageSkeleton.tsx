import { Skeleton } from "@/components/common/skeleton";

const PlaylistCardSkeleton = () => {
  return (
    <li className="cursor-pointer">
      {/* 썸네일 영역*/}
      <Skeleton className="relative w-full pt-[56.25%]" />

      {/* 정보 영역 */}
      <div className="flex flex-row px-4 py-3">
        <Skeleton className="mr-2 h-9 w-9 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-6 w-full rounded" />
          <Skeleton className="mb-[6px] mt-2 h-4 w-2/5" />
        </div>
      </div>
    </li>
  );
};

export const ListPageSkeleton = () => {
  return (
    <div className="animate-fadeIn animate-pulse">
      {/* 페이지 타이틀 영역 */}
      <div className="mb-[16px] ml-[19px] mt-[10px] h-6 w-32">
        <Skeleton className="h-6 w-full rounded" />
      </div>
      {/* 플레이리스트 목록 */}
      <ul>
        {[1, 2, 3].map((index) => (
          <PlaylistCardSkeleton key={index} />
        ))}
      </ul>
    </div>
  );
};
