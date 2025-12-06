import { useEffect, useState } from "react";
import type { RefObject } from "react";

interface Args extends IntersectionObserverInit {
  /**
   * If true, the state is updated only once (the first time it is seen)
   * and then the Observer is disconnected. Suitable for input animations.
   * @default false
   */
  freezeOnceVisible?: boolean;
}

/**
 * Hook to track the display state of an element in the viewport
 * @param elementRef A reference to the desired element
 * @param args IntersectionObserver settings + freezeOnceVisible
 * @returns IntersectionObserverEntry object or null (if not yet loaded)
 */
export function useIntersectionObserver(
  elementRef: RefObject<Element>,
  {
    threshold = 0,
    root = null,
    rootMargin = "0%",
    freezeOnceVisible = false,
  }: Args = {}
): IntersectionObserverEntry | undefined {
  const [entry, setEntry] = useState<IntersectionObserverEntry>();

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  const updateEntry = ([entry]: IntersectionObserverEntry[]) => {
    setEntry(entry);
  };

  useEffect(() => {
    const node = elementRef?.current; // DOM Ref
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !node) return;

    const observerParams = { threshold, root, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);

    observer.observe(node);

    return () => observer.disconnect();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    elementRef?.current,
    JSON.stringify(threshold),
    root,
    rootMargin,
    frozen,
  ]);

  return entry;
}
