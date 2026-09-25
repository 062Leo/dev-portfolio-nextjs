import { useCallback, useSyncExternalStore } from "react";

// Whether a CSS media query matches. Undefined on the server and during hydration, where
// the viewport is unknown: the first client render then matches the server HTML and the
// real value follows without a hydration mismatch.
export function useMediaQuery(query: string): boolean | undefined {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const list = window.matchMedia(query);
      list.addEventListener("change", onChange);
      return () => list.removeEventListener("change", onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => undefined,
  );
}
