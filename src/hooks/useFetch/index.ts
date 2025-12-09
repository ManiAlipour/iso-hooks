import { useCallback, useEffect, useRef, useState } from "react";

interface UseFetchOptions<T> extends RequestInit {
  initialData?: T;
}

/**
 * useFetch
 *
 * @param url - The URL to fetch
 * @param options - Fetch options + initialData (to avoid null checks)
 * @param deps - Dependencies to trigger re-fetch
 */
export function useFetch<T = unknown>(
  url: string | null,
  options: UseFetchOptions<T> = {},
  deps: any[] = []
) {
  const controllerRef = useRef<AbortController | null>(null);

  // Keep options stable
  const optionsRef = useRef(options);
  optionsRef.current = options;

  // Initialize with initialData if provided, otherwise null
  // This solves the DX issue: passing { initialData: [] } means data is never null.
  const [data, setData] = useState<T | null>(options.initialData ?? null);

  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(!!url); // If URL exists, we are loading initially

  const execute = useCallback(
    async (targetUrl?: string | null) => {
      const finalUrl = targetUrl ?? url;
      if (!finalUrl) return;

      if (controllerRef.current) {
        controllerRef.current.abort();
      }

      const controller = new AbortController();
      controllerRef.current = controller;

      setLoading(true);
      setError(null);
      // Note: We deliberately do NOT reset data to null here.
      // Keeping "stale" data while fetching new data is better UX (no flickering).

      try {
        const { initialData, ...fetchOptions } = optionsRef.current;

        const res = await fetch(finalUrl, {
          ...fetchOptions,
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(`Fetch failed: ${res.status}`);
        }

        const json = (await res.json()) as T;
        setData(json);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [url]
  );

  useEffect(() => {
    if (url) execute(url);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...deps]);

  return {
    data,
    error,
    loading,
    refetch: (overrideUrl?: string | null) => execute(overrideUrl),
    controller: controllerRef.current,
  };
}
