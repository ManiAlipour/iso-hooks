import {
  useEffect,
  useLayoutEffect,
  EffectCallback,
  DependencyList,
} from "react";

/**
 * useIsomorphicLayoutEffect
 *
 * A hook that works like useLayoutEffect on the client and falls back to
 * useEffect on the server to avoid React warnings about useLayoutEffect
 * being used during server-side rendering.
 *
 * This ensures compatibility with server-side rendering (SSR) and universal
 * (isomorphic) React apps like Next.js, Remix, and other SSR frameworks.
 *
 * useLayoutEffect runs synchronously after all DOM mutations but before the
 * browser paints, making it ideal for DOM measurements and synchronous updates.
 * However, it's not available during SSR, so this hook provides a safe fallback.
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   useIsomorphicLayoutEffect(() => {
 *     // This runs synchronously on client, safely on server
 *     const width = elementRef.current?.offsetWidth;
 *     console.log('Element width:', width);
 *   }, []);
 *   return <div ref={elementRef}>Content</div>;
 * };
 * ```
 *
 * @param effect - The effect callback function (same signature as useEffect/useLayoutEffect)
 * @param deps - Optional dependency array (same as useEffect/useLayoutEffect)
 *
 * @returns void - This hook doesn't return a value
 */
export const useIsomorphicLayoutEffect: (
  effect: EffectCallback,
  deps?: DependencyList
) => void =
  typeof window !== "undefined" && typeof document !== "undefined"
    ? useLayoutEffect // Use layout effect in the browser (client-side)
    : useEffect; // Fallback to effect in SSR (server-side)
