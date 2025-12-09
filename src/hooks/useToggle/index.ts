import { useState, useCallback } from "react";

/**
 * useToggle
 * A hook that manages a boolean state with a toggler function.
 *
 * @param defaultValue - The initial boolean value (default: false)
 * @returns A tuple containing the current state and the toggle function.
 */
export function useToggle(
  defaultValue: boolean = false
): [boolean, (value?: boolean) => void] {
  const [state, setState] = useState(defaultValue);

  // Define the toggle function using useCallback to maintain referential equality
  const toggle = useCallback((value?: boolean) => {
    setState((current) => {
      // If a boolean value is explicitly passed, set it to that value.
      // Otherwise (if undefined or an event object from onClick), toggle the current state.
      return typeof value === "boolean" ? value : !current;
    });
  }, []);

  return [state, toggle];
}
