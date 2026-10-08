import * as React from "react";

import { ExampleFrame, type ExampleFrameProps } from "@/components/example-frame/ExampleFrame";
import { StageDepthProvider } from "@/internal/surfaceDepth";

import type { SourceEntry } from "../sourceRegistry";
import { previewSurfaceDepth, usePlaygroundPreviewTheme } from "./PlaygroundPreviewTheme";
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
 * the playground-wide preview layer: the stage itself takes that layer's `data-depth`
 * (`StageDepthProvider`), so it paints the layer and the example stays its direct child.
 */
export function PlaygroundExampleFrame(props: PlaygroundExampleFrameProps) {
  const { scheme } = usePlaygroundTheme();
  const { viewport, setViewport, surface } = usePlaygroundPreviewTheme();
  return (
    <div className="playgroundFrame">
      <StageDepthProvider value={previewSurfaceDepth(surface)}>
        <ExampleFrame
          {...props}
          colorScheme={scheme}
          showThemeToggle={false}
          viewport={viewport}
          onViewportChange={setViewport}
        />
      </StageDepthProvider>
    </div>
  );
}

type SourceFrameProps = Omit<PlaygroundExampleFrameProps, "code" | "children"> & {
  /** A registry entry: the file's component and its source, loaded together. */
  entry: Promise<SourceEntry>;
  /** Wraps the rendered file inside the stage (a pattern sits in an app-panel stage). */
  stage?: (preview: React.ReactNode) => React.ReactNode;
};

function LoadedSourceFrame({ entry, stage, ...rest }: SourceFrameProps) {
  const { Component, source } = React.use(entry);
  const preview = <Component />;
  return (
    <PlaygroundExampleFrame {...rest} code={source}>
      {stage ? stage(preview) : preview}
    </PlaygroundExampleFrame>
  );
}

/** The frame of one example or pattern file: a quiet placeholder until module and source load. */
export function PlaygroundSourceFrame(props: SourceFrameProps) {
  return (
    <React.Suspense fallback={<div className="playgroundFramePending" aria-hidden="true" />}>
      <LoadedSourceFrame {...props} />
    </React.Suspense>
  );
}
