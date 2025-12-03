import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useEventListener } from "./index";

describe("useEventListener", () => {
  it("should bind event listener to window by default", () => {
    const handler = vi.fn();

    renderHook(() => useEventListener("click", handler));

    // Simulate a click on the window
    window.dispatchEvent(new Event("click"));

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should bind event listener to a specific element", () => {
    const handler = vi.fn();
    const div = document.createElement("div");

    renderHook(() => useEventListener("click", handler, div));

    // Dispatch event on the div
    div.dispatchEvent(new Event("click"));
    // Dispatch event on window (should NOT trigger handler)
    window.dispatchEvent(new Event("click"));

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it("should update the handler without re-binding the listener", () => {
    let count = 0;
    // First handler increments by 1
    const { rerender } = renderHook(
      ({ handler }) => useEventListener("click", handler),
      {
        initialProps: {
          handler: () => {
            count += 1;
          },
        },
      }
    );

    window.dispatchEvent(new Event("click"));
    expect(count).toBe(1);

    // Rerender with new handler that increments by 10
    rerender({
      handler: () => {
        count += 10;
      },
    });

    window.dispatchEvent(new Event("click"));
    // Should be 1 + 10 = 11.
    // If the ref pattern wasn't working, it might have used the old closure
    expect(count).toBe(11);
  });

  it("should clean up the event listener on unmount", () => {
    const handler = vi.fn();
    const { unmount } = renderHook(() => useEventListener("click", handler));

    // Trigger once
    window.dispatchEvent(new Event("click"));
    expect(handler).toHaveBeenCalledTimes(1);

    // Unmount hook
    unmount();

    // Trigger again (should not call handler)
    window.dispatchEvent(new Event("click"));
    expect(handler).toHaveBeenCalledTimes(1); // Still 1
  });
});
