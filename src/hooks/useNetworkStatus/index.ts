import { useState, useEffect } from "react";

/**
 * Represents the network connection status and information.
 * This interface includes both basic online/offline status and
 * advanced connection metrics when available via the Network Information API.
 */
export interface NetworkStatus {
  /** Whether the device is currently online */
  online: boolean;
  /** Effective bandwidth estimate in megabits per second (Mbps) */
  downlink?: number;
  /** Effective connection type: "slow-2g", "2g", "3g", or "4g" */
  effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
  /** Round-trip time estimate in milliseconds */
  rtt?: number;
  /** Whether the user has enabled data saver mode */
  saveData?: boolean;
}

/**
 * Custom React hook to track the network connection status.
 * 
 * Returns the current online/offline status and connection information.
 * This hook listens to browser online/offline events and, when available,
 * the Network Information API for more detailed connection metrics.
 * 
 * This hook is SSR-safe and will return { online: true } on the server.
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const { online, effectiveType } = useNetworkStatus();
 *   if (!online) return <div>You're offline!</div>;
 *   return <div>Connection: {effectiveType || 'unknown'}</div>;
 * };
 * ```
 * 
 * @returns The current network status object with online status and connection information
 */
export function useNetworkStatus(): NetworkStatus {
  // Initialize state with current network status (SSR-safe)
  const [status, setStatus] = useState<NetworkStatus>(() => {
    // SSR-safe: default to online on the server
    if (typeof navigator === "undefined") {
      return { online: true };
    }

    // Get connection API (with vendor prefixes for browser compatibility)
    // The Network Information API is available in Chrome, Edge, and some mobile browsers
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    return {
      online: navigator.onLine,
      downlink: connection?.downlink,
      effectiveType: connection?.effectiveType,
      rtt: connection?.rtt,
      saveData: connection?.saveData,
    };
  });

  useEffect(() => {
    // Only run on the client side (SSR safety check)
    if (typeof window === "undefined" || typeof navigator === "undefined") {
      return;
    }

    // Get connection API (with vendor prefixes for browser compatibility)
    const connection =
      (navigator as any).connection ||
      (navigator as any).mozConnection ||
      (navigator as any).webkitConnection;

    /**
     * Updates the network status state with current values.
     * Called when online/offline events fire or connection changes.
     */
    const updateStatus = () => {
      setStatus({
        online: navigator.onLine,
        downlink: connection?.downlink,
        effectiveType: connection?.effectiveType,
        rtt: connection?.rtt,
        saveData: connection?.saveData,
      });
    };

    // Listen to browser online/offline events
    // These fire when the device's network connectivity changes
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    // Listen to connection changes via Network Information API (if available)
    // This provides more granular information about connection quality changes
    if (connection) {
      connection.addEventListener("change", updateStatus);
    }

    // Cleanup: remove all event listeners when component unmounts
    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
      if (connection) {
        connection.removeEventListener("change", updateStatus);
      }
    };
  }, []);

  return status;
}

