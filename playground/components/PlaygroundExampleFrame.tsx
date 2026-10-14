import * as React from "react";
import { MemoryRouter, UNSAFE_LocationContext, UNSAFE_RouteContext } from "react-router-dom";

import { Crossfade } from "@/components/crossfade/Crossfade";
import { ExampleFrame, type ExampleFrameProps } from "@/components/example-frame/ExampleFrame";
import { Skeleton } from "@/components/skeleton/Skeleton";
import { StageDepthProvider } from "@/internal/surfaceDepth";

import type { SourceEntry } from "../exampleRegistry";
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
  /** Wraps the rendered file inside the stage (a `screen` example sits in an app-panel stage). */
  stage?: (preview: React.ReactNode) => React.ReactNode;
};

type LoadState = { entry: SourceEntry } | { error: unknown } | null;

/** Entries that already loaded: a frame of a loaded file renders it at once, with no placeholder. */
const loaded = new WeakMap<Promise<SourceEntry>, SourceEntry>();

function initialState(entry: Promise<SourceEntry>): LoadState {
  const ready = loaded.get(entry);
  return ready ? { entry: ready } : null;
}

/** The playground's location and route match, cleared for a router of the stage's own. */
const NO_ROUTE = { outlet: null, matches: [], isDataRoute: false };

/**
 * A preview's own router: router examples (`Link`, `NavLink`) move a memory history inside the
 * stage, never the playground. React Router allows one router per tree, so the stage first leaves
 * the playground's location and route match. Context only: the example stays the stage's child.
 */
function PreviewRouter({ children }: { children: React.ReactNode }) {
  return (
    <UNSAFE_LocationContext value={null as never}>
      <UNSAFE_RouteContext value={NO_ROUTE}>
        <MemoryRouter>{children}</MemoryRouter>
      </UNSAFE_RouteContext>
    </UNSAFE_LocationContext>
  );
}

/** The frame's shape while module and source load: the toolbar row over the stage. */
function SourceFramePlaceholder() {
  return (
    <div className="playgroundFramePlaceholder">
      <Skeleton shape="control" size="s" className="playgroundFramePlaceholderToolbar" />
      <Skeleton shape="block" className="playgroundFramePlaceholderStage" />
    </div>
  );
}

/**
 * The frame of one example file: a Skeleton in the frame's shape until module and source load,
 * then a cross-fade into the frame.
 */
export function PlaygroundSourceFrame({ entry, stage, ...rest }: SourceFrameProps) {
  const [state, setState] = React.useState<LoadState>(() => initialState(entry));

  React.useEffect(() => {
    let live = true;
    setState(initialState(entry));
    entry.then(
      (value) => {
        loaded.set(entry, value);
        if (live) setState({ entry: value });
      },
      (error: unknown) => {
        if (live) setState({ error });
      },
    );
    return () => {
      live = false;
    };
  }, [entry]);

  // A failed load reaches the nearest error boundary, like any render error.
  if (state && "error" in state) throw state.error;
  const ready = state?.entry;

  return (
    <Crossfade state={ready ? "ready" : "loading"} aria-busy={ready ? undefined : true}>
      {ready ? (
        <PlaygroundExampleFrame {...rest} code={ready.source}>
          <PreviewRouter>{stage ? stage(<ready.Component />) : <ready.Component />}</PreviewRouter>
        </PlaygroundExampleFrame>
      ) : (
        <SourceFramePlaceholder />
      )}
    </Crossfade>
  );
}
