import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { usePrevious } from ".";

describe("usePrevious", () => {
  it("should return undefined on initial render", () => {
    // Test initial state with a number
    const { result } = renderHook(() => usePrevious(0));

    expect(result.current).toBeUndefined();
  });

  it("should return the previous value after update", () => {
    // Initialize hook with value 0
    const { result, rerender } = renderHook(({ val }) => usePrevious(val), {
      initialProps: { val: 0 },
    });

    // 1. First render: should be undefined
    expect(result.current).toBeUndefined();

    // 2. Update value to 1
    rerender({ val: 1 });
    // Expect previous value to be 0
    expect(result.current).toBe(0);

    // 3. Update value to 2
    rerender({ val: 2 });
    // Expect previous value to be 1
    expect(result.current).toBe(1);

    // 4. Update value to 3
    rerender({ val: 3 });
    // Expect previous value to be 2
    expect(result.current).toBe(2);
  });

  it("should work with complex types (objects)", () => {
    const initialObj = { id: 1 };
    const nextObj = { id: 2 };

    const { result, rerender } = renderHook(({ val }) => usePrevious(val), {
      initialProps: { val: initialObj },
    });

    expect(result.current).toBeUndefined();

    rerender({ val: nextObj });
    // Checks reference equality
    expect(result.current).toBe(initialObj);
  });
});
