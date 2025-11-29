import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useLocalStorage } from ".";

// Clear localStorage before each test to ensure isolation
beforeEach(() => {
  window.localStorage.clear();
  vi.clearAllMocks();
});

describe("useLocalStorage Hook", () => {
  it("should return the initial value when localStorage is empty", () => {
    // Setup: Render the hook with a key and initial value
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    // Assert: The returned value should be 'initial'
    expect(result.current[0]).toBe("initial");
  });

  it("should update the state and localStorage when setValue is called", () => {
    const { result } = renderHook(() => useLocalStorage("test-key", "initial"));

    // Action: Update the value using the setter function
    // We must wrap state updates in act(...)
    act(() => {
      result.current[1]("new-value");
    });

    // Assert: State should update
    expect(result.current[0]).toBe("new-value");

    // Assert: localStorage should maintain the value
    expect(window.localStorage.getItem("test-key")).toBe(
      JSON.stringify("new-value")
    );
  });

  it("should read existing value from localStorage on initialization", () => {
    // Setup: Pre-fill localStorage
    window.localStorage.setItem("existing-key", JSON.stringify("stored-value"));

    const { result } = renderHook(() =>
      useLocalStorage("existing-key", "initial")
    );

    // Assert: Should ignore initial value and read from storage
    expect(result.current[0]).toBe("stored-value");
  });

  it("should sync state across multiple hooks sharing the same key", () => {
    // Setup: Render the hook twice (simulating two components using the same hook)
    const { result: resultA } = renderHook(() =>
      useLocalStorage("shared-key", "initial")
    );
    const { result: resultB } = renderHook(() =>
      useLocalStorage("shared-key", "initial")
    );

    // Action: Update value in Hook A
    act(() => {
      resultA.current[1]("updated-by-A");
    });

    // Assert: Hook A should update
    expect(resultA.current[0]).toBe("updated-by-A");

    // Assert: Hook B should AUTOMATICALLY update (Magic of useSyncExternalStore + CustomEvent)
    expect(resultB.current[0]).toBe("updated-by-A");
  });

  it("should handle functional updates correctly", () => {
    const { result } = renderHook(() => useLocalStorage("count-key", 10));

    // Action: Update using a function (prev => prev + 1)
    act(() => {
      result.current[1]((prev) => prev + 5);
    });

    // Assert: 10 + 5 = 15
    expect(result.current[0]).toBe(15);
  });
});
