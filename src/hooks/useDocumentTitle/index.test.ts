import { renderHook } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { useDocumentTitle } from ".";

describe("useDocumentTitle", () => {
  const ORIGINAL_TITLE = "Initial Test Title";

  // Before each test, set a known initial document title.
  beforeEach(() => {
    document.title = ORIGINAL_TITLE;
  });

  // After each test, clean up to ensure no side-effects.
  afterEach(() => {
    document.title = ORIGINAL_TITLE;
  });

  it("should set the document title on mount", () => {
    const newTitle = "My Awesome App";
    renderHook(() => useDocumentTitle(newTitle));
    expect(document.title).toBe(newTitle);
  });

  it("should restore the original document title on unmount", () => {
    const temporaryTitle = "Temporary Page Title";

    // Render the hook
    const { unmount } = renderHook(() => useDocumentTitle(temporaryTitle));

    // Check if the title was updated
    expect(document.title).toBe(temporaryTitle);

    // Unmount the component
    unmount();

    // Check if the title was restored to the original
    expect(document.title).toBe(ORIGINAL_TITLE);
  });

  it("should update the document title when the title prop changes", () => {
    const firstTitle = "First Title";
    const secondTitle = "Second Title";

    // Render with the first title
    const { rerender } = renderHook(({ title }) => useDocumentTitle(title), {
      initialProps: { title: firstTitle },
    });

    expect(document.title).toBe(firstTitle);

    // Rerender with the second title
    rerender({ title: secondTitle });

    expect(document.title).toBe(secondTitle);
  });

  it("should restore the original title even after multiple updates", () => {
    const { rerender, unmount } = renderHook(
      ({ title }) => useDocumentTitle(title),
      {
        initialProps: { title: "Update 1" },
      }
    );

    rerender({ title: "Update 2" });
    rerender({ title: "Update 3" });

    expect(document.title).toBe("Update 3");

    // On unmount, it should restore the very first title, not the last one.
    unmount();
    expect(document.title).toBe(ORIGINAL_TITLE);
  });
});
