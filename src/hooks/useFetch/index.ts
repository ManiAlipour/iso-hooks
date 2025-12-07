import { useCallback, useEffect, useRef, useState } from "react";

/**
 * useFetch – A fully controlled + auto-fetch React hook
 * Supports:
 * - Manual + automatic fetch
 * - AbortController handling
 * - Dependencies re-fetch
 * - URL override via refetch(url)
 */
export function useFetch<T = unknown>(
  url: string | null,
  options?: RequestInit,
  deps: any[] = []
) {
  // Holds current AbortController instance
  const controllerRef = useRef<AbortController | null>(null);

  // Keep latest options without re-creating callback
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Controlled state
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Executes a fetch call with optional override URL.
   * Main engine for auto + manual fetching.
   */
  const execute = useCallback(
    async (targetUrl?: string | null) => {
      const finalUrl = targetUrl ?? url;
      if (!finalUrl) return;

      // Abort previous request first
      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      // Create a new controller for this request
      const controller = new AbortController();
      controllerRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const res = await fetch(finalUrl, {
          ...optionsRef.current,
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Fetch failed: ${res.status}`);
        }

        const json = (await res.json()) as T;
        setData(json);
      } catch (err: any) {
        // Abort is NOT a real error — ignore it
        if (err.name === "AbortError") return;
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [url] // re-create executor when URL changes
  );

  /**
   * Auto-fetch on initial mount or dependencies update.
   */
  useEffect(() => {
    if (url) execute(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...deps]);

  return {
    data,
    error,
    loading,

    // Manual override of URL
    refetch: (overrideUrl?: string | null) => execute(overrideUrl),

    // Expose current AbortController for debugging / tests
    controller: controllerRef.current,
  };
}
