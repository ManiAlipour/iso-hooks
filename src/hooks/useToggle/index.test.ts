import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useToggle } from ".";

describe("useToggle", () => {
  it("should initialize with default value (false)", () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current[0]).toBe(false);
  });

  it("should initialize with provided value", () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current[0]).toBe(true);
  });

  it("should toggle state when called without arguments", () => {
    const { result } = renderHook(() => useToggle(false));

    // First toggle: false -> true
    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(true);

    // Second toggle: true -> false
    act(() => {
      result.current[1]();
    });
    expect(result.current[0]).toBe(false);
  });

  it("should set state directly when a boolean is passed", () => {
    const { result } = renderHook(() => useToggle(false));

    // Force true
    act(() => {
      result.current[1](true);
    });
    expect(result.current[0]).toBe(true);

    // Force true again (should stay true)
    act(() => {
      result.current[1](true);
    });
    expect(result.current[0]).toBe(true);

    // Force false
    act(() => {
      result.current[1](false);
    });
    expect(result.current[0]).toBe(false);
  });

  it("should ignore non-boolean arguments (like click events) and just toggle", () => {
    // This simulates: <button onClick={toggle}>
    const { result } = renderHook(() => useToggle(false));

    act(() => {
      // Passing "any" to simulate an event object
      result.current[1]({ type: "click" } as any);
    });
    expect(result.current[0]).toBe(true);
  });
});
