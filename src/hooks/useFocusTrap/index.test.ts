import { renderHook } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useFocusTrap } from ".";

describe("useFocusTrap", () => {
  let container: HTMLDivElement;
  let button1: HTMLButtonElement;
  let button2: HTMLButtonElement;
  let button3: HTMLButtonElement;
  let outsideButton: HTMLButtonElement;

  // Setup DOM elements before each test
  beforeEach(() => {
    // Create container with focusable elements
    container = document.createElement("div");
    container.setAttribute("id", "trap-container");

    button1 = document.createElement("button");
    button1.textContent = "Button 1";
    button1.setAttribute("tabindex", "0");

    button2 = document.createElement("button");
    button2.textContent = "Button 2";
    button2.setAttribute("tabindex", "0");

    button3 = document.createElement("button");
    button3.textContent = "Button 3";
    button3.setAttribute("tabindex", "0");

    container.appendChild(button1);
    container.appendChild(button2);
    container.appendChild(button3);

    // Create an element outside the container
    outsideButton = document.createElement("button");
    outsideButton.textContent = "Outside Button";
    outsideButton.setAttribute("tabindex", "0");

    document.body.appendChild(container);
    document.body.appendChild(outsideButton);
  });

  // Cleanup DOM after each test
  afterEach(() => {
    if (container.parentNode) {
      document.body.removeChild(container);
    }
    if (outsideButton.parentNode) {
      document.body.removeChild(outsideButton);
    }
  });

  it("should focus the first focusable element when trap is activated", () => {
    const ref = { current: container };

    renderHook(() => useFocusTrap(ref, true));

    // Assert: First button should be focused
    expect(document.activeElement).toBe(button1);
  });

  it("should trap focus when Tab is pressed on the last element", () => {
    const ref = { current: container };

    renderHook(() => useFocusTrap(ref, true));

    // Focus the last button
    button3.focus();
    expect(document.activeElement).toBe(button3);

    // Simulate Tab key press
    const tabEvent = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });

    const preventDefaultSpy = vi.spyOn(tabEvent, "preventDefault");
    button3.dispatchEvent(tabEvent);

    // Assert: Event should be prevented and focus should move to first element
    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(document.activeElement).toBe(button1);
  });

  it("should trap focus when Shift+Tab is pressed on the first element", () => {
    const ref = { current: container };

    renderHook(() => useFocusTrap(ref, true));

    // Focus the first button
    button1.focus();
    expect(document.activeElement).toBe(button1);

    // Simulate Shift+Tab key press
    const shiftTabEvent = new KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });

    const preventDefaultSpy = vi.spyOn(shiftTabEvent, "preventDefault");
    button1.dispatchEvent(shiftTabEvent);

    // Assert: Event should be prevented and focus should move to last element
    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(document.activeElement).toBe(button3);
  });

  it("should allow normal Tab navigation between elements", () => {
    const ref = { current: container };

    renderHook(() => useFocusTrap(ref, true));

    // Focus the first button
    button1.focus();

    // Simulate Tab key press (should move to next element)
    const tabEvent = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });

    button1.dispatchEvent(tabEvent);

    // Note: In a real browser, Tab would move focus, but in tests
    // we need to manually focus. The important thing is that preventDefault
    // is NOT called when not on first/last element.
    const preventDefaultSpy = vi.spyOn(tabEvent, "preventDefault");
    button2.dispatchEvent(tabEvent);
    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });

  it("should not trap focus when disabled", () => {
    const ref = { current: container };

    renderHook(() => useFocusTrap(ref, false));

    // Assert: No element should be auto-focused
    // (focus might be on body or null)
    expect(document.activeElement).not.toBe(button1);
  });

  it("should handle container with no focusable elements", () => {
    const emptyContainer = document.createElement("div");
    emptyContainer.setAttribute("id", "empty-container");
    document.body.appendChild(emptyContainer);

    const ref = { current: emptyContainer };

    renderHook(() => useFocusTrap(ref, true));

    // Simulate Tab key press
    const tabEvent = new KeyboardEvent("keydown", {
      key: "Tab",
      bubbles: true,
      cancelable: true,
    });

    const preventDefaultSpy = vi.spyOn(tabEvent, "preventDefault");
    emptyContainer.dispatchEvent(tabEvent);

    // Assert: Event should be prevented when no focusable elements exist
    expect(preventDefaultSpy).toHaveBeenCalled();

    // Cleanup
    document.body.removeChild(emptyContainer);
  });

  it("should ignore non-Tab key presses", () => {
    const ref = { current: container };

    renderHook(() => useFocusTrap(ref, true));

    button1.focus();

    // Simulate Enter key press (should not be handled)
    const enterEvent = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
      cancelable: true,
    });

    const preventDefaultSpy = vi.spyOn(enterEvent, "preventDefault");
    button1.dispatchEvent(enterEvent);

    // Assert: Event should not be prevented
    expect(preventDefaultSpy).not.toHaveBeenCalled();
  });
});

