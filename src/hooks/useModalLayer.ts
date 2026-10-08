import * as React from "react";

import { activeElement, focusBack, focusInto } from "@/internal/overlay/focus";
import { type DismissReason, type LayerEntry, useLayer } from "@/internal/overlay/layerStack";

import { useInertSiblings } from "./useInertSiblings";
import { useScrollLock } from "./useScrollLock";

export type UseModalLayerOptions = {
  open: boolean;
  /** Escape (`escape`) or a click on the scrim (`scrim`); the owner applies its `closeOn*` props. */
  onDismiss: (reason: DismissReason) => void;
};

export type ModalLayer<T extends HTMLElement> = {
  /** Attach to the panel (`role="dialog"`): the trap container and the inside of the layer. */
  ref: React.RefObject<T | null>;
  /** Pass to `<LayerProvider value={layer}>` around the content: nested layers stack above. */
  layer: LayerEntry;
};

/**
 * The mechanics of a modal layer — Modal, Drawer, CommandMenu, the off-canvas Sidebar — in one
 * fixed order: the rest of the page becomes inert, focus moves in and Tab is trapped, document
 * scroll locks, and the layer joins the stack with scrim (`click`) dismissal. On close the page is
 * restored first, then focus returns to the opener, captured at the open transition. Focus always
 * returns, also after a scrim click: the page behind was inert, so the opener is the only place to
 * continue from (foundation §8).
 */
export function useModalLayer<T extends HTMLElement = HTMLElement>({
  open,
  onDismiss,
}: UseModalLayerOptions): ModalLayer<T> {
  const ref = React.useRef<T | null>(null);

  // Read while rendering the open transition: before a child `autoFocus` moves focus inside.
  const openerRef = React.useRef<HTMLElement | null>(null);
  const wasOpenRef = React.useRef(false);
  if (open !== wasOpenRef.current) {
    wasOpenRef.current = open;
    if (open) openerRef.current = activeElement();
  }

  useInertSiblings(open, ref);

  // Declared after `useInertSiblings`: its cleanup lifts `inert` before focus goes back.
  React.useEffect(() => {
    const node = ref.current;
    if (!open || !node) return;
    focusInto(node);
    return () => focusBack(openerRef.current);
  }, [open]);

  useScrollLock(open);

  const layer = useLayer(open, { refs: [ref], dismiss: "click", trap: true, onDismiss });

  return { ref, layer };
}
