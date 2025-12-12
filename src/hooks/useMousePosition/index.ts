import { useState, useEffect } from "react";

/**
 * Represents the mouse position in the viewport.
 * Coordinates are relative to the viewport (not the document).
 */
export interface MousePosition {
  /** X coordinate relative to the viewport (clientX) */
  x: number;
  /** Y coordinate relative to the viewport (clientY) */
  y: number;
}

/**
 * Custom React hook to track the mouse position within the viewport.
 * Returns the current mouse coordinates, updated in real-time as the mouse moves.
 * 
 * This hook is SSR-safe and will return { x: 0, y: 0 } on the server.
 * On the client, it tracks mouse movements using the 'mousemove' event.
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { x, y } = useMousePosition();
 *   return <div>Mouse: {x}, {y}</div>;
 * };
 * ```
 * 
 * @returns The current mouse position object with x and y coordinates
 */
export function useMousePosition(): MousePosition {
  // Initialize state with default position (SSR-safe)
  const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    // Only run on the client side (SSR safety check)
    if (typeof window === "undefined") {
      return;
    }

    /**
     * Event handler that updates the mouse position state
     * Uses clientX and clientY which are relative to the viewport
     */
    const updatePosition = (event: MouseEvent) => {
      setPosition({
        x: event.clientX,
        y: event.clientY,
      });
    };

    // Attach event listener to window for global mouse tracking
    window.addEventListener("mousemove", updatePosition);

    // Cleanup: remove event listener when component unmounts
    return () => {
      window.removeEventListener("mousemove", updatePosition);
    };
  }, []);

  return position;
}

