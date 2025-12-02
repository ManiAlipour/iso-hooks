import { useEffect, useRef } from "react";

/**
 * A custom hook that sets up an interval that can access the latest state/props
 * without resetting the timer on every render.
 *
 * @param callback The function to be called every 'delay' milliseconds.
 * @param delay The delay in milliseconds. Pass null to pause the interval.
 */

export function useInterval(callback: () => void, delay: number | null) {
  // Keep a ref to the latest callback to avoid stale closures
  const savedCallback = useRef(callback);

  // Update the ref each render so if the callback logic changes
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    // Don't schedule if delay is null (pausing feature)
    if (delay === null) {
      return;
    }

    const id = setInterval(() => {
      savedCallback.current();
    }, delay);

    // Cleanup the interval on unmount or delay change
    return () => clearInterval(id);
  }, [delay]);
}
