import { useState, useRef } from 'react';
import { useEventListener } from '../useEventListener';

// Using a generic <T> allows the user to specify the HTML element type (e.g., HTMLDivElement).
// We set a default of HTMLElement for convenience.
export function useHover<T extends HTMLElement = HTMLElement>(): [React.RefObject<T>, boolean] {
  // State to track if the mouse is currently over the element
  const [isHovering, setIsHovering] = useState<boolean>(false);

  // Ref to be attached to the target DOM element.
  // Initialized with null as is standard for React refs.
  const ref = useRef<T>(null);

  // Handler for when the mouse enters the element
  const handleMouseEnter = () => setIsHovering(true);

  // Handler for when the mouse leaves the element
  const handleMouseLeave = () => setIsHovering(false);

  // Attach the 'mouseenter' event listener.
  // 'mouseenter' is preferred over 'mouseover' because it doesn't bubble from children,
  // preventing flickering issues when hovering over child elements.
  useEventListener('mouseenter', handleMouseEnter, ref);

  // Attach the 'mouseleave' event listener.
  useEventListener('mouseleave', handleMouseLeave, ref);

  // Return the ref (to be assigned to the element) and the state
  return [ref, isHovering];
}
