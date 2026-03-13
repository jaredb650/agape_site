"use client";

import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string, defaultValue = false): boolean {
  return useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") {
        return () => undefined;
      }

      const mediaQuery = window.matchMedia(query);
      mediaQuery.addEventListener("change", onStoreChange);
      return () => mediaQuery.removeEventListener("change", onStoreChange);
    },
    () =>
      typeof window === "undefined"
        ? defaultValue
        : window.matchMedia(query).matches,
    () => defaultValue,
  );
}
