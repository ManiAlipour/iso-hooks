import { useState, useCallback } from "react";

type CopiedValue = string | null;
type CopyFn = (text: string) => Promise<boolean>; // Return true if successful

export function useCopyToClipboard(
  resetInterval = 2000
): [CopiedValue, CopyFn] {
  const [copiedText, setCopiedText] = useState<CopiedValue>(null);

  const copy: CopyFn = useCallback(
    async (text: string) => {
      if (!navigator?.clipboard) {
        console.warn("Clipboard not supported");
        return false;
      }

      try {
        await navigator.clipboard.writeText(text);
        setCopiedText(text);

        // Reset the copied state after the interval
        if (resetInterval) {
          setTimeout(() => setCopiedText(null), resetInterval);
        }

        return true;
      } catch (error) {
        console.warn("Copy failed", error);
        setCopiedText(null);
        return false;
      }
    },
    [resetInterval]
  );

  return [copiedText, copy];
}
