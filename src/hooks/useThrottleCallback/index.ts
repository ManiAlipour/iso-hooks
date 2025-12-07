import { useCallback, useRef } from "react";

/**
 * A throttle hook that limits the invocation of a callback to at most once per `delay` milliseconds.
 * Calls during the throttle window save only the latest arguments and execute that once at the end.
 * Behavior matches lodash's throttle (with leading and trailing).
 */
export function useThrottleCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
) {
  // Holds the latest version of the callback to avoid stale closures
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  // Timestamp of the last actual execution
  const lastExecTime = useRef(0);

  // Stores the timer id for trailing edge scheduling
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Holds arguments for the trailing call (keeps only the latest)
  const trailingArgs = useRef<any[] | null>(null);

  /**
   * The throttled function to return
   */
  const throttled = useCallback(
    (...args: any[]) => {
      const now = Date.now();
      const elapsed = now - lastExecTime.current;

      // If enough time has passed since last execution: execute immediately (leading edge)
      if (elapsed >= delay) {
        // If there’s a pending timer (rare case), clear it, as we prefer immediate execution
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }

        callbackRef.current(...args); // Immediate call
        lastExecTime.current = now;   // Update execution time
      } else {
        // Not enough time: set up a trailing call with the latest arguments
        trailingArgs.current = args;

        // Only set a timer if one does not exist already
        if (!timeoutRef.current) {
          const remaining = delay - elapsed;

          timeoutRef.current = setTimeout(() => {
            timeoutRef.current = null;

            // Call the callback with the latest saved arguments (trailing edge)
            if (trailingArgs.current) {
              callbackRef.current(...trailingArgs.current);
              trailingArgs.current = null;

              /**
               * Key behavior for correct throttling:
               * We do NOT update lastExecTime here!
               * This allows, if a call comes in right after this trailing call,
               * for enough time to have elapsed and a new leading call to fire immediately.
               */
            }
          }, remaining);
        }
      }
    },
    [delay]
  );

  return throttled as T;
}
