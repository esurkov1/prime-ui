import { Code2, Eye, Monitor, Smartphone, Tablet } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { CodeBlock } from "@/components/code-block/CodeBlock";
import { SegmentedControl } from "@/components/segmented-control/SegmentedControl";
import { Icon, IconCheck } from "@/icons";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";
import { suspendTransitions } from "@/theme/applyTheme";

import styles from "./ExampleFrame.module.css";

type Pane = "preview" | "code";
export type ExampleFrameViewport = "desktop" | "tablet" | "mobile";
type ColorScheme = "light" | "dark";

/**
 * Layout of the preview children, so snippets need no wrapper divs for rows and stacks.
 * `matrix`: labelled specimens — every direct child is a row, its children are cells (a specimen
 * above its caption), and cells line up in columns across rows.
 */
export type ExampleFramePreviewLayout =
  | "default"
  | "stack"
  | "stack-center"
  | "stack-narrow"
  | "dense-stack"
  | "row"
  | "row-start"
  | "row-wrap"
  | "matrix";

export type ExampleFrameLabels = {
  preview: string;
  code: string;
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
  preview: "Превью",
  code: "Код",
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

export type ExampleFrameRootProps = {
  /** Source shown on the code pane (TS/TSX highlighting) and copied by the copy button. */
  code: string;
  children?: React.ReactNode;
  className?: string;
  /** Управляемая цветовая схема превью (light/dark). */
  colorScheme?: ColorScheme;
  defaultColorScheme?: ColorScheme;
  onColorSchemeChange?: (scheme: ColorScheme) => void;
  /** Preview width (desktop / tablet / mobile). Default `desktop`. */
  viewport?: ExampleFrameViewport;
  defaultViewport?: ExampleFrameViewport;
  onViewportChange?: (v: ExampleFrameViewport) => void;
  /** Показывать ли кнопку переключения light/dark в тулбаре. */
  showThemeToggle?: boolean;
  /** Вызывается после успешного копирования `code` в буфер. */
  onCopy?: () => void;
  /**
   * Как выстроить детей внутри превью. По умолчанию — по центру (один блок).
   * Для списков из нескольких компонентов используйте `stack` / `stack-center` / `row`.
   */
  previewLayout?: ExampleFramePreviewLayout;
  labels?: Partial<ExampleFrameLabels>;
};

function ExampleFrameRoot({
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
}: ExampleFrameRootProps) {
  const labels = React.useMemo(() => ({ ...EXAMPLE_FRAME_LABELS, ...labelsProp }), [labelsProp]);
  const [pane, setPane] = React.useState<Pane>("preview");
  const [uncontrolledViewport, setUncontrolledViewport] =
    React.useState<ExampleFrameViewport>(defaultViewport);
  const [uncontrolledScheme, setUncontrolledScheme] =
    React.useState<ColorScheme>(defaultColorScheme);

  const isSchemeControlled = colorSchemeProp !== undefined;
  const colorScheme = isSchemeControlled ? colorSchemeProp : uncontrolledScheme;

  // Theme switch inside the frame is instant: no color transition from the old theme.
  const rootRef = React.useRef<HTMLDivElement>(null);
  const previousScheme = React.useRef(colorScheme);
  React.useLayoutEffect(() => {
    if (previousScheme.current === colorScheme) return;
    previousScheme.current = colorScheme;
    if (rootRef.current) suspendTransitions(rootRef.current);
  }, [colorScheme]);

  const isViewportControlled = viewportProp !== undefined;
  const viewport = isViewportControlled ? viewportProp : uncontrolledViewport;

  const setColorScheme = React.useCallback(
    (next: ColorScheme) => {
      if (!isSchemeControlled) {
        setUncontrolledScheme(next);
      }
      onColorSchemeChange?.(next);
    },
    [isSchemeControlled, onColorSchemeChange],
  );

  const setViewport = React.useCallback(
    (next: ExampleFrameViewport) => {
      if (!isViewportControlled) {
        setUncontrolledViewport(next);
      }
      onViewportChange?.(next);
    },
    [isViewportControlled, onViewportChange],
  );

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

  let previewChildren: React.ReactNode = null;
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.type === ExampleFrameStage) {
      previewChildren = (child.props as { children?: React.ReactNode }).children ?? null;
    }
  });
  if (previewChildren === null) {
    previewChildren = children;
  }

  return (
    <ExampleFrameProvider value={ctxValue}>
      <div ref={rootRef} className={cx(styles.root, className)}>
        <ExampleFrameToolbar />
        {pane === "preview" ? (
          <div className={styles.previewShell}>
            <div className={styles.previewViewport} data-viewport={viewport}>
              <div
                className={styles.previewInner}
                data-preview-layout={previewLayout}
                data-theme={colorScheme}
              >
                {previewChildren}
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

ExampleFrameRoot.displayName = "ExampleFrame.Root";

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
        >
          <SegmentedControl.Item value="preview">
            <SegmentedControl.Icon>
              <Eye size={14} strokeWidth={2} aria-hidden />
            </SegmentedControl.Icon>
            {labels.preview}
          </SegmentedControl.Item>
          <SegmentedControl.Item value="code">
            <SegmentedControl.Icon>
              <Code2 size={14} strokeWidth={2} aria-hidden />
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
              <IconCheck size="s" tone="secondary" data-glyph="check" />
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
        >
          <SegmentedControl.Item value="desktop">
            <SegmentedControl.Icon>
              <Monitor size={14} strokeWidth={2} aria-hidden />
            </SegmentedControl.Icon>
            <span className={styles.viewportLabel}>{labels.desktop}</span>
          </SegmentedControl.Item>
          <SegmentedControl.Item value="tablet">
            <SegmentedControl.Icon>
              <Tablet size={14} strokeWidth={2} aria-hidden />
            </SegmentedControl.Icon>
            <span className={styles.viewportLabel}>{labels.tablet}</span>
          </SegmentedControl.Item>
          <SegmentedControl.Item value="mobile">
            <SegmentedControl.Icon>
              <Smartphone size={14} strokeWidth={2} aria-hidden />
            </SegmentedControl.Icon>
            <span className={styles.viewportLabel}>{labels.mobile}</span>
          </SegmentedControl.Item>
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
      <CodeBlock.Root variant="ghost" code={trimmed} colorScheme={ctx.colorScheme} />
    </section>
  );
}

ExampleFrameCodePane.displayName = "ExampleFrame.CodePane";

export type ExampleFrameStageProps = {
  children: React.ReactNode;
};

function ExampleFrameStage({ children }: ExampleFrameStageProps) {
  return <>{children}</>;
}

ExampleFrameStage.displayName = "ExampleFrame.Stage";

export const ExampleFrame = {
  Root: ExampleFrameRoot,
  Stage: ExampleFrameStage,
};
