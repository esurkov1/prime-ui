import * as React from "react";

import { useMergedRefs } from "@/hooks/useMergedRefs";

type AnyProps = Record<string, unknown>;
type Handler = (...args: unknown[]) => unknown;

const isPrevented = (event: unknown) =>
  typeof event === "object" && event !== null && (event as Event).defaultPrevented === true;

function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...slotProps };

  for (const key of Object.keys(childProps)) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];

    if (key === "ref") continue;
    if (key === "className") {
      // NavLink (and similar) pass className as a function receiving route state.
      // When slot has a plain string and child has a function, compose them.
      if (typeof childValue === "function" && typeof slotValue === "string") {
        const slotClass = slotValue;
        merged[key] = (...args: unknown[]) => {
          const resolved = (childValue as Handler)(...args);
          return [slotClass, resolved].filter(Boolean).join(" ") || undefined;
        };
      } else {
        const parts = [slotValue, childValue].filter(Boolean);
        merged[key] = parts.length > 0 ? parts.join(" ") : undefined;
      }
    } else if (key === "style") {
      merged[key] =
        slotValue != null && childValue != null
          ? { ...(slotValue as object), ...(childValue as object) }
          : (childValue ?? slotValue);
    } else if (key === "aria-describedby" && slotValue && childValue) {
      merged[key] = `${childValue} ${slotValue}`;
    } else if (
      key.startsWith("on") &&
      typeof slotValue === "function" &&
      typeof childValue === "function"
    ) {
      // The child's handler runs first; `preventDefault()` in it skips the slot's handler.
      merged[key] = (...args: unknown[]) => {
        (childValue as Handler)(...args);
        if (!isPrevented(args[0])) (slotValue as Handler)(...args);
      };
    } else if (childValue !== undefined) {
      // Child props override slot props
      merged[key] = childValue;
    }
  }

  return merged;
}

/** Stops a click on a disabled `asChild` element before any handler of the child runs. */
function blockDisabledClick(event: React.MouseEvent) {
  event.preventDefault();
  event.stopPropagation();
}

/** What a slot reads from its child: the child's own `ref` (React 19: a regular prop). */
type SlotChildProps<E extends HTMLElement> = AnyProps & { ref?: React.Ref<E> };

type SlotProps<E extends HTMLElement = HTMLElement> = {
  children?: React.ReactNode;
  ref?: React.Ref<E>;
} & AnyProps;

/**
 * The props of a slot part (`Trigger`, `Close`, `Confirm`, `Anchor`): exactly one element, which
 * takes the part's behaviour. A slot part renders no DOM of its own, so it has no `className`.
 */
export type SlotPartProps = { children: React.ReactElement };

/**
 * Merges its own props onto the single React child element.
 * The basis of the `asChild` polymorphism pattern (same idea as Radix UI `Slot`).
 *
 * Merge rules:
 * - `className` — space-joined (slot first, child second)
 * - `style`     — shallow-merged; child keys win
 * - `aria-describedby` — both ids, child first
 * - `on*` handlers — both fire, child first; a child `preventDefault()` skips the slot handler
 * - All other props — a defined child prop overrides the slot prop
 * - `ref` — merged with the child's ref
 * - `aria-disabled` on the slot — the child leaves the Tab order (`tabIndex -1`), a link loses its
 *   `href` (it stays a `link` by role), and clicks (pointer and keyboard-activated) are stopped in
 *   the capture phase, so the child's own `onClick` never runs and nothing navigates
 */
export function Slot<E extends HTMLElement = HTMLElement>({
  children,
  ref,
  ...slotProps
}: SlotProps<E>) {
  const child = React.isValidElement<SlotChildProps<E>>(children) ? children : null;
  const composedRef = useMergedRefs<E>(ref, child?.props.ref);

  if (!child) return <>{children}</>;

  const merged = mergeProps(slotProps, child.props);
  const disabled = slotProps["aria-disabled"] === true || slotProps["aria-disabled"] === "true";
  if (disabled) {
    if (merged.href !== undefined) {
      merged.href = undefined;
      merged.role ??= "link";
    }
    merged.tabIndex = -1;
    merged.onClickCapture = blockDisabledClick;
  }

  return React.cloneElement(child, { ...merged, ref: composedRef });
}

Slot.displayName = "Slot";

// ─── Outlet ──────────────────────────────────────────────────────────────────

/** One part moved into an outlet: its id (a key for the outlet) and what it renders. */
type OutletEntry = { id: string; node: React.ReactNode };

/**
 * The place in a host that renders parts written elsewhere in its subtree: a page's own
 * `AppHeader.Root` in the app shell's header row, page tools wrapped in a page component in the
 * header's second row. The host owns one store (`useOutletStore`) and renders its entries
 * (`useOutletEntries`); a part moves in with `useMovedToOutlet`. The store is external to React
 * state, so a part that updates re-renders the outlet only — never the host, never the part's own
 * tree.
 */
export type OutletStore = {
  /** Adds or replaces the part `id` (it keeps the place it first took); `null` takes it out. */
  set: (id: string, node: React.ReactNode | null) => void;
  subscribe: (listener: () => void) => () => void;
  entries: () => readonly OutletEntry[];
};

function createOutletStore(): OutletStore {
  const parts = new Map<string, React.ReactNode>();
  let entries: readonly OutletEntry[] = [];
  const listeners = new Set<() => void>();
  return {
    set(id, node) {
      if (node === null) {
        if (!parts.delete(id)) return;
      } else {
        parts.set(id, node);
      }
      entries = Array.from(parts, ([key, value]) => ({ id: key, node: value }));
      for (const listener of listeners) listener();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    entries: () => entries,
  };
}

/** The outlet store of a host, created once. */
export function useOutletStore(): OutletStore {
  const [store] = React.useState(createOutletStore);
  return store;
}

const NO_ENTRIES: readonly OutletEntry[] = [];

/** The parts moved into `store`, in the order they first arrived (none on the server). */
export function useOutletEntries(store: OutletStore): readonly OutletEntry[] {
  return React.useSyncExternalStore(store.subscribe, store.entries, () => NO_ENTRIES);
}

/**
 * Moves `node` into the outlet `store` (`null` — no outlet: the part stays where it is written).
 * Returns `true` once the part has moved: render nothing then. Until then — on the server and in
 * the first client render — the part renders in place, so the server HTML has it; the move happens
 * before the browser paints. The part leaves the outlet when it unmounts.
 */
export function useMovedToOutlet(store: OutletStore | null, node: React.ReactNode): boolean {
  const id = React.useId();
  const [moved, setMoved] = React.useState(false);
  // Every render: the outlet shows the part as it renders now.
  React.useLayoutEffect(() => {
    if (!store) return;
    store.set(id, node);
    setMoved(true);
  });
  React.useLayoutEffect(() => {
    if (!store) return;
    return () => store.set(id, null);
  }, [store, id]);
  return store !== null && moved;
}

/**
 * The one element child of an `asChild` part, whose own children the part wraps
 * (`React.cloneElement(child, undefined, …child.props.children)`). Throws a named error otherwise.
 */
export function slotChild(
  children: React.ReactNode,
  part: string,
): React.ReactElement<{ children?: React.ReactNode }> {
  if (!React.isValidElement<{ children?: React.ReactNode }>(children)) {
    throw new Error(`[prime-ui-kit] ${part} asChild needs a single element child.`);
  }
  return children;
}
