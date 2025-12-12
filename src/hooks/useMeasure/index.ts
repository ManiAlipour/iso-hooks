import { useState, useRef, useEffect } from "react";

/**
 * Represents the bounding rectangle of an element.
 * This interface matches the DOMRect structure and provides
 * dimensions and position information relative to the viewport.
 */
export interface RectResult {
  /** Width of the element in pixels */
  width: number;
  /** Height of the element in pixels */
  height: number;
  /** Distance from the top of the viewport to the top of the element */
  top: number;
  /** Distance from the left of the viewport to the left of the element */
  left: number;
  /** Distance from the top of the viewport to the bottom of the rectangle */
  bottom: number;
  /** Distance from the left of the viewport to the right of the rectangle */
  right: number;
  /** Alias for left (according to DOMRect specification) */
  x: number;
  /** Alias for top (according to DOMRect specification) */
  y: number;
}

/**
 * Custom React hook to measure the dimensions and position of an HTML element.
 * 
 * This hook uses ResizeObserver to automatically track changes to an element's
 * size and position. It's SSR-safe and will return default values on the server.
 * 
 * The hook returns a ref that should be attached to the element you want to measure,
 * and a rect object containing the current measurements.
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const [ref, rect] = useMeasure<HTMLDivElement>();
 *   return (
 *     <div ref={ref}>
 *       Size: {rect.width} x {rect.height}
 *     </div>
 *   );
 * };
 * ```
 * 
 * @template T - The type of HTMLElement to be measured (defaults to HTMLElement)
 * @returns An immutable tuple containing [ref, rect] where:
 *   - ref: A React ref to attach to the target element
 *   - rect: The current bounding rectangle measurements
 */
export function useMeasure<T extends HTMLElement = HTMLElement>() {
  // Reference to the target HTML element that will be measured
  const ref = useRef<T>(null);

  // State to store the element's bounding rectangle information
  // Initialized with default values (SSR-safe)
  const [rect, setRect] = useState<RectResult>({
    width: 0,
    height: 0,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    x: 0,
    y: 0,
  });

  useEffect(() => {
    // Early return if ref is not attached to any element
    if (!ref.current) return;

    /**
     * Creates a ResizeObserver to automatically track element size changes.
     * ResizeObserver is more efficient than listening to resize events and
     * provides accurate measurements even when the element is transformed.
     */
    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        // Use entry.contentRect for performance and accuracy
        // contentRect gives the content box size (excluding transforms/borders)
        // toJSON() converts the DOMRect to a plain object with all standard properties
        setRect(entry.contentRect.toJSON());
      }
    });

    // Begin observing the element for size changes
    observer.observe(ref.current);

    // Cleanup: disconnect observer when component unmounts or ref changes
    return () => {
      observer.disconnect();
    };
  }, []);

  // Return the ref (to attach to element) and the latest measured rectangle
  return [ref, rect] as const;
}
