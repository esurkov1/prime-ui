import * as React from "react";

/** The border box of an element in px, rounded. */
type ElementSize = { width: number; height: number };

type ObserveOptions = {
  /** Observe nothing while `false` (the element is not needed yet). Default `true`. */
  enabled?: boolean;
};

type ResizeOptions = ObserveOptions & {
  /**
   * Also observe the element's children, including ones added later: a row whose own box keeps
   * its size while an item in it grows (a label, a count, fonts loading).
   */
  children?: boolean;
};

const rounded = (width: number, height: number): ElementSize => ({
  width: Math.round(width),
  height: Math.round(height),
});

const sizeOf = (element: Element): ElementSize => {
  const rect = element.getBoundingClientRect();
  return rounded(rect.width, rect.height);
};

/** The size an observer entry reports: its border box (the content box where none is given). */
const entrySize = (entry: ResizeObserverEntry): ElementSize => {
  const box = entry.borderBoxSize?.[0];
  return box
    ? rounded(box.inlineSize, box.blockSize)
    : rounded(entry.contentRect.width, entry.contentRect.height);
};

const sameSize = (a: ElementSize | null, b: ElementSize | null) =>
  a === b || (a !== null && b !== null && a.width === b.width && a.height === b.height);

/**
 * Subscribes to the element `ref` holds and follows it: a ref that takes another node (a part
 * that mounts later, a host that swaps its element) moves the subscription before paint.
 */
function useRefNode<E extends Element>(
  ref: React.RefObject<E | null>,
  enabled: boolean,
  subscribe: (node: E) => () => void,
) {
  const subscribeRef = React.useRef(subscribe);
  const active = React.useRef<{ node: E; stop: () => void } | null>(null);
  React.useLayoutEffect(() => {
    subscribeRef.current = subscribe;
    const node = enabled ? ref.current : null;
    if (active.current?.node === node) return;
    active.current?.stop();
    active.current = node ? { node, stop: subscribeRef.current(node) } : null;
  });
  React.useLayoutEffect(
    () => () => {
      active.current?.stop();
      active.current = null;
    },
    [],
  );
}

/**
 * The size of the element `ref` holds, as state: measured before paint and again whenever it
 * changes (ResizeObserver), `null` while there is no element. A host that only re-lays out its own
 * DOM (an indicator, a fit check) takes `useResizeEffect` instead and never re-renders.
 */
export function useElementSize<E extends Element>(
  ref: React.RefObject<E | null>,
  { enabled = true }: ObserveOptions = {},
): ElementSize | null {
  const [size, setSize] = React.useState<ElementSize | null>(null);
  useRefNode(ref, enabled, (node) => {
    const update = (next: ElementSize | null) =>
      setSize((prev) => (sameSize(prev, next) ? prev : next));
    update(sizeOf(node));
    if (typeof ResizeObserver === "undefined") return () => update(null);
    const observer = new ResizeObserver(([entry]) => update(entry ? entrySize(entry) : null));
    observer.observe(node);
    return () => {
      observer.disconnect();
      update(null);
    };
  });
  return size;
}

/**
 * Calls `onResize` whenever the element `ref` holds changes size (and, with `children`, any of its
 * children, also ones added later). The callback runs outside React: a host writes its DOM there
 * (places an indicator, re-fits a row) and re-renders only if it decides to. The first layout is
 * the host's own; this follows the changes after it.
 */
export function useResizeEffect<E extends Element>(
  ref: React.RefObject<E | null>,
  onResize: () => void,
  { enabled = true, children = false }: ResizeOptions = {},
): void {
  const callback = React.useRef(onResize);
  React.useLayoutEffect(() => {
    callback.current = onResize;
  });
  useRefNode(ref, enabled, (node) => {
    if (typeof ResizeObserver === "undefined") return () => {};
    const observer = new ResizeObserver(() => callback.current());
    const observeAll = () => {
      observer.observe(node);
      if (children) for (const child of Array.from(node.children)) observer.observe(child);
    };
    observeAll();
    const mutation = children ? new MutationObserver(observeAll) : null;
    mutation?.observe(node, { childList: true });
    return () => {
      mutation?.disconnect();
      observer.disconnect();
    };
  });
}
