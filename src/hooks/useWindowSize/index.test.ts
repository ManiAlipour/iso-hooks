import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useWindowSize } from "./index";

describe("useWindowSize", () => {
  it("should initialize and immediately calculate window size on the client", () => {
    const { result } = renderHook(() => useWindowSize());

    // So we expect NUMBERS, not undefined.
    expect(result.current.width).toEqual(expect.any(Number));
    expect(result.current.height).toEqual(expect.any(Number));

    // Specifically for Happy-DOM default:
    // expect(result.current.width).toBe(1024);
  });

  it("should update the size when window is resized", () => {
    const { result } = renderHook(() => useWindowSize());

    // Simulate a window resize event
    act(() => {
      // 1. Change the dimensions directly on window
      window.innerWidth = 500;
      window.innerHeight = 800;

      // 2. Dispatch the resize event
      window.dispatchEvent(new Event("resize"));
    });

    // Verify the hook updated its state
    expect(result.current.width).toBe(500);
    expect(result.current.height).toBe(800);
  });
});
