import * as React from "react";

import { createComponentContext } from "@/internal/context";
import { applyTheme } from "@/theme/applyTheme";

export type PlaygroundThemeScheme = "light" | "dark";

type PlaygroundThemeContextValue = {
  scheme: PlaygroundThemeScheme;
  setScheme: (next: PlaygroundThemeScheme) => void;
  toggleScheme: () => void;
};

const [PlaygroundThemeProviderInternal, usePlaygroundTheme] =
  createComponentContext<PlaygroundThemeContextValue>("PlaygroundTheme");

export { usePlaygroundTheme };

const STORAGE_KEY = "prime-playground-theme";

function readStoredScheme(): PlaygroundThemeScheme | null {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

function getInitialThemeScheme(): PlaygroundThemeScheme {
  if (typeof window === "undefined") return "light";

  const fromDocument = document.documentElement.dataset.theme;
  if (fromDocument === "light" || fromDocument === "dark") return fromDocument;

  const fromStorage = readStoredScheme();
  if (fromStorage) return fromStorage;

  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Light/dark for the whole playground: `data-theme` on `<html>`, persisted in localStorage.
 * Theme CSS (`theme-light.css` / `theme-dark.css`) reacts to the attribute; nothing else is needed.
 */
export function PlaygroundThemeProvider({ children }: { children: React.ReactNode }) {
  const [scheme, setScheme] = React.useState<PlaygroundThemeScheme>(() => getInitialThemeScheme());

  React.useLayoutEffect(() => {
    const root = document.documentElement;
    applyTheme(scheme, root);
    try {
      window.localStorage.setItem(STORAGE_KEY, scheme);
    } catch {
      // Storage can be unavailable (private mode); the attribute alone is enough.
    }
  }, [scheme]);

  const toggleScheme = React.useCallback(() => {
    setScheme((prev) => (prev === "light" ? "dark" : "light"));
  }, []);

  const value = React.useMemo(() => ({ scheme, setScheme, toggleScheme }), [scheme, toggleScheme]);

  return (
    <PlaygroundThemeProviderInternal value={value}>{children}</PlaygroundThemeProviderInternal>
  );
}
