import * as React from "react";
import { Button } from "@/components/button/Button";
import { CodeBlock } from "@/components/code-block/CodeBlock";
import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { SegmentedControl } from "@/components/segmented-control/SegmentedControl";
import { useControllableState } from "@/hooks/useControllableState";
import { useElementSize, useResizeEffect } from "@/hooks/useElementSize";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { readCssLengthPx } from "@/hooks/usePosition";
import type { Glyph } from "@/icons/glyph";
import { Check } from "@/icons/glyphs/check";
import { CodeXml } from "@/icons/glyphs/code-xml";
import { Copy } from "@/icons/glyphs/copy";
import { Eye } from "@/icons/glyphs/eye";
import { Monitor } from "@/icons/glyphs/monitor";
import { Moon } from "@/icons/glyphs/moon";
import { Smartphone } from "@/icons/glyphs/smartphone";
import { Sun } from "@/icons/glyphs/sun";
import { Tablet } from "@/icons/glyphs/tablet";
import { cx } from "@/internal/cx";
import { useLabels } from "@/internal/labels";
import { RegionSwap } from "@/internal/RegionSwap";
import {
  SurfaceDepthProvider,
  useNestedSurfaceDepth,
  useStageDepth,
} from "@/internal/surfaceDepth";
import { TOKEN_DEFAULTS } from "@/internal/tokenDefaults";
import { AppShellBoundary } from "@/layout/app-shell/AppShell";
import { suspendTransitions } from "@/theme/applyTheme";
import styles from "./ExampleFrame.module.css";

type Pane = "preview" | "code";
const VIEWPORTS = ["desktop", "tablet", "mobile"] as const;
export type ExampleFrameViewport = (typeof VIEWPORTS)[number];
const VIEWPORT_GLYPHS: Record<ExampleFrameViewport, Glyph> = {
  desktop: Monitor,
  tablet: Tablet,
  mobile: Smartphone,
};
type ColorScheme = "light" | "dark";

/**
 * Layout of the preview children, so snippets need no wrapper divs for rows and stacks.
 * `matrix`: labelled specimens — every direct child is a row, its children are cells (a specimen
 * above its caption), and cells line up in columns across rows. `matrix-wide`: the same rows and
 * cells for specimens as wide as their container (tabs, a toolbar, a table), one cell under
 * another at the stack measure.
 */
export type ExampleFramePreviewLayout =
  | "default"
  | "stack"
  | "stack-narrow"
  | "full"
  | "row"
  | "matrix"
  | "matrix-wide";

export type ExampleFrameLabels = {
  paneSwitch: string;
  preview: string;
  code: string;
  viewportSwitch: string;
  desktop: string;
  tablet: string;
  mobile: string;
  copy: string;
  copied: string;
  copyError: string;
  themeDark: string;
  themeLight: string;
  codeRegion: string;
};

export const EXAMPLE_FRAME_LABELS: ExampleFrameLabels = {
  paneSwitch: "Вид примера",
  preview: "Превью",
  code: "Код",
  viewportSwitch: "Ширина превью",
  desktop: "Десктоп",
  tablet: "Планшет",
  mobile: "Телефон",
  copy: "Копировать код",
  copied: "Скопировано",
  copyError: "Не удалось скопировать",
  themeDark: "Включить тёмную тему",
  themeLight: "Включить светлую тему",
  codeRegion: "Код примера",
};

/** A frame narrower than this many `--prime-space-20` steps stacks its toolbar. */
const NARROW_STEPS = 8;

/** How long the copy button shows «copied» / «error» before it returns to «copy». */
const COPY_FEEDBACK_MS = 2000;

/** A block that wants the whole stage width: a `fullWidth` control or a table. */
const STRETCH_SELECTOR = '[data-full-width="true"], table';
const MATRIX_MAX_COLUMNS = 12;

const holdsStretch = (node: Node) =>
  node instanceof Element &&
  (node.matches(STRETCH_SELECTOR) || node.querySelector(STRETCH_SELECTOR) !== null);

