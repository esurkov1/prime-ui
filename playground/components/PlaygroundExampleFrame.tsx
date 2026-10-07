import { ExampleFrame, type ExampleFrameProps } from "@/components/example-frame/ExampleFrame";

import { usePlaygroundPreviewTheme } from "./PlaygroundPreviewTheme";
import { usePlaygroundTheme } from "./PlaygroundTheme";

export type PlaygroundExampleFrameProps = Omit<
  ExampleFrameProps,
  | "colorScheme"
  | "defaultColorScheme"
  | "onColorSchemeChange"
  | "viewport"
  | "defaultViewport"
  | "onViewportChange"
>;

/**
 * ExampleFrame bound to playground state: theme from `<html data-theme>`, shared viewport and
 * the playground-wide preview surface (applied by `playground.css` via `data-preview-surface`).
 */
export function PlaygroundExampleFrame(props: PlaygroundExampleFrameProps) {
  const { scheme } = usePlaygroundTheme();
  const { viewport, setViewport, surface } = usePlaygroundPreviewTheme();
  return (
    <div className="playgroundFrame" data-preview-surface={surface}>
      <ExampleFrame
        {...props}
        colorScheme={scheme}
        showThemeToggle={false}
        viewport={viewport}
        onViewportChange={setViewport}
      />
    </div>
  );
}
