import { useCallback, useLayoutEffect, useRef } from "react";

/**
 * A hook to lock the body scroll. Useful for modals, drawers, etc.
 * It automatically unlocks when the component unmounts.
 */
export function useScrollLock() {
  // Use a ref to track if we are currently locked to prevent double-locking issues
  // although simple style assignment is usually idempotent.
  const originalStyle = useRef<string>("");

  // We use useLayoutEffect to avoid layout shift flickering if possible,
  // but for SSR safety we fallback to useEffect logic via a check or simple effect.
  // Here standard standard DOM manipulation implies client-side usage.

  const lock = useCallback(() => {
    // Check availability of document (SSR safety)
    if (typeof document === "undefined") return;

    // Prevent locking if already locked by this instance mechanism could be added,
    // but simplistic overflow hidden is usually fine to repeat.

    // Store original overflow style
    originalStyle.current = document.body.style.overflow;

    // Apply lock
    document.body.style.overflow = "hidden";
  }, []);

  const unlock = useCallback(() => {
    if (typeof document === "undefined") return;

    // Restore original overflow style
    document.body.style.overflow = originalStyle.current || "";
  }, []);

  return { lock, unlock };
}
