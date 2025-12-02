import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useScrollLock } from "./index";

describe("useScrollLock", () => {
  beforeEach(() => {
    // Reset body style before each test
    document.body.style.overflow = "";
  });

  it("should lock the body scroll", () => {
    const { result } = renderHook(() => useScrollLock());
    const { lock } = result.current;

    act(() => {
      lock();
    });

    expect(document.body.style.overflow).toBe("hidden");
  });

  it("should unlock the body scroll", () => {
    const { result } = renderHook(() => useScrollLock());
    const { lock, unlock } = result.current;

    // First lock
    act(() => {
      lock();
    });
    expect(document.body.style.overflow).toBe("hidden");

    // Then unlock
    act(() => {
      unlock();
    });
    expect(document.body.style.overflow).toBe("");
  });
});
