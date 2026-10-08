import type * as React from "react";

import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import surfaceStyles from "@/internal/floatingSurface.module.css";
import overlayMotion from "@/internal/overlayMotion.module.css";
import { Portal } from "@/internal/Portal";
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
 * layers opened inside stack above it in the layer stack. Renders nothing while closed.
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
  const panelRef = useMergedRefs<HTMLElement>(floating.panelRef, ref);
  if (!floating.mounted) return null;

  const props = {
    ...rest,
    className: cx(
      surface && surfaceStyles.surface,
      surfaceStyles.layer,
      overlayMotion.floating,
      className,
    ),
    "data-state": floating.presence.state,
    "data-side": floating.side,
    "data-size": size,
    onAnimationEnd: floating.presence.onExitEnd,
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event);
      floating.onKeyDown(event);
    },
  };

  return (
    <Portal>
      <LayerProvider value={floating.layer}>
        <ControlSizeProvider value={size}>
          {scroll ? (
            <ScrollContainer {...props} ref={panelRef as React.Ref<HTMLDivElement>}>
              {children}
            </ScrollContainer>
          ) : (
            <div {...props} ref={panelRef as React.Ref<HTMLDivElement>}>
              {children}
            </div>
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
