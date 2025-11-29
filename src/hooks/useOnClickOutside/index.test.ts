import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useOnClickOutside } from ".";

describe("useOnClickOutside", () => {
  let container: HTMLDivElement;
  let outsideElement: HTMLDivElement;

  // Setup DOM elements before each test
  beforeEach(() => {
    // Create a container (representing our modal/dropdown)
    container = document.createElement("div");
    container.setAttribute("id", "inside");
    document.body.appendChild(container);

    // Create an element outside
    outsideElement = document.createElement("div");
    outsideElement.setAttribute("id", "outside");
    document.body.appendChild(outsideElement);
  });

  // Cleanup DOM after each test to keep tests isolated
  afterEach(() => {
    document.body.removeChild(container);
    document.body.removeChild(outsideElement);
  });

  it("should call handler when clicking outside the element", () => {
    const handler = vi.fn(); // Mock function to track calls
    const ref = { current: container }; // Simulate React Ref

    renderHook(() => useOnClickOutside(ref, handler));

    // Simulate click on the OUTSIDE element
    const event = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
    });
    outsideElement.dispatchEvent(event);

    // Assert: Handler SHOULD be called
    expect(handler).toHaveBeenCalledTimes(1);
    // Verify it was called with the event
    expect(handler).toHaveBeenCalledWith(event);
  });

  it("should NOT call handler when clicking inside the element", () => {
    const handler = vi.fn();
    const ref = { current: container };

    renderHook(() => useOnClickOutside(ref, handler));

    // Simulate click INSIDE the container
    const event = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
    });
    container.dispatchEvent(event);

    // Assert: Handler should NOT be called
    expect(handler).not.toHaveBeenCalled();
  });

  it("should NOT call handler when clicking a child of the element", () => {
    const handler = vi.fn();
    const ref = { current: container };

    // Add a child button inside the container
    const insideButton = document.createElement("button");
    container.appendChild(insideButton);

    renderHook(() => useOnClickOutside(ref, handler));

    // Simulate click on the CHILD element
    const event = new MouseEvent("mousedown", {
      bubbles: true,
      cancelable: true,
    });
    insideButton.dispatchEvent(event);

    // Assert: Logic should know child is part of container
    expect(handler).not.toHaveBeenCalled();
  });

  it("should work with touch events (mobile support)", () => {
    const handler = vi.fn();
    const ref = { current: container };

    renderHook(() => useOnClickOutside(ref, handler));

    // Simulate TOUCH on outside element
    const event = new TouchEvent("touchstart", {
      bubbles: true,
      cancelable: true,
    });
    outsideElement.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
