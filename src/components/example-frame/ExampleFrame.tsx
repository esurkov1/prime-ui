import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { Icon } from "@/icons";
import { cx } from "@/internal/cx";
import {
  SurfaceDepthProvider,
  useNestedSurfaceDepth,
  useStageDepth,
} from "@/internal/surfaceDepth";
import { VisuallyHidden } from "@/internal/VisuallyHidden";
import { suspendTransitions } from "@/theme/applyTheme";

import { Button } from "../button/Button";
import { CodeBlock } from "../code-block/CodeBlock";
import { ScrollContainer } from "../scroll-container/ScrollContainer";
import { SegmentedControl } from "../segmented-control/SegmentedControl";
import styles from "./ExampleFrame.module.css";

type Pane = "preview" | "code";
const VIEWPORTS = ["desktop", "tablet", "mobile"] as const;
export type ExampleFrameViewport = (typeof VIEWPORTS)[number];
type ColorScheme = "light" | "dark";

/**
 * Layout of the preview children, so snippets need no wrapper divs for rows and stacks.
 * `matrix`: labelled specimens — every direct child is a row, its children are cells (a specimen
 * above its caption), and cells line up in columns across rows.
 */
export type ExampleFramePreviewLayout =
  | "default"
  | "stack"
  | "stack-narrow"
  | "full"
  | "row"
  | "matrix";

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

const EXAMPLE_FRAME_LABELS: ExampleFrameLabels = {
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

/** How long the copy button shows «copied» / «error» before it returns to «copy». */
const COPY_FEEDBACK_MS = 2000;

/** A block that wants the whole stage width: a `fullWidth` control or a table. */
const STRETCH_SELECTOR = '[data-full-width="true"], table';
const MATRIX_MAX_COLUMNS = 12;

const holdsStretch = (node: Node) =>
  node instanceof Element &&
  (node.matches(STRETCH_SELECTOR) || node.querySelector(STRETCH_SELECTOR) !== null);

/**
 * Facts about the opaque preview children that the stage layouts need: which direct child holds a
 * stretching block (`data-preview-stretch` on it and `data-stretch` on the stage) and, for
 * `matrix`, the cell count of the first row (`--matrix-columns`) and whether the column grid fits
 * the stage (`data-matrix-wrap` when it does not: each row wraps its cells on its own). Read from
 * the DOM here, not by `:has()` in CSS: a descendant `:has()` on the stage and on every element
 * under it re-matches on every DOM insert inside the example (a virtualized list restyled ~10k
 * elements per frame). A MutationObserver re-reads only when a change can matter.
 */
function usePreviewFacts(
  stageRef: React.RefObject<HTMLDivElement | null>,
  layout: ExampleFramePreviewLayout,
  active: boolean,
) {
  React.useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!active || !stage) return;
    // The width the column grid needs, measured when it overflowed; while the rows wrap the grid
    // is not laid out, so the stage returns to it only once it is at least this wide again.
    let gridWidth = 0;
    const fitMatrix = (remeasure: boolean) => {
      if (layout !== "matrix") {
        stage.removeAttribute("data-matrix-wrap");
        return;
      }
      if (stage.hasAttribute("data-matrix-wrap")) {
        if (!remeasure && stage.clientWidth < gridWidth) return;
        stage.removeAttribute("data-matrix-wrap");
      }
      if (stage.scrollWidth > stage.clientWidth + 1) {
        gridWidth = stage.scrollWidth;
        stage.setAttribute("data-matrix-wrap", "");
      }
    };
    // Stretching only latches on: a virtualized list mounts and unmounts its rows while it
    // scrolls, and a full-width card leaving the window must not narrow the stage under the reader.
    const read = () => {
      for (const child of Array.from(stage.children)) {
        if (!child.hasAttribute("data-preview-stretch") && child.querySelector(STRETCH_SELECTOR)) {
          child.setAttribute("data-preview-stretch", "");
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
      fitMatrix(true);
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
    const resize =
      layout === "matrix" && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => fitMatrix(false))
        : null;
    resize?.observe(stage);
    return () => {
      observer.disconnect();
      resize?.disconnect();
    };
  }, [stageRef, layout, active]);
}

