import * as React from "react";

/**
 * The bubble hug: a bubble of text is as wide as its widest laid-out line, not the width its lines
 * wrapped in (CSS `fit-content` keeps a wrapped paragraph at the full width it had).
 *
 * After layout, in the commit that changed the text and before paint (so the morph's look after
 * the commit is the hugged one), the bubble's width is cleared, its lines are measured once and the
 * width is written once — one read pass, one write pass. Lines are measured in the bubble's layout
 * (a part's `offsetLeft` and its lines relative to it), so a part moving by a transform in flight
 * reads the same. What it hugs:
 * - the text-like parts (`data-message-fit`: text, author, reply, forwarded) — every line of their
 *   text, with the end padding and border of the blocks around it (a quote, a code block, inline
 *   code); the meta's spacer counts only on the last line, where it sits;
 * - the reactions row, as one line of chips and the meta's room after them (chips that wrap at the
 *   full width keep the full width);
 * - nothing else: a bubble with any other part (a card, a player, a picture, the consumer's own)
 *   keeps the width its parts give it.
 *
 * A width depends only on the bubble's text and the row's width: it is cached by both, so a row
 * the window renders again takes its width with nothing measured. The row's width comes from one
 * shared `ResizeObserver` (batched per frame, before paint); the text from the commit. Hover, a
 * menu, the reaction bar, selection or a morph change neither, so they never measure. Fonts that
 * finish loading measure every mounted bubble again, once.
 */

type Hug = {
  article: HTMLElement;
  bubble: HTMLElement;
  /** The row's inline size, from the observer (`null` until it reported). */
  row: number | null;
  /** The key of the width last applied. */
  applied: string | null;
};

/** Widths by text and row width: `null` — the bubble keeps its own width. */
const cache = new Map<string, number | null>();
const CACHE_LIMIT = 5000;
const hugs = new Map<Element, Hug>();
let observer: ResizeObserver | null = null;
let fontsWatched = false;

const px = (value: string) => Number.parseFloat(value) || 0;

/** What the width depends on besides the row's width: the bubble's text and its kind. */
function textKey(hug: Hug): string {
  const { article, bubble } = hug;
  return [
    article.dataset.direction,
    article.dataset.avatars ?? "",
    bubble.dataset.shell,
    bubble.dataset.sized ?? "",
    bubble.textContent,
  ].join("\u0001");
}

/**
 * The content width the bubble hugs at, or `null` when it keeps its own width (not a bubble of text
 * only, nothing laid out, or its lines fill the width they have). Reads only; the bubble's own width
 * is cleared before.
 */
function measure(bubble: HTMLElement): number | null {
  if (bubble.dataset.shell !== "bubble" || bubble.dataset.sized !== undefined) return null;
  if (typeof document.createRange !== "function") return null;
  const probe = document.createRange();
  if (typeof probe.getClientRects !== "function") return null;
  const style = getComputedStyle(bubble);
  const start = px(style.paddingLeft) + px(style.borderLeftWidth);
  const inner = bubble.clientWidth - px(style.paddingLeft) - px(style.paddingRight);
  if (inner <= 0) return null;
  let need = 0;
  const inset = new Map<Element, number>();
  /** The end padding and border of the boxes between `node` and the part (a quote, code). */
  const trailing = (node: Element, part: Element): number => {
    let sum = 0;
    for (let el: Element | null = node; el && el !== part.parentElement; el = el.parentElement) {
      let own = inset.get(el);
      if (own === undefined) {
        const s = getComputedStyle(el);
        own = s.position === "absolute" ? Number.NaN : px(s.paddingRight) + px(s.borderRightWidth);
        inset.set(el, own);
      }
      sum += own;
    }
    return sum;
  };
  for (const child of Array.from(bubble.children)) {
    const part = child as HTMLElement;
    if (part.hasAttribute("data-morph-skip") || part.hasAttribute("data-morph-ghost")) {
      if (part.hasAttribute("data-message-reactions")) {
        const row = rowNeed(part);
        if (row === null) return null;
        need = Math.max(need, row);
      }
      continue;
    }
    if (part.hasAttribute("data-message-meta")) continue;
    if (!part.hasAttribute("data-message-fit")) return null;
    // The part's lines relative to the part, placed at its layout offset in the bubble.
    const box = part.getBoundingClientRect();
    const offset = part.offsetLeft - start;
    const lines: DOMRect[] = [];
    const walker = document.createTreeWalker(part, NodeFilter.SHOW_TEXT);
    for (let text = walker.nextNode(); text; text = walker.nextNode()) {
      const parent = text.parentElement;
      if (!parent || !text.textContent?.trim() || parent.closest("[data-message-spacer]")) continue;
      const end = trailing(parent, part);
      if (Number.isNaN(end)) continue;
      probe.selectNodeContents(text);
      for (const rect of Array.from(probe.getClientRects())) {
        if (rect.width <= 0) continue;
        lines.push(rect);
        need = Math.max(need, rect.right - box.left + offset + end);
      }
    }
    // The meta's spacer on the last line: the line's end, the spacer's gap and its width.
    const spacer = part.querySelector<HTMLElement>("[data-message-spacer]");
    if (spacer && spacer.offsetParent !== null) {
      const rect = spacer.getBoundingClientRect();
      const gap = px(getComputedStyle(spacer).marginLeft);
      const onLine = lines.filter((line) => line.top < rect.bottom && line.bottom > rect.top);
      const lineEnd = onLine.length
        ? Math.max(...onLine.map((line) => line.right)) - box.left + offset
        : offset;
      need = Math.max(need, lineEnd + (onLine.length ? gap : 0) + rect.width);
    }
  }
  if (need <= 0) return null;
  const width = Math.ceil(need);
  // Lines that fill the width they have: the bubble keeps it.
  return width < inner - 0.5 ? width : null;
}

