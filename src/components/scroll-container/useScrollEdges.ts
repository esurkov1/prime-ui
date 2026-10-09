import * as React from "react";

import { motionDurationMs } from "@/hooks/usePresence";

/** How close to an edge counts as reaching it: the next batch is asked for before the edge shows. */
const EDGE_PX = 120;
/** How close to the end still counts as «at the end» for `anchor="end"` (sub-pixel scroll, zoom). */
const PIN_PX = 4;
/** How deep the visible-position anchor is looked for (a list inside a wrapper inside the region). */
const ANCHOR_DEPTH = 4;
/**
 * A glide to the end from further than this many views first jumps to one view before the end:
 * a long history is not scrolled through frame by frame.
 */
const GLIDE_VIEWS = 3;

export type ScrollEdgeHandler = () => void | Promise<void>;

/**
 * What a ScrollContainer lets its content ask for (`useScrollRegion`): a chat list asks to go to
 * the end after its own message, to bring a message into view, and follows whether the reader is
 * at the end. The region scrolls only itself.
 */
export type ScrollRegion = {
  /** The reader is at the end (`anchor="end"`, within 4 px). */
  atEnd: () => boolean;
  /** Follows `atEnd`; returns the unsubscribe. */
  subscribe: (listener: () => void) => () => void;
  /** Scrolls to the end; `smooth` glides there (instant under reduced motion). */
  scrollToEnd: (behavior?: ScrollBehavior) => void;
  /** Scrolls the region (only) so `element` stands in its middle. */
  scrollToElement: (element: Element, behavior?: ScrollBehavior) => void;
  /**
   * Content is about to change size in place (a message opens its transcript or its reactions
   * row): for `ms`, what the reader sees stays still — even at the end of `anchor="end"`, so the
   * change grows past the edge instead of pushing everything up. Call it right before the change.
   */
  hold: (ms: number) => void;
};

const NO_REGION: ScrollRegion = {
  atEnd: () => true,
  subscribe: () => () => {},
  scrollToEnd: () => {},
  scrollToElement: () => {},
  hold: () => {},
};

export const ScrollRegionContext = React.createContext<ScrollRegion | null>(null);

/** The ScrollContainer around this component, or `null` outside one. */
export function useScrollRegion(): ScrollRegion | null {
  return React.useContext(ScrollRegionContext);
}

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia?.("(prefers-reduced-motion: reduce)").matches === true;

type Options = {
  anchor: "start" | "end";
  horizontal: boolean;
  onReachStart?: ScrollEdgeHandler;
  onReachEnd?: ScrollEdgeHandler;
};

type Edge = "start" | "end";

/**
 * Scroll anchoring and edge events of a ScrollContainer.
 *
 * - `anchor="end"` (a chat, a log): starts at the end and stays there while content arrives or
 *   grows, as long as the person is at the end — one scroll write per change, before paint. Once
 *   they scroll away, the visible content stays put.
 * - Visible position: content added, removed or resized above the view (older messages
 *   prepended, rows a virtual list renders or measures) never moves what the person is looking
 *   at. The kit corrects by the first element in view, in one pass before paint, and turns the
 *   browser's own anchoring off (`overflow-anchor: none`), so every browser behaves the same and
 *   no change is corrected twice.
 * - `onReachStart` / `onReachEnd`: fire once when the scroll position comes within `EDGE_PX` of an
 *   edge, again only after it leaves that zone or the content grows. A returned promise is pending
 *   until it settles: no new call meanwhile, `busy` is true.
 */
