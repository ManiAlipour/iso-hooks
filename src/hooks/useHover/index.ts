import { useState, useRef } from 'react';
import { useEventListener } from '../useEventListener';

/**
 * Custom React hook to detect when an element is being hovered.
 * 
 * This hook tracks mouse enter/leave events on a target element and returns
 * a boolean indicating whether the element is currently being hovered.
 * 
 * The hook uses 'mouseenter' and 'mouseleave' events instead of 'mouseover'
 * and 'mouseout' to prevent flickering when hovering over child elements,
 * as these events don't bubble from child elements.
 * 
 * @example
 * ```tsx
 * const HoverableComponent = () => {
 *   const [ref, isHovered] = useHover<HTMLDivElement>();
 *   return (
 *     <div ref={ref} style={{ background: isHovered ? 'blue' : 'red' }}>
 *       {isHovered ? 'Hovering!' : 'Hover over me'}
 *     </div>
 *   );
 * };
 * ```
 * 
 * @template T - The type of HTML element to attach the hover detection to (defaults to HTMLElement)
 * @returns A tuple containing:
 *   - ref: A React ref object to attach to the target element
 *   - isHovered: A boolean indicating whether the element is currently being hovered
 */
export function useHover<T extends HTMLElement = HTMLElement>(): [React.RefObject<T>, boolean] {
  // State to track if the mouse is currently over the element
  const [isHovering, setIsHovering] = useState<boolean>(false);

  // Ref to be attached to the target DOM element
  // Initialized with null as is standard for React refs
  const ref = useRef<T>(null);

  /**
   * Handler for when the mouse enters the element.
   * Sets the hovering state to true.
   */
  const handleMouseEnter = () => setIsHovering(true);

  /**
   * Handler for when the mouse leaves the element.
   * Sets the hovering state to false.
   */
  const handleMouseLeave = () => setIsHovering(false);

  // Attach the 'mouseenter' event listener
  // 'mouseenter' is preferred over 'mouseover' because it doesn't bubble from children,
  // preventing flickering issues when hovering over child elements
  useEventListener('mouseenter', handleMouseEnter, ref);

  // Attach the 'mouseleave' event listener
  // 'mouseleave' is preferred over 'mouseout' for the same reason
  useEventListener('mouseleave', handleMouseLeave, ref);

  // Return the ref (to be assigned to the element) and the hovering state
  return [ref, isHovering];
}
