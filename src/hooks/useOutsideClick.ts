import * as React from "react";

/**
 * `pointerdown` — floating panels (Popover, Dropdown, Select…): dismiss as soon as the press
 * starts outside. `click` — scrim layers (Modal, Drawer): the press must start AND end outside
 * the panel, so a drag from inside the dialog onto the scrim never closes it and the dismissing
 * click is consumed by the scrim instead of falling through to the page.
 */
export type OutsideClickTrigger = "pointerdown" | "click";

type OutsideClickLayer = {
  refs: React.RefObject<Array<React.RefObject<HTMLElement | null>>>;
  onOutsideClick: React.RefObject<(event: Event) => void>;
  trigger: OutsideClickTrigger;
};

/**
 * Stack of open floating layers, innermost last (same idea as the Escape stack in
 * `useEscapeKey`). One document listener asks only the topmost layer: a press outside it
 * dismisses it and nothing else, so a click outside a Select that is open inside a Modal closes
 * the Select only, and clicks inside a nested (portaled) child layer never reach the parent.
 */
const layers: OutsideClickLayer[] = [];

/** A `click`-mode layer whose dismissing press started outside it (cleared on the next press). */
let pendingClickLayer: OutsideClickLayer | null = null;

/**
 * True while a `pointerdown` outside a floating layer is dismissing it (until the press's own
 * mousedown has run). Focus then follows the pointer: the layer must NOT return focus to its
 * trigger — the press moves focus to the control under the pointer, or to nothing on empty space,
 * so a focused field blurs in the same click. Escape (and scrim clicks of Modal / Drawer) still
 * restore focus. Read by `useFocusTrap` and by layers that move focus themselves on dismiss.
 */
let pointerDismiss = false;

export function isPointerDismiss(): boolean {
  return pointerDismiss;
}

function isOutside(layer: OutsideClickLayer, target: Node) {
  return !layer.refs.current.some((ref) => ref.current?.contains(target));
}

/* A key press is never a pointer dismiss (e.g. Escape right after a press in the same task). */
function onDocumentKeyDown() {
  pointerDismiss = false;
}

function onDocumentPointerDown(event: PointerEvent) {
  pendingClickLayer = null;
  pointerDismiss = false;
  const top = layers[layers.length - 1];
  const target = event.target;
  if (!top || !(target instanceof Node) || !isOutside(top, target)) return;
  if (top.trigger === "click") {
    pendingClickLayer = top;
    return;
  }
  pointerDismiss = true;
  /* The press's mousedown (which moves focus) is dispatched in the same task; clear after it. */
  window.setTimeout(() => {
    pointerDismiss = false;
  }, 0);
  top.onOutsideClick.current(event);
}

function onDocumentClick(event: MouseEvent) {
  const layer = pendingClickLayer;
  pendingClickLayer = null;
  const top = layers[layers.length - 1];
  const target = event.target;
  if (!layer || layer !== top || !(target instanceof Node) || !isOutside(layer, target)) return;
  layer.onOutsideClick.current(event);
}

function addLayer(layer: OutsideClickLayer) {
  if (layers.length === 0) {
    document.addEventListener("pointerdown", onDocumentPointerDown, true);
    document.addEventListener("click", onDocumentClick, true);
    document.addEventListener("keydown", onDocumentKeyDown, true);
  }
  layers.push(layer);
}

function removeLayer(layer: OutsideClickLayer) {
  const index = layers.lastIndexOf(layer);
  if (index !== -1) layers.splice(index, 1);
  if (pendingClickLayer === layer) pendingClickLayer = null;
  if (layers.length === 0) {
    document.removeEventListener("pointerdown", onDocumentPointerDown, true);
    document.removeEventListener("click", onDocumentClick, true);
    document.removeEventListener("keydown", onDocumentKeyDown, true);
  }
}

type UseOutsideClickParams = {
  /** The layer and its trigger: a press inside any of them is not "outside". */
  refs: Array<React.RefObject<HTMLElement | null>>;
  /** Registers the layer while true (normally: while open). */
  enabled: boolean;
  /**
   * Called on a press outside while this layer is the topmost one. A layer that opts out
   * (`closeOnOutsideClick={false}`) still registers and passes a no-op, so it keeps blocking the
   * layers below it.
   */
  onOutsideClick: (event: Event) => void;
  /** Default `pointerdown`; scrim layers use `click`. */
  trigger?: OutsideClickTrigger;
};

export function useOutsideClick({
  refs,
  enabled,
  onOutsideClick,
  trigger = "pointerdown",
}: UseOutsideClickParams) {
  const refsRef = React.useRef(refs);
  refsRef.current = refs;
  const handlerRef = React.useRef(onOutsideClick);
  handlerRef.current = onOutsideClick;

  React.useEffect(() => {
    if (!enabled) return;
    const layer: OutsideClickLayer = { refs: refsRef, onOutsideClick: handlerRef, trigger };
    addLayer(layer);
    return () => removeLayer(layer);
  }, [enabled, trigger]);
}
