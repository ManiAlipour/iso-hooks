import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useIntersectionObserver } from "./index";

describe("useIntersectionObserver", () => {
  const observe = vi.fn();
  const disconnect = vi.fn();

  let observerCallback: IntersectionObserverCallback;

  beforeEach(() => {
    observe.mockClear();
    disconnect.mockClear();

    class MockIntersectionObserver implements IntersectionObserver {
      readonly root: Element | Document | null = null;
      readonly rootMargin: string = "";
      readonly thresholds: ReadonlyArray<number> = [];

      constructor(
        callback: IntersectionObserverCallback,
        options?: IntersectionObserverInit
      ) {
        observerCallback = callback;
      }

      observe = observe;
      disconnect = disconnect;
      unobserve = vi.fn();
      takeRecords = vi.fn();
    }

    window.IntersectionObserver = MockIntersectionObserver;
  });

  afterEach(() => {
    delete (window as any).IntersectionObserver;
  });

  it("should observe the element", () => {
    const elementRef = { current: document.createElement("div") };

    renderHook(() => useIntersectionObserver(elementRef));

    expect(observe).toHaveBeenCalledWith(elementRef.current);
  });

  it("should update entry when intersection changes", () => {
    const elementRef = { current: document.createElement("div") };
    const { result } = renderHook(() => useIntersectionObserver(elementRef));

    expect(result.current).toBeUndefined();

    const mockEntry = {
      isIntersecting: true,
      intersectionRatio: 1,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      target: elementRef.current,
      time: Date.now(),
    } as IntersectionObserverEntry;

    act(() => {
      observerCallback([mockEntry], {} as IntersectionObserver);
    });

    expect(result.current).toBe(mockEntry);
  });

  it("should stop observing when freezeOnceVisible is true and element is intersecting", () => {
    const elementRef = { current: document.createElement("div") };

    const { rerender } = renderHook(
      ({ freeze }) =>
        useIntersectionObserver(elementRef, { freezeOnceVisible: freeze }),
      { initialProps: { freeze: true } }
    );

    expect(observe).toHaveBeenCalledTimes(1);

    const mockEntry = {
      isIntersecting: true,
      target: elementRef.current,
      intersectionRatio: 1,
      boundingClientRect: {} as DOMRectReadOnly,
      intersectionRect: {} as DOMRectReadOnly,
      rootBounds: null,
      time: Date.now(),
    } as IntersectionObserverEntry;

    act(() => {
      observerCallback([mockEntry], {} as IntersectionObserver);
    });

    rerender({ freeze: true });

    expect(observe).toHaveBeenCalledTimes(1);
  });

  it("should not observe if ref is null", () => {
    const elementRef = { current: null };
    renderHook(() => useIntersectionObserver(elementRef));
    expect(observe).not.toHaveBeenCalled();
  });
});
