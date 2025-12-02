import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useInterval } from "./index";

describe("useInterval", () => {
  it("should call the callback repeatedly", () => {
    vi.useFakeTimers();
    const callback = vi.fn();

    renderHook(() => useInterval(callback, 1000));

    // Fast-forward 3 seconds
    vi.advanceTimersByTime(3000);

    // Should be called 3 times
    expect(callback).toHaveBeenCalledTimes(3);
    vi.useRealTimers();
  });

  it("should pause when delay is null", () => {
    vi.useFakeTimers();
    const callback = vi.fn();

    // Pass null as delay
    renderHook(() => useInterval(callback, null));

    vi.advanceTimersByTime(5000);

    expect(callback).not.toHaveBeenCalled();
    vi.useRealTimers();
  });
});
