import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCopyToClipboard } from "./index"; // Adjust path if needed

describe("useCopyToClipboard", () => {
  // Store original clipboard to restore after tests
  const originalClipboard = navigator.clipboard;

  beforeEach(() => {
    // Mock the clipboard API
    const mockClipboard = {
      writeText: vi.fn().mockResolvedValue(undefined),
    };

    // Assign mock to navigator
    Object.defineProperty(navigator, "clipboard", {
      value: mockClipboard,
      writable: true,
    });
  });

  afterEach(() => {
    // Restore original clipboard
    Object.defineProperty(navigator, "clipboard", {
      value: originalClipboard,
      writable: true,
    });
    vi.useRealTimers();
  });

  it("should return null as initial state", () => {
    const { result } = renderHook(() => useCopyToClipboard());
    const [copiedText] = result.current;
    expect(copiedText).toBe(null);
  });

  it("should copy text and update state", async () => {
    const { result } = renderHook(() => useCopyToClipboard());

    // Trigger copy
    await act(async () => {
      const [, copy] = result.current;
      await copy("hello world");
    });

    // Check if state is updated
    expect(result.current[0]).toBe("hello world");
    // Verify browser API was called
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("hello world");
  });

  it("should reset state after delay", async () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useCopyToClipboard(2000));

    // Copy text
    await act(async () => {
      const [, copy] = result.current;
      await copy("temp text");
    });

    expect(result.current[0]).toBe("temp text");

    // Fast-forward time by 2000ms
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    // Should be reset to null
    expect(result.current[0]).toBe(null);
  });
});
