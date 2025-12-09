import { renderHook, act, fireEvent } from "@testing-library/react"; // FIX: All imports from 'react'
import { describe, it, expect } from "vitest";
import { useKeyPress } from ".";

describe("useKeyPress", () => {
  it("should return false initially", () => {
    const { result } = renderHook(() => useKeyPress("Enter"));
    expect(result.current).toBe(false);
  });

  it("should return true when target key is pressed and false when released", () => {
    const { result } = renderHook(() => useKeyPress("Escape"));

    // 1. Simulate pressing the target key (keydown)
    // We wrap strictly in act to handle the state update inside the hook
    act(() => {
      fireEvent.keyDown(window, { key: "Escape" });
    });

    // Should be true now
    expect(result.current).toBe(true);

    // 2. Simulate releasing the target key (keyup)
    act(() => {
      fireEvent.keyUp(window, { key: "Escape" });
    });

    // Should be false now
    expect(result.current).toBe(false);
  });

  it("should ignore keys other than the target key", () => {
    const { result } = renderHook(() => useKeyPress("Enter"));

    // Simulate pressing a DIFFERENT key (e.g., 'a')
    act(() => {
      fireEvent.keyDown(window, { key: "a" });
    });

    // Should still be false because 'a' !== 'Enter'
    expect(result.current).toBe(false);

    // Release 'a'
    act(() => {
      fireEvent.keyUp(window, { key: "a" });
    });

    expect(result.current).toBe(false);
  });

  it("should respond to dynamic target key changes", () => {
    const { result, rerender } = renderHook(({ key }) => useKeyPress(key), {
      initialProps: { key: "Enter" },
    });

    // Press Enter -> true
    act(() => {
      fireEvent.keyDown(window, { key: "Enter" });
    });
    expect(result.current).toBe(true);

    // Release Enter
    act(() => {
      fireEvent.keyUp(window, { key: "Enter" });
    });

    // Change target key to 'Space'
    // rerender is already wrapped in act by default in testing-library/react
    rerender({ key: " " });

    // Press Enter again -> should remain false (because target is now Space)
    act(() => {
      fireEvent.keyDown(window, { key: "Enter" });
    });
    expect(result.current).toBe(false);

    // Press Space -> should be true
    act(() => {
      fireEvent.keyDown(window, { key: " " });
    });
    expect(result.current).toBe(true);
  });
});
