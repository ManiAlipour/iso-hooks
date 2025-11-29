import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useDebounce } from ".";

describe("useDebounce", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("initial", 500));

    expect(result.current).toBe("initial");
  });

  it("should update value after the specified delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: "initial", delay: 500 },
      }
    );

    rerender({ value: "updated", delay: 500 });

    // 2. Check immediately: Value should NOT happen yet
    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(result.current).toBe("initial");

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("updated");
  });

  it("should reset the timer if value changes within the delay", () => {
    const { result, rerender } = renderHook(
      ({ value }) => useDebounce(value, 500),
      { initialProps: { value: "A" } }
    );

    rerender({ value: "B" });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("A");

    rerender({ value: "C" });

    // Advance another 300ms
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(result.current).toBe("A");

    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(result.current).toBe("C");
  });
});
