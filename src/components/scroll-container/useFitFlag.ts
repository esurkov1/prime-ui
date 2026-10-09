import * as React from "react";

type Axis = "vertical" | "horizontal" | "both";

/*
 * A region whose content fits along its scroll axis gets `data-fits` (CSS: `overflow: hidden`).
 *
 * Why: a browser composites every `overflow: auto` region whose content reaches past its pixel-
 * snapped box, and a region that hugs its content (a SegmentedControl or Tabs row of fractional
 * width) does by a fraction of a pixel. Each such layer also promotes whatever paints over it — a
 * page of examples went from 12 to 124 layers, and every frame paid for layerizing them. A region
 * that cannot scroll needs no scroller: `hidden` clips the same, is not user-scrollable either, and
 * chains the wheel the same, but is never composited. Once the content outgrows the region the flag
 * drops before paint and the region scrolls as before.
 *
 * One ResizeObserver and one MutationObserver serve every region: they watch the region and its
 * children (the content size is theirs). A batch reads every region first, then writes.
 */
type Entry = { axis: Axis; children: Set<Element> };

const regions = new Map<HTMLElement, Entry>();
/** Observed element → the region it belongs to (the region itself or one of its children). */
const owner = new Map<Element, HTMLElement>();
let resizeObserver: ResizeObserver | null = null;
let mutationObserver: MutationObserver | null = null;
let pending: Set<HTMLElement> | null = null;
let frame = 0;

function fits(region: HTMLElement, axis: Axis): boolean {
  const x = region.scrollWidth <= region.clientWidth;
  const y = region.scrollHeight <= region.clientHeight;
  if (!(axis === "horizontal" ? x : axis === "vertical" ? y : x && y)) return false;
  // Growth is seen through the children's boxes: text straight in the region, an inline child
  // or a child without a box of its own (a ResizeObserver never reports `inline` or `contents`)
  // could outgrow it unseen, so such a region stays a scroller.
  for (const node of Array.from(region.childNodes)) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) return false;
    if (node instanceof Element) {
      const { display } = getComputedStyle(node);
      if (display === "inline" || display === "contents") return false;
    }
  }
  return true;
}

function check(targets: Iterable<HTMLElement>) {
  const results: [HTMLElement, boolean][] = [];
  for (const region of targets) {
    const entry = regions.get(region);
    if (entry && region.isConnected) results.push([region, fits(region, entry.axis)]);
  }
  for (const [region, fit] of results) region.toggleAttribute("data-fits", fit);
}

function observeChild(region: HTMLElement, entry: Entry, child: Element) {
  if (entry.children.has(child)) return;
  entry.children.add(child);
  owner.set(child, region);
  resizeObserver?.observe(child);
}

function forgetChild(entry: Entry, child: Element) {
  if (!entry.children.delete(child)) return;
  owner.delete(child);
  resizeObserver?.unobserve(child);
}

/** Removed content shrinks the region without resizing it: check on the next frame. */
function schedule(region: HTMLElement) {
  pending ??= new Set();
  pending.add(region);
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    const batch = pending ?? new Set<HTMLElement>();
    pending = null;
    check(batch);
  });
}

function observers() {
  resizeObserver ??= new ResizeObserver((entries) => {
    const batch = new Set<HTMLElement>();
    for (const { target } of entries) {
      const region = owner.get(target);
      if (region) batch.add(region);
    }
    check(batch);
  });
  mutationObserver ??= new MutationObserver(onMutations);
  return { resize: resizeObserver, mutation: mutationObserver };
}

function onMutations(records: MutationRecord[]) {
  for (const record of records) {
    const region = record.target as HTMLElement;
    const entry = regions.get(region);
    if (!entry) continue;
    // An added child reports its size to the ResizeObserver on its own.
    for (const node of Array.from(record.addedNodes)) {
      if (node instanceof Element) observeChild(region, entry, node);
    }
    if (record.removedNodes.length === 0) continue;
    for (const node of Array.from(record.removedNodes)) {
      if (node instanceof Element) forgetChild(entry, node);
    }
    schedule(region);
  }
}

function watch(region: HTMLElement, axis: Axis): () => void {
  const { resize, mutation } = observers();
  const entry: Entry = { axis, children: new Set() };
  regions.set(region, entry);
  owner.set(region, region);
  // The first notification of each observed element arrives batched after layout, before paint.
  resize.observe(region);
  for (const child of Array.from(region.children)) observeChild(region, entry, child);
  mutation.observe(region, { childList: true });
  return () => {
    for (const child of entry.children) forgetChild(entry, child);
    resize.unobserve(region);
    owner.delete(region);
    regions.delete(region);
    pending?.delete(region);
    region.removeAttribute("data-fits");
    // A MutationObserver cannot drop one target: re-observe the regions that stay, keeping the
    // records it has not delivered yet.
    const records = mutation.takeRecords();
    mutation.disconnect();
    for (const other of regions.keys()) mutation.observe(other, { childList: true });
    onMutations(records);
  };
}

/** `enabled: false` — the region stays a scroller whatever its content (a chat, a growing feed). */
export function useFitFlag(ref: React.RefObject<HTMLElement | null>, axis: Axis, enabled = true) {
  React.useLayoutEffect(() => {
    const node = ref.current;
    if (
      !enabled ||
      !node ||
      typeof ResizeObserver === "undefined" ||
      typeof MutationObserver === "undefined"
    ) {
      return;
    }
    return watch(node, axis);
  }, [ref, axis, enabled]);
}
