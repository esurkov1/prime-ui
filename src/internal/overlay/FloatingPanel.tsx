import type * as React from "react";

import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { SWIPE_HANDLE_ATTRIBUTE, type SwipeDismiss } from "@/hooks/useSwipeDismiss";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import surfaceStyles from "@/internal/floatingSurface.module.css";
import overlayMotion from "@/internal/overlayMotion.module.css";
import { Portal } from "@/internal/Portal";
import sheetStyles from "@/internal/sheet.module.css";
import { Slot } from "@/internal/slot";
import type { ControlSize } from "@/internal/states";
import { SurfaceDepthProvider } from "@/internal/surfaceDepth";

import { LayerProvider } from "./layerStack";
import type { FloatingLayer } from "./useFloatingLayer";

/**
 * The grab bar of a bottom sheet (Sheet, a Modal or a floating layer as a phone sheet): drawn only
 * while the swipe exists, `aria-hidden` (the gesture is an extra way out next to Escape and the
 * scrim). The drag starts on it or on the header right after it.
 */
export function SheetHandle({ swipe }: { swipe: Pick<SwipeDismiss, "enabled"> }) {
  if (!swipe.enabled) return null;
  return (
    <div className={sheetStyles.handle} {...{ [SWIPE_HANDLE_ATTRIBUTE]: "" }} aria-hidden="true" />
  );
}

/** How wide an anchored panel is (`data-width` on the floating surface). */
export type FloatingWidth = "auto" | "trigger" | "min-trigger" | "content";

/** A fixed measure of an anchored panel: 1.5, 2 or 2.5 panel minimums (Dropdown `width`). */
export type PanelMeasure = "s" | "m" | "l";

/**
 * The panel is a `<div>`; `E` is the element type its consumer holds it as (a menu, a listbox:
 * `HTMLElement`), so the consumer ref needs no cast.
 */
type FloatingPanelProps<E extends HTMLElement = HTMLDivElement> = Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onAnimationEnd"
> & {
  floating: FloatingLayer;
  /** Tier of the panel (`data-size`) and of the controls inside. */
  size: ControlSize;
  /** The panel scrolls (a ScrollContainer) instead of a plain `<div>`. */
  scroll?: boolean;
  /** The raised floating surface (radius, shadow, fill). Default `true`. */
  surface?: boolean;
  /**
   * `auto` — the content's width between the panel minimum (or the trigger's width) and twice the
   * minimum; `trigger` — exactly the trigger's width; `content` — what the content needs, within
   * the viewport; `s` / `m` / `l` — a fixed measure (`PanelMeasure`), within the viewport. A
   * bottom sheet is always full width.
   */
  width?: FloatingWidth | PanelMeasure;
  ref?: React.Ref<E>;
};

/**
 * The panel of a floating layer: portaled to `<body>` when it opens (so it stacks above every
 * layer opened before it, on the one overlay z-index), positioned, animated from `data-state` /
 * `data-side` (foundation §8), a size context for the controls inside, and a layer context so
 * layers opened inside stack above it in the layer stack. Renders nothing while closed. A layer in
 * sheet mode (`floating.sheet`) renders a scrim and a bottom sheet with a grab handle around the
 * same panel element, which then carries `data-sheet`; the consumer ref stays on the panel.
 */
export function FloatingPanel<E extends HTMLElement = HTMLDivElement>({
  floating,
  size,
  scroll = false,
  surface = true,
  width = "auto",
  className,
  onKeyDown,
  children,
  ref,
  ...rest
}: FloatingPanelProps<E>) {
  const mergedRef = useMergedRefs<E>(floating.panelRef, ref);
  if (!floating.mounted) return null;

  const { sheet, presence, swipe } = floating;
  const props = {
    ...rest,
    className: sheet
      ? cx(surfaceStyles.sheetPanel, className)
      : cx(
          surface && surfaceStyles.surface,
          surfaceStyles.layer,
          overlayMotion.floating,
          className,
        ),
    "data-size": size,
    ...(sheet
      ? { "data-sheet": "" }
      : {
          ...(surface ? { "data-depth": "floating", "data-width": width } : null),
          "data-state": presence.state,
          "data-side": floating.side,
          onAnimationEnd: presence.onExitEnd,
        }),
    onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      floating.onKeyDown(event);
    },
  };
  // A div is every `E` the consumer may hold it as.
  const panelRef = (sheet ? ref : mergedRef) as React.Ref<HTMLDivElement> | undefined;

  const panel = scroll ? (
    // An open layer: a touch scroll at its end never moves the page (the wheel: `useContainScroll`).
    <ScrollContainer {...props} edges="shadow" overscrollBehavior="contain" ref={panelRef}>
      {children}
    </ScrollContainer>
  ) : (
    <div {...props} ref={panelRef}>
      {children}
    </div>
  );

  return (
    <Portal>
      <LayerProvider value={floating.layer}>
        <SurfaceDepthProvider value="floating">
          <ControlSizeProvider value={size}>
            {sheet ? (
              <>
                <div
                  role="presentation"
                  className={cx(sheetStyles.scrim, overlayMotion.scrim)}
                  data-state={presence.state}
                />
                <div
                  ref={floating.panelRef}
                  className={cx(
                    sheetStyles.surface,
                    surfaceStyles.sheet,
                    overlayMotion.sheet,
                    sheetStyles.swipeY,
                  )}
                  data-depth="floating"
                  data-state={presence.state}
                  onAnimationEnd={presence.onExitEnd}
                  onPointerDown={swipe.onPointerDown}
                  {...swipe.panelProps}
                >
                  <SheetHandle swipe={swipe} />
                  {panel}
                </div>
              </>
            ) : (
              panel
            )}
          </ControlSizeProvider>
        </SurfaceDepthProvider>
      </LayerProvider>
    </Portal>
  );
}

type FloatingTriggerProps = {
  /** Props of the layer for its trigger: `ref`, ARIA, handlers, `data-state`. */
  triggerProps: Record<string, unknown> & { ref?: React.Ref<HTMLElement> };
  children: React.ReactElement;
} & Record<string, unknown>;

/**
 * The trigger of a floating layer: merges the layer's `triggerProps` onto the single child, and
 * forwards every other prop it receives (handlers, ARIA, `ref`) the same way, so a trigger wrapped
 * by another trigger (`Tooltip.Trigger` around `Dropdown.Trigger`) keeps both. Handlers chain,
 * `aria-describedby` ids join, the child's own props win.
 */
export function FloatingTrigger({ triggerProps, children, ...forwarded }: FloatingTriggerProps) {
  return (
    <Slot {...forwarded}>
      <Slot {...triggerProps}>{children}</Slot>
    </Slot>
  );
}
