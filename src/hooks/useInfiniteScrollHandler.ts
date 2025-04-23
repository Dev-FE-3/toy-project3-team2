import { useState } from "react";

import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

interface UseInfiniteScrollHandlerProps {
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
}

export const useInfiniteScrollHandler = ({ hasNextPage, isFetchingNextPage, fetchNextPage }: UseInfiniteScrollHandlerProps) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { targetRef } = useInfiniteScroll({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage && !isLoadingMore) {
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
