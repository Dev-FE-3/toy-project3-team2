import { useState } from "react";

import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

interface UseInfiniteScrollHandlerProps {
  hasMore: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export const useInfiniteScrollHandler = ({ hasMore, isFetchingNextPage, fetchNextPage }: UseInfiniteScrollHandlerProps) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { targetRef } = useInfiniteScroll({
    onIntersect: () => {
      if (hasMore && !isFetchingNextPage && !isLoadingMore) {
        setIsLoadingMore(true);
        setTimeout(() => {
          fetchNextPage();
          setIsLoadingMore(false);
        }, 1000);
      }
    },
  });

  return { targetRef, isLoadingMore };
};
