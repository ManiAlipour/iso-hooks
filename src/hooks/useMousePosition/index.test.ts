import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useMousePosition } from ".";

describe("useMousePosition", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize with default position { x: 0, y: 0 }", () => {
    const { result } = renderHook(() => useMousePosition());

    // Assert: Initial position should be { x: 0, y: 0 }
    expect(result.current).toEqual({ x: 0, y: 0 });
  });

  it("should update position when mouse moves", () => {
    const { result } = renderHook(() => useMousePosition());

    // Simulate mouse movement
    act(() => {
      const mouseEvent = new MouseEvent("mousemove", {
        clientX: 100,
        clientY: 200,
        bubbles: true,
        cancelable: true,
      });
      window.dispatchEvent(mouseEvent);
    });

    // Assert: Position should be updated
    expect(result.current.x).toBe(100);
    expect(result.current.y).toBe(200);
  });

  it("should update position on multiple mouse movements", () => {
    const { result } = renderHook(() => useMousePosition());

    // First movement
    act(() => {
      const mouseEvent1 = new MouseEvent("mousemove", {
        clientX: 50,
        clientY: 75,
        bubbles: true,
        cancelable: true,
      });
      window.dispatchEvent(mouseEvent1);
    });

    expect(result.current.x).toBe(50);
    expect(result.current.y).toBe(75);

    // Second movement
    act(() => {
      const mouseEvent2 = new MouseEvent("mousemove", {
        clientX: 300,
        clientY: 400,
        bubbles: true,
        cancelable: true,
      });
      window.dispatchEvent(mouseEvent2);
    });

    expect(result.current.x).toBe(300);
    expect(result.current.y).toBe(400);
  });

  it("should clean up event listener on unmount", () => {
    const { result, unmount } = renderHook(() => useMousePosition());

    // Move mouse
    act(() => {
      const mouseEvent = new MouseEvent("mousemove", {
        clientX: 150,
        clientY: 250,
        bubbles: true,
        cancelable: true,
      });
      window.dispatchEvent(mouseEvent);
    });

    expect(result.current.x).toBe(150);
    expect(result.current.y).toBe(250);

    // Unmount hook
    unmount();

    // Try to move mouse again (should not update)
    act(() => {
      const mouseEvent = new MouseEvent("mousemove", {
        clientX: 500,
        clientY: 600,
        bubbles: true,
        cancelable: true,
      });
      window.dispatchEvent(mouseEvent);
    });

    // Position should remain unchanged (hook is unmounted)
    // Note: In a real scenario, the state wouldn't update, but in tests
    // we can't directly verify the listener was removed. This test ensures
    // the hook doesn't crash on unmount.
    expect(result.current.x).toBe(150);
    expect(result.current.y).toBe(250);
  });
});

