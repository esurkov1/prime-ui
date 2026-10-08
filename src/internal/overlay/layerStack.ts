import * as React from "react";

import { getFocusable } from "./focus";

/**
 * The one stack of open overlay layers (foundation §8 "Overlay contract"): Modal, Drawer, the
 * off-canvas Sidebar, CommandMenu, Popover, Dropdown, Select, TagSelect, Tooltip. One set of
 * document listeners serves every layer and only the topmost layer reacts, so one Escape or one
 * press outside closes one layer, and a press inside a nested (portaled) child layer never reaches
 * its parent. The owner gets the reason and decides about focus.
 */

/** Why the stack asks a layer to close. */
export type DismissReason = "escape" | "outside" | "scrim";

/**
 * How a press outside the layer dismisses it.
 * - `pointerdown` — floating panels: as soon as the press starts outside (reason `outside`).
 * - `click` — scrim layers: the press must start and end outside, so a drag from inside the dialog
 *   onto the scrim never closes it (reason `scrim`).
 * - `none` — the layer takes no part in presses or Tab (Tooltip); it still gets Escape first.
 *
 * A layer that opts out of outside dismissal (`closeOnOutsideClick={false}`) keeps `pointerdown` /
 * `click` and ignores the reason, so it still blocks the layers below it.
 */
export type OutsideDismiss = "pointerdown" | "click" | "none";

export type LayerEntry = {
  /** The layer that rendered this one (context): it stays below its descendants. */
  parent: LayerEntry | null;
  /** The panel first (the trap container), then other parts that are not "outside" (the trigger). */
  refs: ReadonlyArray<React.RefObject<HTMLElement | null>>;
  dismiss: OutsideDismiss;
  /** Tab cycles inside the panel while focus is in it, and is pulled back in from outside. */
  trap: boolean;
  onDismiss: (reason: DismissReason) => void;
};

const stack: LayerEntry[] = [];
/** A `click` layer whose dismissing press started outside it (cleared on the next press). */
let pendingClick: LayerEntry | null = null;

function isAncestor(ancestor: LayerEntry, entry: LayerEntry): boolean {
  for (let p = entry.parent; p; p = p.parent) if (p === ancestor) return true;
  return false;
}

function contains(entry: LayerEntry, target: Node | null): boolean {
  return target !== null && entry.refs.some((ref) => ref.current?.contains(target));
}

/** Topmost layer that takes part in presses and Tab. */
function topInteractive(): LayerEntry | undefined {
  for (let i = stack.length - 1; i >= 0; i--) {
    if (stack[i]?.dismiss !== "none") return stack[i];
  }
  return undefined;
}

function trapTab(event: KeyboardEvent) {
  const active = document.activeElement;
  for (let i = stack.length - 1; i >= 0; i--) {
    const entry = stack[i];
    if (!entry || entry.dismiss === "none") continue;
    const panel = entry.refs[0]?.current;
    if (!panel) continue;
    const inside = panel.contains(active);
    // A non-trapping layer that holds focus moves it itself (floating panels leave on Tab).
    if (!entry.trap) {
      if (inside) return;
      continue;
    }
    const focusable = getFocusable(panel);
    if (focusable.length === 0) {
      event.preventDefault();
      panel.focus({ preventScroll: true });
      return;
    }
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey ? !inside || active === first : !inside || active === last) {
      event.preventDefault();
      (event.shiftKey ? last : first)?.focus();
    }
    return;
  }
}

function onKeyDown(event: KeyboardEvent) {
  if (event.key === "Tab") {
    trapTab(event);
    return;
  }
  // A nested control (a listbox, a field) already consumed this Escape.
  if (event.key !== "Escape" || event.defaultPrevented) return;
  stack[stack.length - 1]?.onDismiss("escape");
}

function onPointerDown(event: PointerEvent) {
  pendingClick = null;
  const top = topInteractive();
  const target = event.target instanceof Node ? event.target : null;
  if (!top || !target || contains(top, target)) return;
  if (top.dismiss === "click") pendingClick = top;
  else top.onDismiss("outside");
}

function onClick(event: MouseEvent) {
  const layer = pendingClick;
  pendingClick = null;
  const target = event.target instanceof Node ? event.target : null;
  if (!layer || layer !== topInteractive() || !target || contains(layer, target)) return;
  layer.onDismiss("scrim");
}

function listen(on: boolean) {
  if (on) {
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown, true);
    document.addEventListener("click", onClick, true);
  } else {
    document.removeEventListener("keydown", onKeyDown);
    document.removeEventListener("pointerdown", onPointerDown, true);
    document.removeEventListener("click", onClick, true);
  }
}

/** Adds a layer above everything open — but below its own descendants that opened first. */
function push(entry: LayerEntry): () => void {
  if (stack.length === 0) listen(true);
  const below = stack.findIndex((other) => isAncestor(entry, other));
  if (below === -1) stack.push(entry);
  else stack.splice(below, 0, entry);
  return () => {
    const index = stack.indexOf(entry);
    if (index !== -1) stack.splice(index, 1);
    if (pendingClick === entry) pendingClick = null;
    if (stack.length === 0) listen(false);
  };
}

const LayerContext = React.createContext<LayerEntry | null>(null);

/** Wrap a layer's content: layers opened inside it register as its descendants. */
export const LayerProvider = LayerContext.Provider;

export type UseLayerOptions = Omit<LayerEntry, "parent" | "trap"> & { trap?: boolean };

/**
 * Registers a layer in the stack while `open`. The entry keeps the latest options (no
 * re-registration on a new callback). Wrap the layer's content in `<LayerProvider value={layer}>`.
 */
export function useLayer(open: boolean, options: UseLayerOptions): LayerEntry {
  const parent = React.useContext(LayerContext);
  const [entry] = React.useState<LayerEntry>(() => ({ parent, trap: false, ...options }));
  entry.parent = parent;
  entry.refs = options.refs;
  entry.dismiss = options.dismiss;
  entry.trap = options.trap ?? false;
  entry.onDismiss = options.onDismiss;

  React.useLayoutEffect(() => (open ? push(entry) : undefined), [open, entry]);

  return entry;
}