/** `table` — the child holds a table (it leaves a narrow column too); `full` — a `fullWidth` block. */
const stretchOf = (child: Element): "table" | "full" | null => {
  if (child.matches("table") || child.querySelector("table")) return "table";
  return holdsStretch(child) ? "full" : null;
};

/**
 * Facts about the opaque preview children that the stage layouts need: which direct child holds a
 * stretching block (`data-preview-stretch` on it — `table` or `full` — and `data-stretch` on the
 * stage) and, for
 * `matrix`, the cell count of the first row (`--matrix-columns`) and whether the column grid fits
 * the stage (`data-matrix-wrap` when it does not: each row wraps its cells on its own). Read from
 * the DOM here, not by `:has()` in CSS: a descendant `:has()` on the stage and on every element
 * under it re-matches on every DOM insert inside the example (a virtualized list restyled ~10k
 * elements per frame). A MutationObserver re-reads only when a change can matter.
 */
function usePreviewFacts(
  stageRef: React.RefObject<HTMLElement | null>,
  layout: ExampleFramePreviewLayout,
  active: boolean,
) {
  // The width the column grid needs, measured when it overflowed; while the rows wrap the grid is
  // not laid out, so the stage returns to it only once it is at least this wide again.
  const gridWidth = React.useRef(0);
  const fitMatrix = React.useCallback(
    (stage: HTMLElement, remeasure: boolean) => {
      if (layout !== "matrix") {
        stage.removeAttribute("data-matrix-wrap");
        return;
      }
      if (stage.hasAttribute("data-matrix-wrap")) {
        if (!remeasure && stage.clientWidth < gridWidth.current) return;
        stage.removeAttribute("data-matrix-wrap");
      }
      if (stage.scrollWidth > stage.clientWidth + 1) {
        gridWidth.current = stage.scrollWidth;
        stage.setAttribute("data-matrix-wrap", "");
      }
    },
    [layout],
  );

  useResizeEffect(
    stageRef,
    () => {
      if (stageRef.current) fitMatrix(stageRef.current, false);
    },
    { enabled: active && layout === "matrix" },
  );

  React.useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!active || !stage) return;
    // Stretching only latches on: a virtualized list mounts and unmounts its rows while it
    // scrolls, and a full-width card leaving the window must not narrow the stage under the reader.
    const read = () => {
      for (const child of Array.from(stage.children)) {
        const stretch = stretchOf(child);
        if (stretch && child.getAttribute("data-preview-stretch") !== "table") {
          child.setAttribute("data-preview-stretch", stretch);
        }
      }
      if (!stage.hasAttribute("data-stretch") && stage.querySelector(STRETCH_SELECTOR)) {
        stage.setAttribute("data-stretch", "");
      }
      if (layout === "matrix") {
        const cells = stage.firstElementChild?.childElementCount ?? 1;
        stage.style.setProperty(
          "--matrix-columns",
          String(Math.min(MATRIX_MAX_COLUMNS, Math.max(1, cells))),
        );
      } else {
        stage.style.removeProperty("--matrix-columns");
      }
      fitMatrix(stage, true);
    };
    read();
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        const target = record.target;
        const relevant =
          record.type === "attributes" ||
          target === stage ||
          target.parentNode === stage ||
          Array.from(record.addedNodes).some(holdsStretch);
        if (relevant) {
          read();
          return;
        }
      }
    });
    observer.observe(stage, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-full-width"],
    });
    return () => observer.disconnect();
  }, [stageRef, layout, active, fitMatrix]);
}

export type ExampleFrameProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onCopy"> & {
  code: string;
  /** The outer `<div>`. */
  ref?: React.Ref<HTMLDivElement>;
  colorScheme?: ColorScheme;
  defaultColorScheme?: ColorScheme;
  onColorSchemeChange?: (scheme: ColorScheme) => void;
  viewport?: ExampleFrameViewport;
  defaultViewport?: ExampleFrameViewport;
  onViewportChange?: (v: ExampleFrameViewport) => void;
  showThemeToggle?: boolean;
  onCopy?: () => void;
  previewLayout?: ExampleFramePreviewLayout;
  labels?: Partial<ExampleFrameLabels>;
};

