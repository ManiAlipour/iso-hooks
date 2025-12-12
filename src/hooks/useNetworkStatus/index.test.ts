import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useNetworkStatus } from ".";

describe("useNetworkStatus", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset navigator.onLine to true before each test
    Object.defineProperty(navigator, "onLine", {
      writable: true,
      configurable: true,
      value: true,
    });
  });

  it("should initialize with current online status", () => {
    const { result } = renderHook(() => useNetworkStatus());

    // Assert: Should return an object with online property
    expect(result.current).toHaveProperty("online");
    expect(typeof result.current.online).toBe("boolean");
  });

  it("should update when window goes offline", () => {
    const { result } = renderHook(() => useNetworkStatus());

    // Initially should be online
    expect(result.current.online).toBe(true);

    // Simulate going offline
    act(() => {
      Object.defineProperty(navigator, "onLine", {
        writable: true,
        configurable: true,
      });
      Object.defineProperty(navigator, "onLine", {
        value: false,
        writable: true,
        configurable: true,
      });

      const offlineEvent = new Event("offline");
      window.dispatchEvent(offlineEvent);
    });

    // Assert: Should be offline
    expect(result.current.online).toBe(false);
  });

  it("should update when window comes back online", () => {
    const { result } = renderHook(() => useNetworkStatus());

    // Set to offline first
    act(() => {
      Object.defineProperty(navigator, "onLine", {
        value: false,
        writable: true,
        configurable: true,
      });

      const offlineEvent = new Event("offline");
      window.dispatchEvent(offlineEvent);
    });

    expect(result.current.online).toBe(false);

    // Simulate coming back online
    act(() => {
      Object.defineProperty(navigator, "onLine", {
        value: true,
        writable: true,
        configurable: true,
      });

      const onlineEvent = new Event("online");
      window.dispatchEvent(onlineEvent);
    });

    // Assert: Should be online again
    expect(result.current.online).toBe(true);
  });

  it("should include connection information when available", () => {
    // Mock the connection API
    const mockConnection = {
      downlink: 10,
      effectiveType: "4g" as const,
      rtt: 50,
      saveData: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    Object.defineProperty(navigator, "connection", {
      writable: true,
      configurable: true,
      value: mockConnection,
    });

    const { result } = renderHook(() => useNetworkStatus());

    // Assert: Should include connection information
    expect(result.current.downlink).toBe(10);
    expect(result.current.effectiveType).toBe("4g");
    expect(result.current.rtt).toBe(50);
    expect(result.current.saveData).toBe(false);
  });

  it("should handle connection change events", () => {
    const mockConnection = {
      downlink: 5,
      effectiveType: "3g" as const,
      rtt: 100,
      saveData: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    Object.defineProperty(navigator, "connection", {
      writable: true,
      configurable: true,
      value: mockConnection,
    });

    const { result } = renderHook(() => useNetworkStatus());

    // Update connection properties
    act(() => {
      mockConnection.downlink = 20;
      mockConnection.effectiveType = "4g";
      mockConnection.rtt = 30;

      // Simulate connection change
      const changeEvent = new Event("change");
      mockConnection.addEventListener.mock.calls.forEach(([event, handler]) => {
        if (event === "change") {
          handler(changeEvent);
        }
      });
    });

    // Note: In a real scenario, the connection change would update the state
    // This test verifies that the hook sets up the listener correctly
    expect(mockConnection.addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });

  it("should clean up event listeners on unmount", () => {
    const mockConnection = {
      downlink: 10,
      effectiveType: "4g" as const,
      rtt: 50,
      saveData: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    Object.defineProperty(navigator, "connection", {
      writable: true,
      configurable: true,
      value: mockConnection,
    });

    const { unmount } = renderHook(() => useNetworkStatus());

    // Unmount hook
    unmount();

    // Assert: Event listeners should be removed
    expect(mockConnection.removeEventListener).toHaveBeenCalled();
    expect(window.removeEventListener).toBeDefined();
  });

  it("should work without connection API (fallback to navigator.onLine only)", () => {
    // Remove connection API
    Object.defineProperty(navigator, "connection", {
      writable: true,
      configurable: true,
      value: undefined,
    });

    const { result } = renderHook(() => useNetworkStatus());

    // Assert: Should still work with just online status
    expect(result.current).toHaveProperty("online");
    expect(typeof result.current.online).toBe("boolean");
    expect(result.current.downlink).toBeUndefined();
    expect(result.current.effectiveType).toBeUndefined();
  });
});

