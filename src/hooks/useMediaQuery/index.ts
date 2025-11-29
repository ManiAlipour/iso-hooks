import { useEffect, useState } from "react";

/**
 * A hook that detects whether a media query matches the current window state.
 * Useful for responsive logic in JS or detecting system theme preferences.
 *
 * @param query The media query string (e.g., '(min-width: 768px)')
 * @returns boolean indicating if the query matches
 */
export function useMediaQuery(query: string): boolean {
  // 1. Initialize with 'false' to ensure consistency between Server (SSR) and Client initial render.
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // 2. Safety check: If window doesn't exist (SSR), do nothing.
    if (typeof window === "undefined") {
      return;
    }

    // 3. Create the MediaQueryList object
    const mediaQueryList = window.matchMedia(query);

    // 4. Update state immediately with the current value on the client
    setMatches(mediaQueryList.matches);

    // 5. Define the listener function
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // 6. Add the listener.
    // NOTE: 'addEventListener' is modern, but older Safari versions used 'addListener'.
    // A robust library should handle both, or target modern browsers.
    // Here we use the modern standard.
    mediaQueryList.addEventListener("change", listener);

    // 7. Cleanup function
    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}