/**
 * The reactions row as one line: its chips (with their gaps) and the meta's room after them, or
 * `null` when the chips wrap at the full width (the bubble keeps it).
 */
function rowNeed(slot: HTMLElement): number | null {
  const row = slot.querySelector<HTMLElement>('[role="group"]');
  if (!row || slot.dataset.state !== "open") return 0;
  let width = 0;
  let top: number | null = null;
  for (const child of Array.from(row.children) as HTMLElement[]) {
    if (child.offsetParent === null) continue;
    if (top !== null && Math.abs(child.offsetTop - top) > 1) return null;
    top ??= child.offsetTop;
    const s = getComputedStyle(child);
    // The meta's room is pushed to the end by an auto margin: its own width counts.
    width +=
      child.offsetWidth +
      px(s.marginRight) +
      (child.hasAttribute("data-message-spacer") ? 0 : px(s.marginLeft));
  }
  const s = getComputedStyle(row);
  return width + px(s.paddingLeft) + px(s.paddingRight);
}

function write(hug: Hug, width: number | null) {
  const { bubble } = hug;
  if (width === null) bubble.style.removeProperty("inline-size");
  else {
    const style = getComputedStyle(bubble);
    const outer = width + px(style.paddingLeft) + px(style.paddingRight);
    bubble.style.inlineSize = `${outer}px`;
  }
}

/** Hugs a batch: cached widths written at once; the rest cleared, measured, then written. */
function run(batch: Hug[]) {
  const measured: { hug: Hug; key: string }[] = [];
  for (const hug of batch) {
    if (!hug.bubble.isConnected || hug.row === null) continue;
    const key = `${textKey(hug)}\u0001${Math.round(hug.row)}`;
    if (key === hug.applied) continue;
    const cached = cache.get(key);
    if (cached !== undefined) {
      write(hug, cached);
      hug.applied = key;
    } else {
      measured.push({ hug, key });
    }
  }
  if (measured.length === 0) return;
  for (const { hug } of measured) hug.bubble.style.removeProperty("inline-size");
  const widths = measured.map(({ hug }) => measure(hug.bubble));
  measured.forEach(({ hug, key }, index) => {
    const width = widths[index] ?? null;
    write(hug, width);
    hug.applied = key;
    if (cache.size >= CACHE_LIMIT) cache.delete(cache.keys().next().value as string);
    cache.set(key, width);
  });
}

function observe(hug: Hug) {
  if (typeof ResizeObserver === "undefined") return;
  observer ??= new ResizeObserver((entries) => {
    const batch: Hug[] = [];
    for (const entry of entries) {
      const hug = hugs.get(entry.target);
      if (!hug) continue;
      const size = entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;
      if (hug.row !== null && Math.abs(size - hug.row) < 0.5) continue;
      hug.row = size;
      batch.push(hug);
    }
    run(batch);
  });
  observer.observe(hug.article);
  if (!fontsWatched && typeof document !== "undefined" && document.fonts?.ready) {
    fontsWatched = true;
    document.fonts.ready.then(() => {
      cache.clear();
      const all = Array.from(hugs.values());
      for (const hug of all) hug.applied = null;
      run(all);
    });
  }
}

type BubbleHugProps = { bubble: React.RefObject<HTMLElement | null> };

/**
 * Hugs its message's bubble. Rendered before the morph's snapshot in the message, so its layout
 * effect runs first in a commit: the morph reads the hugged width as the new layout.
 */
export function BubbleHug({ bubble }: BubbleHugProps) {
  const hug = React.useRef<Hug | null>(null);
  React.useLayoutEffect(() => {
    // The message's own ref is not attached yet (an ancestor's comes after its children's effects).
    const box = bubble.current;
    const host = box?.closest<HTMLElement>("[data-message-article]") ?? null;
    if (!host || !box) return;
    const entry: Hug = { article: host, bubble: box, row: null, applied: null };
    hug.current = entry;
    hugs.set(host, entry);
    observe(entry);
    return () => {
      observer?.unobserve(host);
      hugs.delete(host);
      hug.current = null;
    };
  }, [bubble]);
  // Every commit of the message: its text may have changed (a known row width only — the first
  // width comes from the observer, before the first paint).
  React.useLayoutEffect(() => {
    if (hug.current) run([hug.current]);
  });
  return null;
}