export function useScrollEdges(
  ref: React.RefObject<HTMLElement | null>,
  { anchor, horizontal, onReachStart, onReachEnd }: Options,
) {
  const [busy, setBusy] = React.useState(false);
  // One object for the context: the layout effect plugs the live scroller into it.
  const [region] = React.useState(() => {
    const listeners = new Set<() => void>();
    const impl = { current: NO_REGION };
    const api: ScrollRegion & { impl: typeof impl; notify: () => void } = {
      impl,
      notify: () => {
        for (const listener of listeners) listener();
      },
      atEnd: () => impl.current.atEnd(),
      subscribe: (listener) => {
        listeners.add(listener);
        return () => listeners.delete(listener);
      },
      scrollToEnd: (behavior) => impl.current.scrollToEnd(behavior),
      scrollToElement: (element, behavior) => impl.current.scrollToElement(element, behavior),
      hold: (ms) => impl.current.hold(ms),
    };
    return api;
  });
  const handlers = React.useRef({ onReachStart, onReachEnd });
  handlers.current = { onReachStart, onReachEnd };
  const hasStart = Boolean(onReachStart);
  const hasEnd = Boolean(onReachEnd);
  const keepPosition = anchor === "end" || hasStart;
  const regionImpl = region.impl;
  const notifyRegion = region.notify;

  React.useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;

    const rtl = () => horizontal && getComputedStyle(node).direction === "rtl";
    const position = () => (horizontal ? Math.abs(node.scrollLeft) : node.scrollTop);
    const size = () => (horizontal ? node.scrollWidth : node.scrollHeight);
    const view = () => (horizontal ? node.clientWidth : node.clientHeight);
    const max = () => size() - view();
    const setPosition = (value: number) => {
      if (horizontal) node.scrollLeft = rtl() ? -value : value;
      else node.scrollTop = value;
    };
    const toEnd = () => setPosition(max());
    const scrollBy = (delta: number) => {
      if (horizontal) node.scrollLeft += rtl() ? -delta : delta;
      else node.scrollTop += delta;
    };
    const glideTo = (target: number, behavior: ScrollBehavior) => {
      if (typeof node.scrollTo !== "function") {
        setPosition(target);
        return;
      }
      const at = rtl() ? -target : target;
      node.scrollTo(horizontal ? { left: at, behavior } : { top: at, behavior });
    };
    const near = (rect: DOMRect) => (horizontal ? rect.left : rect.top);
    const far = (rect: DOMRect) => (horizontal ? rect.right : rect.bottom);
    const extent = (rect: DOMRect) => (horizontal ? rect.width : rect.height);

    const state = {
      pinned: anchor === "end",
      /** A smooth glide to the end is on its way: content that grows meanwhile extends it. */
      seeking: false,
      /** Until this time an in-place change keeps the view still, even at the end. */
      holdUntil: 0,
      /** The scroll position at the last record: moving back from it is the reader's own scroll. */
      lastPosition: 0,
      anchorEl: null as Element | null,
      anchorOffset: 0,
      lastSize: size(),
      armed: { start: true, end: true } as Record<Edge, boolean>,
      pending: { start: false, end: false } as Record<Edge, boolean>,
      alive: true,
    };

    /**
     * The first element under the leading edge of the view, as deep as a list item: a binary
     * search over the children in flow order (a list of thousands reads a dozen boxes). Elements
     * marked `data-scroll-skip` are never the anchor: a sticky date stands where the view is, not
     * where it belongs, and a spacer for rows a virtual list does not render changes its own size
     * (it would hold still while the rows after it move). The search steps over them to the next
     * element of the flow.
     */
    const pickAnchor = (): Element | null => {
      const edge = near(node.getBoundingClientRect());
      const under = (element: Element) =>
        !element.hasAttribute("data-scroll-skip") && far(element.getBoundingClientRect()) > edge;
      let parent: Element = node;
      for (let depth = 0; depth < ANCHOR_DEPTH; depth += 1) {
        const children = parent.children;
        let low = 0;
        let high = children.length;
        while (low < high) {
          const mid = (low + high) >> 1;
          const child = children[mid] as Element;
          if (child.hasAttribute("data-scroll-skip")) {
            // Decide by the next element of the flow.
            let next = mid + 1;
            while (next < high && children[next]?.hasAttribute("data-scroll-skip")) next += 1;
            if (next < high && under(children[next] as Element)) high = mid;
            else low = Math.min(next + 1, high);
            continue;
          }
          if (under(child)) high = mid;
          else low = mid + 1;
        }
        let index = low;
        while (index < children.length && children[index]?.hasAttribute("data-scroll-skip")) {
          index += 1;
        }
        const hit = children[index];
        if (!hit) break;
        const rect = hit.getBoundingClientRect();
        if (hit.children.length === 0 || extent(rect) <= view()) return hit;
        parent = hit;
      }
      return parent === node ? null : parent;
    };

    /** Where `element` stands in the scrolled content (independent of the scroll position). */
    const contentOffset = (element: Element) =>
      near(element.getBoundingClientRect()) - near(node.getBoundingClientRect()) + position();

    const record = () => {
      const pos = position();
      if (anchor === "end") {
        // Only the reader moving back unpins: a scroll event of our own correction can land a
        // frame late, after content that keeps growing (an animated height) moved the end again.
        const atEnd = max() - pos <= PIN_PX;
        const back = pos < state.lastPosition - 0.5;
        // A glide to the end writes its own positions (the end may move back under it).
        const holding = performance.now() < state.holdUntil;
        const pinned = atEnd && !holding ? true : back && !state.seeking ? false : state.pinned;
        if (pinned !== state.pinned) {
          state.pinned = pinned;
          notifyRegion();
        }
      }
      state.lastPosition = pos;
      if (keepPosition) {
        state.anchorEl = pickAnchor();
        state.anchorOffset = state.anchorEl ? contentOffset(state.anchorEl) : 0;
      }
    };

    const fire = (edge: Edge) => {
      const handler =
        edge === "start" ? handlers.current.onReachStart : handlers.current.onReachEnd;
      if (!handler || !state.armed[edge] || state.pending[edge]) return;
      state.armed[edge] = false;
      const result = handler();
      if (!result || typeof result.then !== "function") return;
      state.pending[edge] = true;
      setBusy(true);
      const settle = () => {
        if (!state.alive) return;
        state.pending[edge] = false;
        setBusy(state.pending.start || state.pending.end);
        // The content may still not reach the edge (a short first page): ask again if it grew.
        if (size() > state.lastSize) state.armed[edge] = true;
        state.lastSize = size();
        checkEdges();
      };
      result.then(settle, settle);
    };

    const checkEdges = () => {
      if (!hasStart && !hasEnd) return;
      const pos = position();
      const toGo = max() - pos;
      if (pos > EDGE_PX) state.armed.start = true;
      if (toGo > EDGE_PX) state.armed.end = true;
      if (hasStart && pos <= EDGE_PX) fire("start");
      if (hasEnd && toGo <= EDGE_PX) fire("end");
    };

    const onContentChange = () => {
      // A glide to the end on its way reads the end on every frame: nothing to correct.
      if (state.seeking) {
        // (the glide's next frame follows the new end)
      } else if (anchor === "end" && state.pinned && performance.now() >= state.holdUntil) {
        if (max() - position() > 0.5) toEnd();
      } else if (
        keepPosition &&
        state.anchorEl?.isConnected &&
        // While a change in place holds the view, its owner keeps the view still itself (a chat
        // message's morph scrolls by its change and glides the rows above with transforms, which
        // would read as the anchor moving); the hold's end records the place afresh.
        performance.now() >= state.holdUntil
      ) {
        // Measured in the content, not the view: a scroll that landed since the record (a wheel
        // step whose event has not arrived yet) is the reader's own and stays.
        const delta = contentOffset(state.anchorEl) - state.anchorOffset;
        if (Math.abs(delta) >= 0.5) scrollBy(delta);
      }
      const grown = size() > state.lastSize;
      state.lastSize = size();
      if (grown) {
        state.armed.start = true;
        state.armed.end = true;
      }
      record();
      checkEdges();
    };

    const onScroll = () => {
      record();
      checkEdges();
    };

    if (anchor === "end") toEnd();
    record();
    checkEdges();

    /**
     * The glide to the end: the kit's own, one position per frame toward the end as it is on that
     * frame (ease-out over `slow`), so rows that render and measure on the way only lengthen the
     * path — the glide never stops short and never jumps back. The reader's own wheel, touch or key
     * stops it.
     */
    let glideFrame = 0;
    const stopGlide = () => {
      state.seeking = false;
      cancelAnimationFrame(glideFrame);
    };
    const glideToEnd = () => {
      stopGlide();
      // A long way back: jump to one view before the end, then glide the rest.
      if (max() - position() > view() * GLIDE_VIEWS) setPosition(max() - view());
      const from = position();
      const started = performance.now();
      const duration = Math.max(1, motionDurationMs("slow"));
      state.seeking = true;
      const step = (now: number) => {
        if (!state.seeking) return;
        const progress = Math.min(1, (now - started) / duration);
        const eased = 1 - (1 - progress) ** 3;
        setPosition(from + (max() - from) * eased);
        if (progress < 1) {
          glideFrame = requestAnimationFrame(step);
          return;
        }
        state.seeking = false;
        toEnd();
        record();
      };
      glideFrame = requestAnimationFrame(step);
    };

    regionImpl.current = {
      atEnd: () => anchor !== "end" || state.pinned,
      hold: (ms) => {
        if (!keepPosition) return;
        stopGlide();
        record();
        state.holdUntil = performance.now() + ms;
        if (state.pinned) {
          state.pinned = false;
          notifyRegion();
        }
        // Once the change has played, the end counts again if the view is there.
        window.setTimeout(() => {
          if (state.alive) record();
        }, ms);
      },
      subscribe: () => () => {},
      scrollToEnd: (behavior) => {
        if (behavior !== "smooth" || reducedMotion()) {
          stopGlide();
          toEnd();
          record();
          return;
        }
        glideToEnd();
      },
      scrollToElement: (element, behavior) => {
        const box = node.getBoundingClientRect();
        const rect = element.getBoundingClientRect();
        const delta = near(rect) - near(box) - (view() - extent(rect)) / 2;
        const target = Math.min(max(), Math.max(0, position() + delta));
        stopGlide();
        glideTo(target, behavior === "smooth" && !reducedMotion() ? "smooth" : "auto");
        // A jump away from the end unpins at once: content that changes before the scroll event
        // arrives must not pull the reader back to the end.
        if (anchor === "end" && max() - target > PIN_PX && state.pinned) {
          state.pinned = false;
          notifyRegion();
        }
        state.lastPosition = position();
      },
    };

    // Without anchoring or edge events the region only serves the requests of its content.
    if (!keepPosition && !hasStart && !hasEnd) {
      return () => {
        regionImpl.current = NO_REGION;
      };
    }

    node.addEventListener("scroll", onScroll, { passive: true });
    // The reader takes the scroll back from a glide.
    const interrupt = () => {
      if (state.seeking) stopGlide();
    };
    for (const type of ["wheel", "touchstart", "pointerdown", "keydown"]) {
      node.addEventListener(type, interrupt, { passive: true });
    }
    // Content changes: nodes added or removed anywhere inside, and size changes of the region and
    // its children (an image that loads, a message that grows). Both run before paint, so a
    // correction never flickers.
    const resize =
      typeof ResizeObserver === "undefined" ? null : new ResizeObserver(onContentChange);
    const mutation = new MutationObserver((records) => {
      for (const record of records) {
        if (record.target !== node) continue;
        for (const added of Array.from(record.addedNodes)) {
          if (added instanceof Element) resize?.observe(added);
        }
      }
      onContentChange();
    });
    mutation.observe(node, { childList: true, subtree: true, characterData: true });
    resize?.observe(node);
    for (const child of Array.from(node.children)) resize?.observe(child);

    return () => {
      regionImpl.current = NO_REGION;
      state.alive = false;
      node.removeEventListener("scroll", onScroll);
      for (const type of ["wheel", "touchstart", "pointerdown", "keydown"]) {
        node.removeEventListener(type, interrupt);
      }
      stopGlide();
      mutation.disconnect();
      resize?.disconnect();
    };
  }, [ref, anchor, horizontal, keepPosition, hasStart, hasEnd, regionImpl, notifyRegion]);

  return { busy, keepPosition, region: region as ScrollRegion };
}
