import { useState, useEffect } from "react";

/**
 * Detects when the user is pressing a specific key.
 * @param targetKey The key to monitor (e.g., "Escape", "Enter", "ArrowUp", "a")
 * @returns boolean: true if the key is currently pressed, false otherwise.
 */
export function useKeyPress(targetKey: string): boolean {
  // State for keeping track of whether key is pressed
  const [keyPressed, setKeyPressed] = useState(false);

  useEffect(() => {
    // If pressed key is our target key then set to true
    const downHandler = ({ key }: KeyboardEvent) => {
      if (key === targetKey) {
        setKeyPressed(true);
      }
    };

    // If released key is our target key then set to false
    const upHandler = ({ key }: KeyboardEvent) => {
      if (key === targetKey) {
        setKeyPressed(false);
      }
    };

    // Add event listeners
    window.addEventListener("keydown", downHandler);
    window.addEventListener("keyup", upHandler);

    // Remove event listeners on cleanup
    return () => {
      window.removeEventListener("keydown", downHandler);
      window.removeEventListener("keyup", upHandler);
    };
  }, [targetKey]); // Empty array would ensure that effect is only run on mount and unmount

  return keyPressed;
}
