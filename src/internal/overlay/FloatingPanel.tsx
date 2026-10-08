import * as React from "react";

import { ScrollContainer } from "@/components/scroll-container/ScrollContainer";
import { useMergedRefs } from "@/hooks/useMergedRefs";
import { ControlSizeProvider } from "@/internal/ControlSizeContext";
import { cx } from "@/internal/cx";
import surfaceStyles from "@/internal/floatingSurface.module.css";
import { DropdownLayerContext, useOverlayPortalLayer } from "@/internal/OverlayPortalLayerContext";
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
  /**
   * Stacking tier: `popover` panels sit under `dropdown` panels (menus, listboxes) of the same
   * portal layer, `tooltip` above both.
   */
  tier: "popover" | "dropdown" | "tooltip";
  /** The panel scrolls (a ScrollContainer) instead of a plain `<div>`. */
  scroll?: boolean;
  /** The raised floating surface (radius, shadow, fill). Default `true`. */
  surface?: boolean;
  ref?: React.Ref<HTMLElement>;
};

/**
 * The panel of a floating layer: portaled to `<body>`, positioned, animated from `data-state` /
 * `data-side` (foundation §8), a size context for the controls inside, and a layer context so
 * layers opened inside stack above it. Renders nothing while closed.
 */
export function FloatingPanel({
  floating,
  size,
  tier,
  scroll = false,
  surface = true,
  className,
  onKeyDown,
  children,
  ref,
  ...rest
}: FloatingPanelProps) {
  const portalLayer = useOverlayPortalLayer();
  const aboveDropdown = React.useContext(DropdownLayerContext);
  const panelRef = useMergedRefs<HTMLElement>(floating.panelRef, ref);
  if (!floating.mounted) return null;

  const props = {
    ...rest,
    ref: panelRef,
    className: cx(
      surface && surfaceStyles.surface,
      tier === "popover" && surfaceStyles.popoverLayer,
      tier === "dropdown" && surfaceStyles.dropdownLayer,
      overlayMotion.floating,
      className,
    ),
    "data-state": floating.presence.state,
    "data-side": floating.side,
    "data-size": size,
    "data-overlay-portal-layer": portalLayer,
    "data-overlay-stack": tier === "popover" && aboveDropdown ? "above-dropdown" : undefined,
    onAnimationEnd: floating.presence.onExitEnd,
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
      onKeyDown?.(event);
      floating.onKeyDown(event);
    },
  };

  return (
    <Portal>
      <LayerProvider value={floating.layer}>
        <DropdownLayerContext.Provider value={tier === "dropdown" || aboveDropdown}>
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
        </DropdownLayerContext.Provider>
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
