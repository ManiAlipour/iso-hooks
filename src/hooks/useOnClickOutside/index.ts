import { useEffect, type RefObject } from "react";

type EventType = MouseEvent | TouchEvent;

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T>,
  handler: (event: EventType) => void,
  eventType: "mousedown" | "mouseup" = "mousedown"
): void {
  useEffect(() => {
    const listener = (event: EventType) => {
      const el = ref.current;

      // Do nothing if clicking ref's element or descendent elements
      if (!el || el.contains(event.target as Node)) {
        return;
      }

      handler(event);
    };

    document.addEventListener(eventType, listener);
    document.addEventListener("touchstart", listener); // Handle mobile touch

    return () => {
      document.removeEventListener(eventType, listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, eventType]);
}
