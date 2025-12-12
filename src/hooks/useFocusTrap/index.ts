import { useEffect, RefObject } from "react";

/**
 * Custom React hook to trap keyboard focus within a specific element.
 * 
 * This hook is essential for accessibility in modals, dialogs, and other components
 * where you want to prevent the user from tabbing outside of the component.
 * It ensures that keyboard navigation (Tab/Shift+Tab) cycles only within the trapped element.
 * 
 * When Tab is pressed on the last focusable element, focus moves to the first.
 * When Shift+Tab is pressed on the first focusable element, focus moves to the last.
 * 
 * @example
 * ```tsx
 * const Modal = () => {
 *   const modalRef = useRef<HTMLDivElement>(null);
 *   useFocusTrap(modalRef, true);
 *   return <div ref={modalRef}>...</div>;
 * };
 * ```
 * 
 * @template T - The type of HTML element to trap focus within
 * @param ref - A React ref object pointing to the element that should trap focus
 * @param enabled - Whether the focus trap is enabled (default: true). When false, the trap is disabled
 */
export function useFocusTrap<T extends HTMLElement>(
  ref: RefObject<T>,
  enabled: boolean = true
): void {
  useEffect(() => {
    // Early return if trap is disabled or ref is not attached
    if (!enabled || !ref.current) {
      return;
    }

    const element = ref.current;

    /**
     * Retrieves all focusable elements within the container.
     * Focusable elements include: links, buttons, form inputs, and elements with tabindex >= 0.
     * 
     * @returns Array of focusable HTMLElements within the container
     */
    const getFocusableElements = (): HTMLElement[] => {
      // CSS selectors for common focusable elements
      const focusableSelectors = [
        'a[href]',                      // Links with href
        'button:not([disabled])',      // Enabled buttons
        'textarea:not([disabled])',    // Enabled textareas
        'input:not([disabled])',       // Enabled inputs
        'select:not([disabled])',      // Enabled selects
        '[tabindex]:not([tabindex="-1"])', // Elements with non-negative tabindex
      ].join(', ');

      return Array.from(
        element.querySelectorAll<HTMLElement>(focusableSelectors)
      ).filter(
        (el) =>
          el.offsetParent !== null && // Element is visible (not hidden)
          !el.hasAttribute('disabled') && // Element is not disabled
          el.tabIndex >= 0 // Element has a valid tabindex
      );
    };

    /**
     * Handles keyboard events to implement focus trapping.
     * Only processes Tab key presses, ignoring all other keys.
     */
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle Tab key presses
      if (event.key !== 'Tab') {
        return;
      }

      const focusableElements = getFocusableElements();

      // If no focusable elements exist, prevent default Tab behavior
      if (focusableElements.length === 0) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      // Handle Shift+Tab (backward navigation)
      if (event.shiftKey) {
        // If focus is on the first element, wrap to the last
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Handle Tab (forward navigation)
        // If focus is on the last element, wrap to the first
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Automatically focus the first focusable element when trap is activated
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    // Attach keyboard event listener to the container element
    element.addEventListener('keydown', handleKeyDown);

    // Cleanup: remove event listener when component unmounts or dependencies change
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [ref, enabled]);
}

