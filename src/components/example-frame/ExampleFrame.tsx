import * as React from "react";

import { useControllableState } from "@/hooks/useControllableState";
import { Icon } from "@/icons";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { mergeRefs } from "@/internal/mergeRefs";
import { suspendTransitions } from "@/theme/applyTheme";

import { Button } from "../button/Button";
import { CodeBlock } from "../code-block/CodeBlock";
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

type ExampleFrameContextValue = {
  code: string;
  labels: ExampleFrameLabels;
  pane: Pane;
  setPane: (p: Pane) => void;
  viewport: ExampleFrameViewport;
  setViewport: (v: ExampleFrameViewport) => void;
  colorScheme: ColorScheme;
  setColorScheme: (s: ColorScheme) => void;
  showThemeToggle: boolean;
  onCopy?: () => void;
};

const [ExampleFrameProvider, useExampleFrameContext] =
  createComponentContext<ExampleFrameContextValue>("ExampleFrame");

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
  const mergedRef = React.useMemo(() => mergeRefs(rootRef, ref), [ref]);
  const previousScheme = React.useRef(colorScheme);
  React.useLayoutEffect(() => {
    if (previousScheme.current === colorScheme) return;
    previousScheme.current = colorScheme;
    if (rootRef.current) suspendTransitions(rootRef.current);
  }, [colorScheme]);

  const ctxValue = React.useMemo<ExampleFrameContextValue>(
    () => ({
      code,
      labels,
      pane,
      setPane,
      viewport,
      setViewport,
      colorScheme,
      setColorScheme,
      showThemeToggle,
      onCopy,
    }),
    [
      code,
      labels,
      pane,
      viewport,
      setViewport,
      colorScheme,
      setColorScheme,
      showThemeToggle,
      onCopy,
    ],
  );

  return (
    <ExampleFrameProvider value={ctxValue}>
      <div {...rest} ref={mergedRef} className={cx(styles.root, className)}>
        <ExampleFrameToolbar />
        {pane === "preview" ? (
          <div className={styles.previewShell}>
            <div className={styles.previewViewport} data-viewport={viewport}>
              <div
                className={styles.previewInner}
                data-preview-layout={previewLayout}
                data-theme={colorScheme}
              >
                {children}
              </div>
            </div>
          </div>
        ) : (
          <ExampleFrameCodePane />
        )}
      </div>
    </ExampleFrameProvider>
  );
}

ExampleFrame.displayName = "ExampleFrame";

function ExampleFrameToolbar() {
  const ctx = useExampleFrameContext();
  const [copyState, setCopyState] = React.useState<"idle" | "copied" | "error">("idle");

  const handleCopy = React.useCallback(async () => {
    try {
      await navigator.clipboard.writeText(ctx.code);
      setCopyState("copied");
      ctx.onCopy?.();
      window.setTimeout(() => setCopyState("idle"), 2000);
    } catch {
      setCopyState("error");
      window.setTimeout(() => setCopyState("idle"), 2000);
    }
  }, [ctx]);

  const toggleScheme = () => {
    ctx.setColorScheme(ctx.colorScheme === "light" ? "dark" : "light");
  };

  const { labels } = ctx;
  const copyLabel =
    copyState === "copied" ? labels.copied : copyState === "error" ? labels.copyError : labels.copy;

  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarLine1}>
        <SegmentedControl.Root
          className={styles.toolbarPaneSegment}
          value={ctx.pane}
          onValueChange={(v) => ctx.setPane(v as Pane)}
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
          {ctx.showThemeToggle ? (
            <Button.Root
              variant="soft"
              tone="neutral"
              type="button"
              size="s"
              onClick={toggleScheme}
              aria-label={ctx.colorScheme === "light" ? labels.themeDark : labels.themeLight}
            >
              <Button.Icon>
                {ctx.colorScheme === "light" ? (
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
            {/* Both glyphs stay mounted and cross-fade in place (see `.copyIcon`). */}
            <Button.Icon className={styles.copyIcon} data-copy-state={copyState}>
              <Icon name="action.copy" size="s" tone="secondary" data-glyph="copy" />
              <Icon name="action.check" size="s" tone="secondary" data-glyph="check" />
            </Button.Icon>
          </Button.Root>
        </div>
      </div>
      {ctx.pane === "preview" ? (
        <SegmentedControl.Root
          className={styles.toolbarViewportSegment}
          value={ctx.viewport}
          onValueChange={(v) => ctx.setViewport(v as ExampleFrameViewport)}
          size="s"
          aria-label={labels.viewportSwitch}
        >
          {VIEWPORTS.map((viewport) => (
            <SegmentedControl.Item key={viewport} value={viewport}>
              <SegmentedControl.Icon>
                <Icon name={`viewport.${viewport}`} />
              </SegmentedControl.Icon>
              <span className={styles.viewportLabel}>{labels[viewport]}</span>
            </SegmentedControl.Item>
          ))}
        </SegmentedControl.Root>
      ) : null}
    </div>
  );
}

ExampleFrameToolbar.displayName = "ExampleFrame.Toolbar";

function ExampleFrameCodePane() {
  const ctx = useExampleFrameContext();
  const trimmed = ctx.code.trimEnd();

  return (
    // Plain CodeBlock is not focusable itself; the scrolling pane takes keyboard focus instead.
    <section
      className={styles.codePane}
      data-theme={ctx.colorScheme}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: scrollable region must be keyboard-reachable
      tabIndex={0}
      aria-label={ctx.labels.codeRegion}
    >
      <CodeBlock variant="ghost" code={trimmed} colorScheme={ctx.colorScheme} />
    </section>
  );
}

ExampleFrameCodePane.displayName = "ExampleFrame.CodePane";
