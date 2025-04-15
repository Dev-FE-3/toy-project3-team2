import { useCallback, useRef } from "react";

interface UseInfiniteScrollProps {
  onIntersect: () => void;
  root?: Element | null;
  rootMargin?: string;
  threshold?: number;
}

export const useInfiniteScroll = ({
  onIntersect,
  root = null,
  rootMargin = "0px",
  threshold = 0.5,
}: UseInfiniteScrollProps) => {
  const targetRef = useRef<HTMLDivElement>(null);

  const handleIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting) {
        onIntersect();
      }
    },
    [onIntersect],
  );

  const observer = useRef<IntersectionObserver | null>(null);

  const setTarget = useCallback(
    (node: HTMLDivElement | null) => {
      if (observer.current) {
        observer.current.disconnect();
      }

      if (node) {
        observer.current = new IntersectionObserver(handleIntersect, {
          root,
          rootMargin,
          threshold,
        });
        observer.current.observe(node);
      }

      targetRef.current = node;
    },
    [handleIntersect, root, rootMargin, threshold],
  );

  return { targetRef: setTarget };
};
