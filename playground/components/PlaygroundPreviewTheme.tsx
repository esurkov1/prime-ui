import * as React from "react";

import type { ExampleFrameViewport } from "@/components/example-frame/ExampleFrame";

type PlaygroundPreviewThemeValue = {
  viewport: ExampleFrameViewport;
  setViewport: (v: ExampleFrameViewport) => void;
};

const PlaygroundPreviewThemeContext = React.createContext<PlaygroundPreviewThemeValue | null>(null);

export function PlaygroundPreviewThemeProvider({ children }: { children: React.ReactNode }) {
  const [viewport, setViewport] = React.useState<ExampleFrameViewport>("tablet");

  const value = React.useMemo(
    () => ({
      viewport,
      setViewport,
    }),
    [viewport],
  );

  return (
    <PlaygroundPreviewThemeContext.Provider value={value}>
      {children}
    </PlaygroundPreviewThemeContext.Provider>
  );
}

export function usePlaygroundPreviewTheme(): PlaygroundPreviewThemeValue {
  const ctx = React.useContext(PlaygroundPreviewThemeContext);
  if (!ctx) {
    throw new Error("usePlaygroundPreviewTheme must be used within PlaygroundPreviewThemeProvider");
  }
  return ctx;
}
