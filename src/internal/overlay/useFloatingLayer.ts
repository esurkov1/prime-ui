import * as React from "react";

import { type PositionOptions, type PositionSide, usePosition } from "@/hooks/usePosition";
import { type MotionDurationToken, type Presence, usePresence } from "@/hooks/usePresence";

import { focusBack, focusInto, getFocusable } from "./focus";
import { type DismissReason, type LayerEntry, useLayer } from "./layerStack";

export type UseFloatingLayerOptions = PositionOptions & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The anchor: positions the panel, is not "outside", and gets focus back on close. */
  triggerRef: React.RefObject<HTMLElement | null>;
  /** Escape closes the panel. Default `true`. */
  closeOnEscape?: boolean;
  /** A press outside the panel and its trigger closes it. Default `true`. */
  closeOnOutsideClick?: boolean;
  /**
   * `pointerdown` (default) — a regular floating panel. `none` — a passive layer (Tooltip): no
   * part in presses or Tab, no focus restore; Escape still closes it first.
   */
  dismiss?: "pointerdown" | "none";
  /** Focus moves into the panel on open (`[data-autofocus]` → first tab stop → the panel). */
  focusOnOpen?: boolean;
  /** Tab cycles inside the panel. */
  trap?: boolean;
  /**
   * Without `trap`, how Tab leaves the panel (focus goes to the trigger and the panel closes):
   * `always` — any Tab (menus, listboxes); `edges` — Tab past the last / Shift+Tab before the first
   * tab stop (dialog-like panels); `none` — focus never sits in the panel.
   */
  tabExit?: "always" | "edges" | "none";
  /** Exit animation token. Default `fast`. */
  exitDuration?: MotionDurationToken;
  /** Unmount at once on close, skipping the exit animation (a Tooltip replaced by its neighbour). */
  skipExit?: boolean;
};

export type FloatingLayer = {
  open: boolean;
  presence: Presence;
  /** Render the panel while true. */
  mounted: boolean;
  /** The side after flipping. */
  side: PositionSide;
  /** Attach to the panel element (merged with a consumer ref). */
  panelRef: React.RefCallback<HTMLElement>;
  /** The panel element while mounted. */
  contentRef: React.RefObject<HTMLElement | null>;
  layer: LayerEntry;
  /**
   * Closes the panel and returns focus to the trigger when it was in the panel (Escape, a pick,
   * Tab, a close button, code).
   */
  close: () => void;
  /** Tab leaving the panel; part of the panel's `onKeyDown`. */
  onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
};

/**
 * The one floating-layer primitive: Popover, Dropdown, Tooltip, Select and TagSelect. Presence
 * (exit animation), positioning against the trigger, a place in the layer stack and one focus
 * policy (foundation §8): focus returns to the trigger after Escape, a pick, Tab or a close — not
 * after a press outside, where focus follows the pointer. Render the panel with `FloatingPanel`.
 */
export function useFloatingLayer({
  open,
  onOpenChange,
  triggerRef,
  closeOnEscape = true,
  closeOnOutsideClick = true,
  dismiss = "pointerdown",
  focusOnOpen = false,
  trap = false,
  tabExit = "none",
  exitDuration = "fast",
  skipExit = false,
  ...positionOptions
}: UseFloatingLayerOptions): FloatingLayer {
  const presence = usePresence(open, { exitDuration });
  const mounted = presence.mounted && (open || !skipExit);
  const contentRef = React.useRef<HTMLElement | null>(null);
  // Keeps its position while the exit animation plays.
  const position = usePosition(mounted, triggerRef, contentRef, positionOptions);
  // The portaled panel reaches the DOM one commit after its owner: effects wait for the node.
  const [panel, setPanel] = React.useState<HTMLElement | null>(null);
  const { attachLayer } = position;
  const panelRef = React.useCallback(
    (node: HTMLElement | null) => {
      attachLayer(node);
      setPanel(node);
    },
    [attachLayer],
  );

  /** Set by a press outside: focus follows the pointer instead of returning to the trigger. */
  const outsideRef = React.useRef(false);

  const close = React.useCallback(() => {
    outsideRef.current = false;
    onOpenChange(false);
  }, [onOpenChange]);

  const onDismiss = (reason: DismissReason) => {
    if (reason === "escape") {
      if (closeOnEscape) close();
    } else if (closeOnOutsideClick) {
      outsideRef.current = true;
      onOpenChange(false);
    }
  };

  const layer = useLayer(open, {
    refs: [contentRef, triggerRef],
    dismiss,
    trap,
    onDismiss,
  });

  const passive = dismiss === "none";
  React.useEffect(() => {
    if (!open || !panel || passive) return;
    outsideRef.current = false;
    if (focusOnOpen) focusInto(panel);
    return () => {
      if (outsideRef.current) return;
      const active = document.activeElement;
      if (!active || active === document.body || panel.contains(active)) {
        focusBack(triggerRef.current);
      }
    };
  }, [open, panel, passive, focusOnOpen, triggerRef]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab" || event.defaultPrevented || trap || tabExit === "none") return;
    const node = contentRef.current;
    if (!node) return;
    if (tabExit === "edges") {
      const focusable = getFocusable(node);
      const active = document.activeElement;
      const leaving = event.shiftKey
        ? active === node || active === focusable[0]
        : focusable.length === 0 || active === focusable[focusable.length - 1];
      if (!leaving) return;
    }
    // Shift+Tab lands on the trigger; Tab goes on from it to the next stop of the page.
    if (event.shiftKey) event.preventDefault();
    focusBack(triggerRef.current);
    close();
  };

  return {
    open,
    presence,
    mounted,
    side: position.side,
    panelRef,
    contentRef,
    layer,
    close,
    onKeyDown,
  };
}
