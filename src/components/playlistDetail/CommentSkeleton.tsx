import { Skeleton } from "../common/skeleton";

export function CommentSkeleton() {
  return (
    <section>
      {/* 댓글 영역 */}
      <Skeleton className="mb-3 h-6 w-20" />
      <div className="flex gap-3">
        <Skeleton className="h-6 w-6 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </section>
  );
}

export default CommentSkeleton;
