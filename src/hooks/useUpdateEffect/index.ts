import { useEffect, useRef } from "react";

/**
 * A custom useEffect hook that only triggers on updates, not on initial mount.
 * @param effect The effect callback
 * @param deps The dependency list
 */
export function useUpdateEffect(
  effect: React.EffectCallback,
  deps?: React.DependencyList
) {
  const isFirstRender = useRef(true);

  useEffect(() => {
    // If it's the first render, flip the flag and do nothing
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // Otherwise, run the effect regularly
    return effect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
