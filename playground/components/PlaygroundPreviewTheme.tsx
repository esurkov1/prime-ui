import * as React from "react";

import type { ExampleFrameViewport } from "@/components/example-frame/ExampleFrame";
import { createComponentContext } from "@/internal/context";
import { type SurfaceDepth, SurfaceDepthProvider } from "@/internal/surfaceDepth";

/**
 * The layer a preview sits on (foundation §4): the page or a card. A menu or a modal is the same
 * white layer as a card in light, so it needs no option of its own. Components must read well on
 * both.
 */
export type PlaygroundPreviewSurface = "page" | "card";

export const PLAYGROUND_PREVIEW_SURFACES: ReadonlyArray<{
  value: PlaygroundPreviewSurface;
  depth: SurfaceDepth;
  label: string;
}> = [
  { value: "page", depth: 0, label: "На странице" },
  { value: "card", depth: 1, label: "В карточке" },
];

/**
 * Puts its children on the layer of `surface`: `data-depth` for the context variables and the
 * depth context for surfaces inside. `display: contents`, so it adds no box of its own.
 */
export function PreviewSurfaceDepth({
  surface,
  children,
}: {
  surface: PlaygroundPreviewSurface;
  children: React.ReactNode;
}) {
  const entry = PLAYGROUND_PREVIEW_SURFACES.find((s) => s.value === surface);
  if (!entry || entry.depth === 0) return <>{children}</>;
  return (
    <div style={{ display: "contents" }} data-depth={entry.depth}>
      <SurfaceDepthProvider value={entry.depth}>{children}</SurfaceDepthProvider>
    </div>
  );
}

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
    return isPreviewSurface(value) ? value : "page";
  } catch {
    return "page";
  }
}

export function PlaygroundPreviewThemeProvider({ children }: { children: React.ReactNode }) {
  const [viewport, setViewport] = React.useState<ExampleFrameViewport>("desktop");
  const [surface, setSurfaceState] = React.useState<PlaygroundPreviewSurface>(() =>
    typeof window === "undefined" ? "page" : readStoredSurface(),
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
