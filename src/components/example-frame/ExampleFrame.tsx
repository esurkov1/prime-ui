import { Code2, Eye, Monitor, Smartphone, Tablet } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/button/Button";
import { CodeBlock } from "@/components/code-block/CodeBlock";
import { SegmentedControl } from "@/components/segmented-control/SegmentedControl";
import { Icon } from "@/icons";
import { createComponentContext } from "@/internal/context";
import { cx } from "@/internal/cx";

import styles from "./ExampleFrame.module.css";

type Pane = "preview" | "code";
export type ExampleFrameViewport = "desktop" | "tablet" | "mobile";
type ColorScheme = "light" | "dark";

/** Раскладка содержимого превью — чтобы в сниппетах не оборачивать компоненты в div.stack/row. */
export type ExampleFramePreviewLayout =
  | "default"
  | "stack"
  | "stack-center"
  | "stack-narrow"
  | "dense-stack"
  | "row"
  | "row-start"
  | "row-wrap";

type ExampleFrameContextValue = {
  code: string;
  language: string;
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
  /** Исходный текст для вкладки «Код» и для копирования (независимо от активной вкладки). */
  code: string;
  /** Зарезервировано под будущую мультиязычность; сейчас подсветка всегда TS/TSX (`CodeBlock`). */
  language?: string;
  children?: React.ReactNode;
  className?: string;
  /** Управляемая цветовая схема превью (light/dark). */
  colorScheme?: ColorScheme;
  defaultColorScheme?: ColorScheme;
  onColorSchemeChange?: (scheme: ColorScheme) => void;
  /** Управляемая ширина превью (desktop / tablet / mobile). */
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
  /**
   * Синхронизация с глобальным бренд-пресетом (например playground: `data-theme-preset` на `html`).
   * Если задан только `data-theme` без пресета, на узле действует «голый» dark/light из theme-*.css —
   * без оверлеев `[data-theme][data-theme-preset]` из playground, цвета превью расходятся с оболочкой.
   */
  themePreset?: string;
};

function ExampleFrameRoot({
  code,
  language = "tsx",
  children,
  className,
  colorScheme: colorSchemeProp,
  defaultColorScheme = "light",
  onColorSchemeChange,
  viewport: viewportProp,
  defaultViewport = "tablet",
  onViewportChange,
  showThemeToggle = true,
  onCopy,
  previewLayout = "default",
  themePreset,
}: ExampleFrameRootProps) {
  const [pane, setPane] = React.useState<Pane>("preview");
  const [uncontrolledViewport, setUncontrolledViewport] =
    React.useState<ExampleFrameViewport>(defaultViewport);
  const [uncontrolledScheme, setUncontrolledScheme] =
    React.useState<ColorScheme>(defaultColorScheme);

  const isSchemeControlled = colorSchemeProp !== undefined;
  const colorScheme = isSchemeControlled ? colorSchemeProp : uncontrolledScheme;

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
      language,
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
      language,
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

  const wrapStackPreviewLines = previewLayout === "stack" || previewLayout === "stack-narrow";
  /* Fragment в сниппетах — один ребёнок у Root; toArray разворачивает его, иначе все поля
   * попадают в один .previewStackLine с flex-direction: row. */
  const previewCanvasBody = wrapStackPreviewLines
    ? React.Children.toArray(previewChildren).map((child, index) => {
        if (child == null) return child;
        if (!React.isValidElement(child)) return child;
        return (
          <div
            key={child.key ?? `prime-preview-row-${String(index)}`}
            className={styles.previewStackLine}
          >
            {child}
          </div>
        );
      })
    : previewChildren;

  return (
    <ExampleFrameProvider value={ctxValue}>
      <div className={cx(styles.root, className)}>
        <ExampleFrameToolbar />
        {pane === "preview" ? (
          <div className={styles.previewShell}>
            <div className={styles.previewViewport} data-viewport={viewport}>
              <div
                className={styles.previewInner}
                data-theme={colorScheme}
                {...(themePreset != null && themePreset !== ""
                  ? { "data-theme-preset": themePreset }
                  : {})}
              >
                <div className={styles.previewCanvas} data-preview-layout={previewLayout}>
                  {previewCanvasBody}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <ExampleFrameCodePane themePreset={themePreset} />
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

  const copyLabel =
    copyState === "copied" ? "Скопировано" : copyState === "error" ? "Ошибка" : "Копировать код";

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
            Preview
          </SegmentedControl.Item>
          <SegmentedControl.Item value="code">
            <SegmentedControl.Icon>
              <Code2 size={14} strokeWidth={2} aria-hidden />
            </SegmentedControl.Icon>
            Code
          </SegmentedControl.Item>
        </SegmentedControl.Root>
        <div className={styles.toolbarLine1End}>
          {ctx.showThemeToggle ? (
            <Button.Root
              type="button"
              variant="neutral"
              mode="lighter"
              size="s"
              onClick={toggleScheme}
              aria-label={
                ctx.colorScheme === "light" ? "Включить тёмную тему" : "Включить светлую тему"
              }
            >
              <Button.Icon>
                {ctx.colorScheme === "light" ? (
                  <Icon name="theme.dark" size="s" tone="subtle" />
                ) : (
                  <Icon name="theme.light" size="s" tone="subtle" />
                )}
              </Button.Icon>
            </Button.Root>
          ) : null}
          <Button.Root
            type="button"
            variant="neutral"
            mode="lighter"
            size="s"
            onClick={handleCopy}
            aria-label={copyLabel}
          >
            <Button.Icon>
              <Icon name="action.copy" size="s" tone="subtle" />
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
            Desktop
          </SegmentedControl.Item>
          <SegmentedControl.Item value="tablet">
            <SegmentedControl.Icon>
              <Tablet size={14} strokeWidth={2} aria-hidden />
            </SegmentedControl.Icon>
            Tablet
          </SegmentedControl.Item>
          <SegmentedControl.Item value="mobile">
            <SegmentedControl.Icon>
              <Smartphone size={14} strokeWidth={2} aria-hidden />
            </SegmentedControl.Icon>
            Mobile
          </SegmentedControl.Item>
        </SegmentedControl.Root>
      ) : null}
    </div>
  );
}

ExampleFrameToolbar.displayName = "ExampleFrame.Toolbar";

function ExampleFrameCodePane({ themePreset }: { themePreset?: string }) {
  const ctx = useExampleFrameContext();
  const trimmed = ctx.code.trimEnd();
  const presetProps =
    themePreset != null && themePreset !== "" ? { "data-theme-preset": themePreset } : {};

  return (
    <div className={styles.codePane} data-theme={ctx.colorScheme} {...presetProps}>
      <CodeBlock.Root code={trimmed} colorScheme={ctx.colorScheme} />
    </div>
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
