import * as React from "react";

import { captureOpener, focusBack, focusInto, type Opener } from "@/internal/overlay/focus";
import { type DismissReason, type LayerEntry, useLayer } from "@/internal/overlay/layerStack";

import { useInertSiblings } from "./useInertSiblings";
import { useScrollLock } from "./useScrollLock";

type UseModalLayerOptions = {
  open: boolean;
  /** Escape asks the layer to close (the owner's `closeOnEscape`). */
  closeOnEscape: boolean;
  /** A click on the scrim asks the layer to close (the owner's `closeOnOutsideClick`). */
  closeOnOutsideClick: boolean;
  /** A dismiss the options allow: Escape (`escape`) or a click on the scrim (`scrim`). */
  onDismiss: (reason: DismissReason) => void;
};

type ModalLayer<T extends HTMLElement> = {
  /** Attach to the panel (`role="dialog"`): the trap container and the inside of the layer. */
  ref: React.RefObject<T | null>;
  /** Pass to `<LayerProvider value={layer}>` around the content: nested layers stack above. */
  layer: LayerEntry;
};

/**
 * The mechanics of a modal layer — Modal, Drawer, Sheet, ConfirmDialog, CommandMenu, MediaViewer,
 * the off-canvas Sidebar — in one fixed order: the rest of the page becomes inert, focus moves in
 * and Tab is trapped, document scroll locks, and the layer joins the stack with scrim (`click`)
 * dismissal, filtered by `closeOnEscape` / `closeOnOutsideClick` before `onDismiss` hears of it. On close the page is
 * restored first, then focus returns to the opener, captured at the open transition — the control
 * that was pressed (Safari does not focus a clicked button), else the focused element; a layer a
 * pointer opened returns focus without the focus ring. Focus always returns, also after a scrim
 * click: the page behind was inert, so the opener is the only place to continue from (foundation
 * §8).
 */
export function useModalLayer<T extends HTMLElement = HTMLElement>({
  open,
  closeOnEscape,
  closeOnOutsideClick,
  onDismiss,
}: UseModalLayerOptions): ModalLayer<T> {
  const ref = React.useRef<T | null>(null);

  // Read while rendering the open transition: before a child `autoFocus` moves focus inside.
  const openerRef = React.useRef<Opener>({ element: null, target: null, byPointer: false });
  const wasOpenRef = React.useRef(false);
  if (open !== wasOpenRef.current) {
    wasOpenRef.current = open;
    if (open) openerRef.current = captureOpener();
  }

  useInertSiblings(open, ref);

  // Declared after `useInertSiblings`: its cleanup lifts `inert` before focus goes back.
  React.useEffect(() => {
    const node = ref.current;
    if (!open || !node) return;
    focusInto(node);
    return () => {
      const { element: opener, byPointer } = openerRef.current;
      // A layer above this one that closes in the same commit may still hold the opener inert:
      // its cleanup runs after this one. Focus it once every cleanup of the commit has run.
      if (opener?.closest("[inert]")) queueMicrotask(() => focusBack(opener, byPointer));
      else focusBack(opener, byPointer);
    };
  }, [open]);

  useScrollLock(open);

  const layer = useLayer(open, {
    refs: [ref],
    dismiss: "click",
    trap: true,
    onDismiss: (reason) => {
      if (reason === "escape" ? closeOnEscape : closeOnOutsideClick) onDismiss(reason);
    },
  });

  return { ref, layer };
}
