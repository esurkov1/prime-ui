import { ExampleFrame, type ExampleFrameRootProps } from "@/components/example-frame/ExampleFrame";

import { type PlaygroundPreviewSurface, usePlaygroundPreviewTheme } from "./PlaygroundPreviewTheme";
import { usePlaygroundTheme } from "./PlaygroundTheme";

export type PlaygroundExampleFrameRootProps = Omit<
  ExampleFrameRootProps,
  | "colorScheme"
  | "defaultColorScheme"
  | "onColorSchemeChange"
  | "viewport"
  | "defaultViewport"
  | "onViewportChange"
  | "themePreset"
> & {
  /** Preview background for this example only; defaults to the playground-wide choice. */
  surface?: PlaygroundPreviewSurface;
};

/**
 * ExampleFrame bound to playground state: theme from `<html data-theme>`, shared viewport and
 * preview surface. The surface is applied by `playground.css` via `data-preview-surface`.
 */
function PlaygroundExampleFrameRoot({
  surface: surfaceProp,
  ...props
}: PlaygroundExampleFrameRootProps) {
  const { scheme } = usePlaygroundTheme();
  const { viewport, setViewport, surface } = usePlaygroundPreviewTheme();
  return (
    <div className="playgroundFrame" data-preview-surface={surfaceProp ?? surface}>
      <ExampleFrame.Root
        {...props}
        colorScheme={scheme}
        showThemeToggle={false}
        viewport={viewport}
        onViewportChange={setViewport}
      />
    </div>
  );
}

PlaygroundExampleFrameRoot.displayName = "PlaygroundExampleFrame.Root";

export const PlaygroundExampleFrame = {
  Root: PlaygroundExampleFrameRoot,
  Stage: ExampleFrame.Stage,
};