/** Documentation frame: a toolbar (pane, theme, copy, device width) above the preview or the code. */
export function ExampleFrame({
  code,
  children,
  className,
  colorScheme: colorSchemeProp,
  defaultColorScheme = "light",
  onColorSchemeChange,
  viewport: viewportProp,
  defaultViewport = "desktop",
  onViewportChange,
  showThemeToggle = true,
  onCopy,
  previewLayout = "default",
  labels: labelsProp,
  ref,
  ...rest
}: ExampleFrameProps) {
  const labels = useLabels(EXAMPLE_FRAME_LABELS, labelsProp);
  const [pane, setPane] = React.useState<Pane>("preview");
  const [colorScheme, setColorScheme] = useControllableState({
    value: colorSchemeProp,
    defaultValue: defaultColorScheme,
    onChange: onColorSchemeChange,
  });
  const [viewport, setViewport] = useControllableState({
    value: viewportProp,
    defaultValue: defaultViewport,
    onChange: onViewportChange,
  });

  // Theme switch inside the frame is instant: no color transition from the old theme.
  const rootRef = React.useRef<HTMLDivElement>(null);
  const mergedRef = useMergedRefs(rootRef, ref);
  const depth = useNestedSurfaceDepth();
  const stageDepth = useStageDepth();
  const stageRef = React.useRef<HTMLElement>(null);
  usePreviewFacts(stageRef, previewLayout, pane === "preview");
  const previousScheme = React.useRef(colorScheme);
  React.useLayoutEffect(() => {
    if (previousScheme.current === colorScheme) return;
    previousScheme.current = colorScheme;
    if (rootRef.current) suspendTransitions(rootRef.current);
  }, [colorScheme]);

  return (
    <div {...rest} ref={mergedRef} className={cx(styles.root, className)} data-depth={depth}>
      <ExampleFrameToolbar
        code={code}
        labels={labels}
        pane={pane}
        onPaneChange={setPane}
        viewport={viewport}
        onViewportChange={setViewport}
        colorScheme={colorScheme}
        onColorSchemeChange={showThemeToggle ? setColorScheme : undefined}
        onCopy={onCopy}
      />
      {/* The pane switch cross-fades between the preview and the code. */}
      <RegionSwap state={pane} hold={false}>
        {pane === "preview" ? (
          <div className={styles.previewViewport} data-viewport={viewport}>
            {/* The stage scrolls a preview wider than itself (a table without its own scroll)
                under edge shadows, never clips it. */}
            <ScrollContainer
              ref={stageRef}
              axis="horizontal"
              edges="shadow"
              className={styles.previewInner}
              data-preview-layout={previewLayout}
              data-theme={colorScheme}
              data-depth={stageDepth}
            >
              {/* The stage is a page of its own (or the layer the docs ask for); surfaces inside
                  count from it, and a header or a Sidebar in it stays in the preview instead of
                  joining an app shell around the frame. Never wrap `children` in an element: the
                  layouts use `> *`. */}
              <SurfaceDepthProvider value={stageDepth}>
                <AppShellBoundary>{children}</AppShellBoundary>
              </SurfaceDepthProvider>
            </ScrollContainer>
          </div>
        ) : (
          // Plain CodeBlock is not focusable itself; the scrolling pane takes keyboard focus
          // instead. The pane carries the theme, so the block inherits it (and trims the source).
          <ScrollContainer
            as="section"
            axis="both"
            edges="shadow"
            className={styles.codePane}
            data-theme={colorScheme}
            tabIndex={0}
            aria-label={labels.codeRegion}
          >
            <CodeBlock variant="ghost" code={code} />
          </ScrollContainer>
        )}
      </RegionSwap>
    </div>
  );
}

ExampleFrame.displayName = "ExampleFrame";

type ExampleFrameToolbarProps = {
  code: string;
  labels: ExampleFrameLabels;
  pane: Pane;
  onPaneChange: (pane: Pane) => void;
  viewport: ExampleFrameViewport;
  onViewportChange: (viewport: ExampleFrameViewport) => void;
  colorScheme: ColorScheme;
  /** Without it the theme toggle is not shown. */
  onColorSchemeChange?: (scheme: ColorScheme) => void;
  onCopy?: () => void;
};

