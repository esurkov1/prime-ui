import type * as React from "react";

import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import surfaceStyles from "@/internal/floatingSurface.module.css";
import overlayMotion from "@/internal/overlayMotion.module.css";
import { Portal } from "@/internal/Portal";
import sheetStyles from "@/internal/sheet.module.css";
import { Slot } from "@/internal/slot";
import type { ControlSize } from "@/internal/states";

import { LayerProvider } from "./layerStack";
import type { FloatingLayer } from "./useFloatingLayer";

export type FloatingPanelProps = Omit<React.HTMLAttributes<HTMLElement>, "onAnimationEnd"> & {
  floating: FloatingLayer;
  /** Tier of the panel (`data-size`) and of the controls inside. */
  size: ControlSize;
  /** The panel scrolls (a ScrollContainer) instead of a plain `<div>`. */
  scroll?: boolean;
  /** The raised floating surface (radius, shadow, fill). Default `true`. */
  surface?: boolean;
  ref?: React.Ref<HTMLElement>;
};

/**
 * The panel of a floating layer: portaled to `<body>` when it opens (so it stacks above every
 * layer opened before it, on the one overlay z-index), positioned, animated from `data-state` /
 * `data-side` (foundation §8), a size context for the controls inside, and a layer context so
 * layers opened inside stack above it in the layer stack. Renders nothing while closed. A layer in
 * sheet mode (`floating.sheet`) renders a scrim and a bottom sheet with a grab handle around the
 * same panel element; the consumer ref stays on the panel.
 */
export function FloatingPanel({
  floating,
  size,
  scroll = false,
  surface = true,
  className,
  onKeyDown,
  children,
  ref,
  ...rest
}: FloatingPanelProps) {
  const mergedRef = useMergedRefs<HTMLElement>(floating.panelRef, ref);
  if (!floating.mounted) return null;

  const { sheet, presence } = floating;
  const panelRef = sheet ? ref : mergedRef;
  const props = {
    ...rest,
    className: sheet
      ? cx(surfaceStyles.sheetContent, className)
      : cx(
          surface && surfaceStyles.surface,
          surfaceStyles.layer,
          overlayMotion.floating,
          className,
        ),
    "data-size": size,
    ...(sheet
      ? null
      : {
          "data-state": presence.state,
          "data-side": floating.side,
          onAnimationEnd: presence.onExitEnd,
        }),
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event);
      floating.onKeyDown(event);
    },
  };

  const panel = scroll ? (
    <ScrollContainer {...props} ref={panelRef as React.Ref<HTMLDivElement>}>
      {children}
    </ScrollContainer>
  ) : (
    <div {...props} ref={panelRef as React.Ref<HTMLDivElement>}>
      {children}
    </div>
  );

  return (
    <Portal>
      <LayerProvider value={floating.layer}>
        <ControlSizeProvider value={size}>
          {sheet ? (
            <>
              <div
                role="presentation"
                className={cx(surfaceStyles.scrim, surfaceStyles.layer, overlayMotion.scrim)}
                data-state={presence.state}
              />
              <div
                ref={floating.panelRef}
                className={cx(
                  surfaceStyles.sheet,
                  surfaceStyles.layer,
                  overlayMotion.sheet,
                  sheetStyles.swipeY,
                )}
                data-state={presence.state}
                onAnimationEnd={presence.onExitEnd}
                onPointerDown={floating.onSheetPointerDown}
              >
                <div className={sheetStyles.handle} data-swipe-handle="" aria-hidden="true" />
                {panel}
              </div>
            </>
          ) : (
            panel
          )}
        </ControlSizeProvider>
      </LayerProvider>
    </Portal>
  );
}

export type FloatingTriggerProps = {
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
