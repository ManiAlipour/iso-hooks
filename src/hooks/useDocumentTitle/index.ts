import { useRef } from "react";
import { useIsomorphicLayoutEffect } from "../useIsomorphicLayoutEffect";

/**
 * Custom React hook to update the document's title dynamically.
 * 
 * This hook is SSR-safe and automatically restores the original document title
 * when the component unmounts. It's useful for updating page titles based on
 * component state or route changes.
 * 
 * The hook stores the original title on first render and restores it on cleanup,
 * preventing title pollution when components mount/unmount.
 * 
 * @example
 * ```tsx
 * const MyPage = () => {
 *   const [count, setCount] = useState(0);
 *   useDocumentTitle(`Count: ${count}`);
 *   return <button onClick={() => setCount(c => c + 1)}>Increment</button>;
 * };
 * ```
 * 
 * @param title - The new title to set for the document. Can be a string or template literal.
 */
function useDocumentTitle(title: string): void {
  // Use a ref to store the original document title
  // This ref persists for the full lifetime of the component and allows us
  // to restore the original title when the component unmounts
  const originalTitle = useRef<string>();

  useIsomorphicLayoutEffect(() => {
    // SSR safety check: document is not available on the server
    // useIsomorphicLayoutEffect already handles SSR fallback, but this check
    // makes the intent explicit and adds an extra layer of safety
    if (typeof document === "undefined") {
      return;
    }

    // Store the original title on first render only
    // This happens once when the component mounts, before we change the title
    if (originalTitle.current === undefined) {
      originalTitle.current = document.title;
    }

    // Update the document title to the new value
    document.title = title;

    // Cleanup function: runs when component unmounts or before effect runs again
    // This restores the original title to prevent title pollution
    return () => {
      // Only restore if we have a stored original title and we're on the client
      if (originalTitle.current !== undefined) {
        document.title = originalTitle.current;
      }
    };
  }, [title]); // Re-run the effect whenever the title changes
}

export { useDocumentTitle };
