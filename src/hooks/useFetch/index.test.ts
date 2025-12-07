import { renderHook } from "@testing-library/react";
import { expect, it, vi, beforeEach } from "vitest";
import { useFetch } from "./index";

let mockFetch: ReturnType<typeof vi.fn>;

beforeEach(() => {
  // Reset and reassign mockFetch before every test
  mockFetch = vi.fn();
  global.fetch = mockFetch as any;
});

it("should abort previous request", async () => {
  const abortSpy = vi.fn();

  // Proper AbortController mock
  class MockAbortController {
    signal = {};
    abort = abortSpy;
  }

  global.AbortController = MockAbortController as any;

  // Mock fetch resolve
  mockFetch.mockResolvedValue({
    ok: true,
    json: () => Promise.resolve({}),
  });

  const { rerender } = renderHook(({ url }) => useFetch(url), {
    initialProps: { url: "/api/1" },
  });

  // Trigger second fetch → should abort first one
  rerender({ url: "/api/2" });

  expect(abortSpy).toHaveBeenCalled();
});