export type ExampleFrameProps = Omit<React.HTMLAttributes<HTMLDivElement>, "onCopy"> & {
  /** Source shown on the code pane (TS/TSX highlighting) and copied by the copy button. */
  code: string;
  /** The outer `<div>`. */
  ref?: React.Ref<HTMLDivElement>;
  /** Preview color scheme (controlled). */
  colorScheme?: ColorScheme;
  defaultColorScheme?: ColorScheme;
  onColorSchemeChange?: (scheme: ColorScheme) => void;
  /** Preview width (desktop / tablet / mobile). Default `desktop`. */
  viewport?: ExampleFrameViewport;
  defaultViewport?: ExampleFrameViewport;
  onViewportChange?: (v: ExampleFrameViewport) => void;
  /** Show the light / dark toggle in the toolbar. Default `true`. */
  showThemeToggle?: boolean;
  /** Called after `code` was copied to the clipboard. */
  onCopy?: () => void;
  /** How the preview lays out its children. Default `default`: one centered block. */
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
  const labels = React.useMemo(() => ({ ...EXAMPLE_FRAME_LABELS, ...labelsProp }), [labelsProp]);
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
  const stageRef = React.useRef<HTMLDivElement>(null);
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
      {pane === "preview" ? (
        <div className={styles.previewShell}>
          <div className={styles.previewViewport} data-viewport={viewport}>
            <div
              ref={stageRef}
              className={styles.previewInner}
              data-preview-layout={previewLayout}
              data-theme={colorScheme}
              data-depth={stageDepth}
            >
              {/* The stage is a page of its own (or the layer the docs ask for); surfaces inside
                  count from it. Never wrap `children` in an element: the layouts use `> *`. */}
              <SurfaceDepthProvider value={stageDepth}>{children}</SurfaceDepthProvider>
            </div>
          </div>
        </div>
      ) : (
        // Plain CodeBlock is not focusable itself; the scrolling pane takes keyboard focus instead.
        // The pane carries the theme, so the block inherits it (and trims the source itself).
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

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarLine1}>
        <SegmentedControl.Root
          className={styles.toolbarPaneSegment}
          value={pane}
          onValueChange={(v) => onPaneChange(v as Pane)}
          size="s"
          aria-label={labels.paneSwitch}
        >
          <SegmentedControl.Item value="preview">
            <SegmentedControl.Icon>
              <Icon name="view.preview" />
            </SegmentedControl.Icon>
            {labels.preview}
          </SegmentedControl.Item>
          <SegmentedControl.Item value="code">
            <SegmentedControl.Icon>
              <Icon name="view.code" />
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
                {colorScheme === "light" ? (
                  <Icon name="theme.dark" size="s" tone="secondary" />
                ) : (
                  <Icon name="theme.light" size="s" tone="secondary" />
                )}
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
            {/* Button.Icon cross-fades copy ↔ check in place. */}
            <Button.Icon data-copy-state={copyState}>
              <Icon
                name={copyState === "copied" ? "action.check" : "action.copy"}
                size="s"
                tone="secondary"
              />
            </Button.Icon>
          </Button.Root>
        </div>
      </div>
      {pane === "preview" ? (
        <SegmentedControl.Root
          className={styles.toolbarViewportSegment}
          value={viewport}
          onValueChange={(v) => onViewportChange(v as ExampleFrameViewport)}
          size="s"
          aria-label={labels.viewportSwitch}
        >
          {VIEWPORTS.map((option) => (
            <SegmentedControl.Item key={option} value={option}>
              <SegmentedControl.Icon>
                <Icon name={`viewport.${option}`} />
              </SegmentedControl.Icon>
              {/* A phone-width frame hides the visible label; the hidden one keeps the name. */}
              <span className={styles.viewportLabel} aria-hidden="true">
                {labels[option]}
              </span>
              <VisuallyHidden>{labels[option]}</VisuallyHidden>
            </SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>
      ) : null}
    </div>
  );
}

ExampleFrameToolbar.displayName = "ExampleFrame.Toolbar";
