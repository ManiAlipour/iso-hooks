import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useTimeout } from "./index";

describe("useTimeout", () => {
  it("should call the callback after the specified delay", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const delay = 1000;

    renderHook(() => useTimeout(callback, delay));

    expect(callback).not.toHaveBeenCalled();

    // Fast-forward time
    vi.advanceTimersByTime(delay);

    expect(callback).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it("should stop if delay is null", () => {
    vi.useFakeTimers();
    const callback = vi.fn();

    renderHook(() => useTimeout(callback, null));

    vi.advanceTimersByTime(5000);
    expect(callback).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("should clear the timeout manually", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const delay = 1000;

    const { result } = renderHook(() => useTimeout(callback, delay));

    // Clear it immediately
    result.current.clear();

    vi.advanceTimersByTime(delay);
    expect(callback).not.toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("should reset the timeout", () => {
    vi.useFakeTimers();
    const callback = vi.fn();
    const delay = 1000;

    const { result } = renderHook(() => useTimeout(callback, delay));

    // Move forward 500ms (halfway)
    vi.advanceTimersByTime(500);

    // Reset timer
    result.current.reset();

    // Move forward another 500ms (total 1000ms from start)
    vi.advanceTimersByTime(500);
    // Should NOT have triggered yet because we reset it
    expect(callback).not.toHaveBeenCalled();

    // Move forward another 500ms (total 1000ms from reset)
    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });
});