function ExampleFrameToolbar({
  code,
  labels,
  pane,
  onPaneChange,
  viewport,
  onViewportChange,
  colorScheme,
  onColorSchemeChange,
  onCopy,
}: ExampleFrameToolbarProps) {
  const [copyState, setCopyState] = React.useState<"idle" | "copied" | "error">("idle");
  const toolbarRef = React.useRef<HTMLDivElement>(null);
  const toolbarSize = useElementSize(toolbarRef);
  // A narrow frame (under 8 × `--prime-space-20`, 640 at the default root size) stacks the two
  // switches, each across the toolbar with its segments sharing the width; the viewport switch
  // drops its titles by itself when even then they do not fit.
  const narrow =
    toolbarSize !== null &&
    toolbarSize.width > 0 &&
    toolbarSize.width <
      NARROW_STEPS * readCssLengthPx("--prime-space-20", TOKEN_DEFAULTS["--prime-space-20"]);

  React.useEffect(() => {
    if (copyState === "idle") return;
    const timer = window.setTimeout(() => setCopyState("idle"), COPY_FEEDBACK_MS);
    return () => window.clearTimeout(timer);
  }, [copyState]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState("copied");
      onCopy?.();
    } catch {
      setCopyState("error");
    }
  };

  const copyLabel =
    copyState === "copied" ? labels.copied : copyState === "error" ? labels.copyError : labels.copy;
  // Button.Icon cross-fades a glyph that changes in place.
  const ThemeGlyph = colorScheme === "light" ? Moon : Sun;
  const CopyGlyph = copyState === "copied" ? Check : Copy;

  return (
    <div ref={toolbarRef} className={styles.toolbar} data-narrow={narrow || undefined}>
      <div className={styles.toolbarLine1}>
        <SegmentedControl.Root
          className={styles.toolbarPaneSegment}
          fullWidth={narrow}
          value={pane}
          onValueChange={(v) => onPaneChange(v as Pane)}
          size="s"
          aria-label={labels.paneSwitch}
        >
          <SegmentedControl.Item value="preview">
            <SegmentedControl.Icon>
              <Eye />
            </SegmentedControl.Icon>
            {labels.preview}
          </SegmentedControl.Item>
          <SegmentedControl.Item value="code">
            <SegmentedControl.Icon>
              <CodeXml />
            </SegmentedControl.Icon>
            {labels.code}
          </SegmentedControl.Item>
        </SegmentedControl.Root>
        <div className={styles.toolbarLine1End}>
          {onColorSchemeChange ? (
            <Button.Root
              variant="soft"
              tone="neutral"
              type="button"
              size="s"
              onClick={() => onColorSchemeChange(colorScheme === "light" ? "dark" : "light")}
              aria-label={colorScheme === "light" ? labels.themeDark : labels.themeLight}
            >
              <Button.Icon>
                <ThemeGlyph size="s" tone="secondary" />
              </Button.Icon>
            </Button.Root>
          ) : null}
          <Button.Root
            variant="soft"
            tone="neutral"
            type="button"
            size="s"
            onClick={handleCopy}
            aria-label={copyLabel}
          >
            <Button.Icon data-copy-state={copyState}>
              <CopyGlyph size="s" tone="secondary" />
            </Button.Icon>
          </Button.Root>
        </div>
      </div>
      {pane === "preview" ? (
        <SegmentedControl.Root
          className={styles.toolbarViewportSegment}
          fullWidth={narrow}
          value={viewport}
          onValueChange={(v) => onViewportChange(v as ExampleFrameViewport)}
          size="s"
          aria-label={labels.viewportSwitch}
        >
          {VIEWPORTS.map((option) => {
            const ViewportGlyph = VIEWPORT_GLYPHS[option];
            return (
              <SegmentedControl.Item key={option} value={option}>
                <SegmentedControl.Icon>
                  <ViewportGlyph />
                </SegmentedControl.Icon>
                {labels[option]}
              </SegmentedControl.Item>
            );
          })}
        </SegmentedControl.Root>
      ) : null}
    </div>
  );
}

ExampleFrameToolbar.displayName = "ExampleFrame.Toolbar";
