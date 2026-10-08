import * as React from "react";

import type { ExampleFrameViewport } from "@/components/example-frame/ExampleFrame";
import { createComponentContext } from "@/internal/context";

/** Background a preview sits on. Components must read well on each of them. */
export type PlaygroundPreviewSurface = "canvas" | "surface" | "raised" | "accent";

export const PLAYGROUND_PREVIEW_SURFACES: ReadonlyArray<{
  value: PlaygroundPreviewSurface;
  label: string;
  hint: string;
}> = [
  { value: "canvas", label: "Canvas", hint: "Фон приложения" },
  { value: "surface", label: "Surface", hint: "Карточка, панель" },
  { value: "raised", label: "Raised", hint: "Меню, модалка" },
  { value: "accent", label: "Accent", hint: "Акцентная подложка" },
];

type PlaygroundPreviewThemeValue = {
  viewport: ExampleFrameViewport;
  setViewport: (v: ExampleFrameViewport) => void;
  surface: PlaygroundPreviewSurface;
  setSurface: (s: PlaygroundPreviewSurface) => void;
};

const [PlaygroundPreviewThemeContextProvider, usePlaygroundPreviewTheme] =
  createComponentContext<PlaygroundPreviewThemeValue>("PlaygroundPreviewTheme");

export { usePlaygroundPreviewTheme };

const SURFACE_STORAGE_KEY = "prime-playground-preview-surface";

function isPreviewSurface(value: unknown): value is PlaygroundPreviewSurface {
  return PLAYGROUND_PREVIEW_SURFACES.some((s) => s.value === value);
}

function readStoredSurface(): PlaygroundPreviewSurface {
  try {
    const value = window.localStorage.getItem(SURFACE_STORAGE_KEY);
    return isPreviewSurface(value) ? value : "canvas";
  } catch {
    return "canvas";
  }
}

export function PlaygroundPreviewThemeProvider({ children }: { children: React.ReactNode }) {
  const [viewport, setViewport] = React.useState<ExampleFrameViewport>("desktop");
  const [surface, setSurfaceState] = React.useState<PlaygroundPreviewSurface>(() =>
    typeof window === "undefined" ? "canvas" : readStoredSurface(),
  );

  const setSurface = React.useCallback((next: PlaygroundPreviewSurface) => {
    setSurfaceState(next);
    try {
      window.localStorage.setItem(SURFACE_STORAGE_KEY, next);
    } catch {
      // Storage unavailable: the choice lives for this session only.
    }
  }, []);

  const value = React.useMemo(
    () => ({ viewport, setViewport, surface, setSurface }),
    [viewport, surface, setSurface],
  );

  return (
    <PlaygroundPreviewThemeContextProvider value={value}>
      {children}
    </PlaygroundPreviewThemeContextProvider>
  );
}
