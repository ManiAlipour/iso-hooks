import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useUpdateEffect } from ".";

describe("useUpdateEffect", () => {
  it("should not run the effect on the first render", () => {
    const effect = vi.fn();

    // Render the hook with no dependencies initially or just an empty array/dummy dep
    renderHook(() => useUpdateEffect(effect, []));

    // It must NOT be called immediately
    expect(effect).not.toHaveBeenCalled();
  });

  it("should run the effect only on subsequent updates", () => {
    const effect = vi.fn();

    // We pass a 'dependency' to the hook so we can change it later
    const { rerender } = renderHook(
      ({ dep }) => useUpdateEffect(effect, [dep]),
      { initialProps: { dep: 1 } }
    );

    // 1. Initial render check again
    expect(effect).not.toHaveBeenCalled();

    // 2. Update the dependency (force a re-render)
    rerender({ dep: 2 });

    // 3. Now it SHOULD run
    expect(effect).toHaveBeenCalledTimes(1);

    // 4. Update again
    rerender({ dep: 3 });
    expect(effect).toHaveBeenCalledTimes(2);
  });

  it("should run the cleanup function on unmount or dependency change", () => {
    const cleanup = vi.fn();
    const effect = vi.fn().mockReturnValue(cleanup);

    const { rerender, unmount } = renderHook(
      ({ dep }) => useUpdateEffect(effect, [dep]),
      { initialProps: { dep: 1 } }
    );

    // Trigger update to attach the effect and its cleanup
    rerender({ dep: 2 });
    expect(effect).toHaveBeenCalledTimes(1);

    // Trigger another update -> should run cleanup of the previous run
    rerender({ dep: 3 });
    expect(cleanup).toHaveBeenCalledTimes(1);

    // Unmount -> should run cleanup again
    unmount();
    expect(cleanup).toHaveBeenCalledTimes(2);
  });
});
