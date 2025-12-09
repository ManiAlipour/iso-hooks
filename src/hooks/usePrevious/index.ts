import { useRef, useEffect } from "react";

/**
 * usePrevious
 * Returns the previous value of the input.
 *
 * @param value - The value to track
 * @returns The previous value, or undefined on the first render
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined);

  useEffect(() => {
    ref.current = value;
  }, [value]);

  return ref.current;
}
