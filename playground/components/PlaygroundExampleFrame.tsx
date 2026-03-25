import { ExampleFrame, type ExampleFrameRootProps } from "@/components/example-frame/ExampleFrame";

import { usePlaygroundPreviewTheme } from "./PlaygroundPreviewTheme";
import { usePlaygroundTheme } from "./PlaygroundTheme";

export type PlaygroundExampleFrameRootProps = Omit<
  ExampleFrameRootProps,
  | "colorScheme"
  | "defaultColorScheme"
  | "onColorSchemeChange"
  | "viewport"
  | "defaultViewport"
  | "onViewportChange"
>;

function PlaygroundExampleFrameRoot(props: PlaygroundExampleFrameRootProps) {
  const { scheme, preset } = usePlaygroundTheme();
  const { viewport, setViewport } = usePlaygroundPreviewTheme();
  return (
    <ExampleFrame.Root
      {...props}
      colorScheme={scheme}
      themePreset={preset}
      showThemeToggle={false}
      viewport={viewport}
      onViewportChange={setViewport}
    />
  );
}

PlaygroundExampleFrameRoot.displayName = "PlaygroundExampleFrame.Root";

export const PlaygroundExampleFrame = {
  Root: PlaygroundExampleFrameRoot,
  Stage: ExampleFrame.Stage,
};
