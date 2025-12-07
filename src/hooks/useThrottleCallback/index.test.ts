import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useThrottleCallback } from ".";

describe("useThrottleCallback (lodash-style)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("should trigger leading call immediately", () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useThrottleCallback(fn, 200));

    act(() => {
      result.current("A");
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("A");
  });

  it("should throttle intermediate calls and trigger trailing call once", () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useThrottleCallback(fn, 200));

    act(() => {
      result.current("A"); // leading
      result.current("B"); // throttled
      result.current("C"); // throttled (last one saved)
    });

    // Only leading call executed initially
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("A");

    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Trailing call executed once with last args
    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith("C");
  });

  it("should handle multiple throttle cycles correctly", () => {
    const fn = vi.fn();
    const { result } = renderHook(() => useThrottleCallback(fn, 100));

    act(() => {
      result.current("A");
      result.current("B");
    });

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith("A");

    act(() => vi.advanceTimersByTime(100));

    expect(fn).toHaveBeenCalledTimes(2);
    expect(fn).toHaveBeenLastCalledWith("B");

    // Second round
    act(() => {
      result.current("C");
      result.current("D");
    });

    expect(fn).toHaveBeenCalledTimes(3);
    expect(fn).toHaveBeenLastCalledWith("C");

    act(() => vi.advanceTimersByTime(100));

    expect(fn).toHaveBeenCalledTimes(4);
    expect(fn).toHaveBeenLastCalledWith("D");
  });
});
