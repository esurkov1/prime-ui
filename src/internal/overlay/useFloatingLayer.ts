import * as React from "react";

import { COMPACT_QUERY } from "@/hooks/breakpoints";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { type PositionOptions, type PositionSide, usePosition } from "@/hooks/usePosition";
import { type Presence, usePresence } from "@/hooks/usePresence";
import { useScrollLock } from "@/hooks/useScrollLock";
import { type SwipeDismiss, useSwipeDismiss } from "@/hooks/useSwipeDismiss";
import type { MotionDurationToken } from "@/internal/motionTiming";

import { focusBack, focusInto, getFocusable, handoffFocus } from "./focus";
import { type DismissReason, type LayerEntry, useLayer } from "./layerStack";
import { useContainScroll } from "./useContainScroll";

type UseFloatingLayerOptions = PositionOptions & {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The anchor: positions the panel, is not "outside", and gets focus back on close. */
  triggerRef: React.RefObject<HTMLElement | null>;
  /** Escape closes the panel (a passive layer passes `true`: Escape always hides it). */
  closeOnEscape: boolean;
  /** A press outside the panel and its trigger, or a swipe down on its sheet, closes it. */
  closeOnOutsideClick: boolean;
  /**
   * `pointerdown` (default) — a regular floating panel. `none` — a passive layer (Tooltip): no
   * part in presses or Tab, no focus restore; Escape still closes it first.
   */
  dismiss?: "pointerdown" | "none";
  /**
   * Focus moves into the panel on open: `true` — `[data-autofocus]` → first tab stop → the panel;
   * a selector — its first match first (a menu's first enabled item, which is no tab stop).
   */
  focusOnOpen?: boolean | string;
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
  /**
   * Below 640px of viewport the panel is a bottom sheet instead of an anchored panel: a scrim,
   * a grab handle, swipe down to close, page scroll locked. For panels the user works in (menus,
   * listboxes, pickers); not for a panel driven by typing in its anchor.
   */
  sheet?: boolean;
};

export type FloatingLayer = {
  open: boolean;
  presence: Presence;
  /** Render the panel while true. */
  mounted: boolean;
  /** The side after flipping. */
  side: PositionSide;
  /** Rendered as a bottom sheet (`sheet` on a narrow viewport). */
  sheet: boolean;
  /** Swipe-to-close of the sheet: its handle shows while `enabled`; part of the sheet's props. */
  swipe: SwipeDismiss;
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
 * The one floating-layer primitive: Popover, Dropdown, Tooltip, Select, TagSelect, the reaction
 * bar of a Message and the chart tooltip. Presence (exit animation), positioning against the
 * trigger, a place in the layer stack with the dismiss options applied inside, the wheel kept off
 * the page under the panel, and one focus policy (foundation §8): focus returns to the trigger
 * after Escape, a pick, Tab or a close — not after a press outside, where focus follows the
 * pointer. Render the panel with `FloatingPanel`.
 */
export function useFloatingLayer({
  open,
  onOpenChange,
  triggerRef,
  closeOnEscape,
  closeOnOutsideClick,
  dismiss = "pointerdown",
  focusOnOpen = false,
  trap = false,
  tabExit = "none",
  exitDuration = "fast",
  skipExit = false,
  sheet: sheetOption = false,
  ...positionOptions
}: UseFloatingLayerOptions): FloatingLayer {
  const sheet = useMediaQuery(COMPACT_QUERY, sheetOption);
  // A sheet slides over `base`, an anchored panel fades over its own token.
  const presence = usePresence(open, { exitDuration: sheet ? "base" : exitDuration });
  const mounted = presence.mounted && (open || !skipExit);
  const contentRef = React.useRef<HTMLElement | null>(null);
  // Keeps its position while the exit animation plays; a sheet sits at the bottom edge instead.
  const position = usePosition(mounted && !sheet, triggerRef, contentRef, positionOptions);
  useScrollLock(open && sheet);
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
  const passive = dismiss === "none";
  // A sheet locks the page scroll itself; a passive layer takes no wheel.
  useContainScroll(open && !sheet && !passive ? panel : null);

  /** Set by a press outside: focus follows the pointer instead of returning to the trigger. */
  const outsideRef = React.useRef(false);

  const close = React.useCallback(() => {
    outsideRef.current = false;
    onOpenChange(false);
  }, [onOpenChange]);

  /** A dismiss from outside the content: focus is not pulled back to the trigger. */
  const dismissOutside = React.useCallback(() => {
    outsideRef.current = true;
    onOpenChange(false);
  }, [onOpenChange]);

  const swipe = useSwipeDismiss({
    enabled: sheet && open && closeOnOutsideClick,
    onDismiss: dismissOutside,
  });

  const onDismiss = (reason: DismissReason) => {
    if (reason === "escape") {
      if (closeOnEscape) close();
    } else if (closeOnOutsideClick) {
      dismissOutside();
    }
  };

  const layer = useLayer(open, {
    refs: [contentRef, triggerRef],
    dismiss,
    trap,
    onDismiss,
  });

  React.useEffect(() => {
    if (!open || !panel || passive) return;
    outsideRef.current = false;
    if (focusOnOpen) focusInto(panel, typeof focusOnOpen === "string" ? focusOnOpen : undefined);
    return () => {
      if (outsideRef.current) return;
      // Focus in the closing panel goes back to the trigger; so does focus lost to the body (the
      // focused item was removed while the panel was open).
      const active = document.activeElement;
      if (!active || active === document.body) focusBack(triggerRef.current);
      else handoffFocus(panel, triggerRef.current);
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
    sheet,
    swipe,
    panelRef,
    contentRef,
    layer,
    close,
    onKeyDown,
  };
}

type FloatingTriggerStateOptions = {
  open: boolean;
  setOpen: (open: boolean) => void;
  /**
   * ArrowDown and ArrowUp on the trigger open a closed layer, as on a menu button or a picker
   * (WAI-ARIA); Enter and Space open it as the trigger's click.
   */
  openOnArrow?: boolean;
};

/**
 * The props of a floating layer's trigger that follow its open state: `aria-expanded`,
 * `data-state`, the click that toggles the layer, and with `openOnArrow` the arrow keys that open
 * it. Merged onto the consumer's element by `FloatingTrigger` (the element's own handlers run
 * first; `preventDefault()` in them skips these).
 */
export function floatingTriggerProps({
  open,
  setOpen,
  openOnArrow = false,
}: FloatingTriggerStateOptions) {
  return {
    "aria-expanded": open,
    "data-state": open ? "open" : "closed",
    onClick: () => setOpen(!open),
    ...(openOnArrow
      ? {
          onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
            if (open || (event.key !== "ArrowDown" && event.key !== "ArrowUp")) return;
            event.preventDefault();
            setOpen(true);
          },
        }
      : null),
  };
}
