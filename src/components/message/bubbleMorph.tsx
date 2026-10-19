import * as React from "react";

import { prefersReducedMotion } from "@/hooks/usePresence";
import { GIVE_WAY_ANIMATION } from "@/internal/messageList";
import { motionToken, readElementDurationMs } from "@/internal/motionTiming";
import { stillCopy } from "@/internal/stillCopy";

/**
 * The bubble morph: every size change of an existing message (a reaction row that opens or closes,
 * a chip that comes or goes, a transcript, an edit, an upload state, the meta moving) is one
 * stroke on one clock.
 *
 * The new layout is committed at once, in the same frame. Right before the commit the morph reads
 * the message as it looks (`capture`); right after it (`play`) it reads the new layout and plays,
 * on the compositor and on one clock (`--prime-message-morph-duration`, `--message-morph-ease`):
 * - the bubble's visible box from the old rectangle to the new one, width and height together, as
 *   one `clip-path: inset(… round …)` animation (the fill is a layer under the content that reaches
 *   over the union of both boxes, so a shrinking bubble paints its old size);
 * - every part that moved (`:scope > *` of the bubble, the tail, `[data-morph-item]` anywhere in
 *   the message) by a `transform` from where it was to where it is;
 * - a chip that came fades and scales in from 0.9 where it stands, once the box has room for it;
 *   a chip that went fades out where it was (its node, out of flow); a disclosed block (a
 *   transcript) fades in or out over the whole stroke while the box opens or closes over it;
 * - nothing travels across text: a meta that stays while text passes through its place dips (out
 *   before the text reaches it, back once it has left, at the same spot), and a meta that changes
 *   line cross-fades instead of gliding; the text itself glides straight, keeping its padding;
 * - when the row changed its height, the conversation gives way (`giveWay`): a message keeps its
 *   bottom (reactions, edits: the meta and the tail stay) or its top (a transcript: the player
 *   stays) on screen — the scroller scrolls by what the commit moved that edge, as far as it can —
 *   and the rows that moved glide once from where they were, whether the list grew downward (it
 *   scrolls) or upward (a short conversation pushed to the end of its pane).
 *
 * Every delta is a difference of one element's box across one commit, on screen. Nothing renders
 * per frame. A commit that changes no box touches nothing; one that lands mid-flight retargets
 * from the current visual state, and leaves alone the parts whose place it did not change. Reduced
 * motion (a zero duration) makes it instant; the view is still given way.
 */

type Box = { left: number; top: number; width: number; height: number };

type Snapshot = {
  /** The bubble's visible box (its layout box narrowed by a clip in flight). */
  bubble: Box;
  /** The bubble's layout box. */
  bubbleLayout: Box;
  column: Box;
  row: Box | null;
  /** Every tracked element at its visible place, with the element it stood in. */
  items: Map<HTMLElement, { box: Box; host: HTMLElement }>;
  /** The edge the message grows from: its bottom (reactions, edits) or its top (a transcript). */
  anchor: MorphAnchor;
  /** Where the scroller the row stands in was (a commit that shrinks the end clamps it). */
  scrollTop: number | null;
  /**
   * Everything around the message in its scroller (the rows before and after it, a sticky date),
   * each where it was seen: what gives way glides from here, and what did not move stays still.
   */
  around: { element: HTMLElement; top: number }[];
};

/** Everything before and after `origin` in `host`, walking up from it (rows of rows included). */
function aroundOf(origin: HTMLElement, host: HTMLElement): HTMLElement[] {
  const out: HTMLElement[] = [];
  for (let node: HTMLElement | null = origin; node && node !== host; node = node.parentElement) {
    for (const sibling of node.parentElement?.children ?? []) {
      if (sibling !== node && sibling instanceof HTMLElement) out.push(sibling);
    }
  }
  return out;
}

/** `end` — the bottom corner, the meta and the tail stay; `start` — the top stays. */
export type MorphAnchor = "start" | "end";

/**
 * A part's own glide: its animations (one, or one per axis when the axes are staggered) and where
 * it is drawn, from its new place, at an eased progress `p` of the stroke.
 */
type Flight = { animations: Animation[]; at: (p: number) => { x: number; y: number }; target: Box };

const SAME_PX = 0.5;

const boxOf = (element: Element): Box => {
  const rect = element.getBoundingClientRect();
  return { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
};

const sameBox = (a: Box, b: Box) =>
  Math.abs(a.left - b.left) < SAME_PX &&
  Math.abs(a.top - b.top) < SAME_PX &&
  Math.abs(a.width - b.width) < SAME_PX &&
  Math.abs(a.height - b.height) < SAME_PX;

/** The eased progress of an animation (its timing carries the easing), `1` once it ended. */
const progressOf = (animation: Animation) => {
  const progress = animation.effect?.getComputedTiming().progress;
  return animation.playState === "finished" || progress == null ? 1 : progress;
};

export type BubbleMorphElements = {
  /** The message: the bubble, the tail and the reactions under a picture or a circle. */
  column: HTMLElement | null;
  bubble: HTMLElement | null;
  /** The fill layer of a bubble shell (`null` under a picture or a circle). */
  fill: HTMLElement | null;
  /** The row of the list the message stands in (its windowed box, or the message itself). */
  row: HTMLElement | null;
  /** The scroller of the conversation (`ScrollRegion.element()`); `null` outside one. */
  scroller: HTMLElement | null;
  /** Holds the conversation's own anchoring while the message gives way itself (`Chat.Messages`). */
  hold?: (() => void) | undefined;
};

export type BubbleMorph = {
  /** Read the message as it looks now, before a change is committed. */
  capture: (options?: { anchor?: MorphAnchor }) => void;
  /** Read the committed layout and play from the captured look to it. */
  play: () => void;
  /**
   * A part is about to change the message from inside (a transcript): capture now and play as
   * soon as the change is laid out — the frame it lands in.
   */
  expect: () => void;
  dispose: () => void;
};

type Insets = [number, number, number, number];

/** The clip's insets (top, right, bottom, left) at `p`, from `from` to none. */
const insetsAt = (from: Insets, p: number): Insets =>
  from.map((value) => value * (1 - p)) as Insets;

/** The bubble's visible box at `p`: its layout box narrowed by the clip's insets. */
const boxAt = (layout: Box, from: Insets, p: number): Box => {
  const [top, right, bottom, left] = insetsAt(from, p);
  return {
    left: layout.left + left,
    top: layout.top + top,
    width: layout.width - left - right,
    height: layout.height - top - bottom,
  };
};

/**
 * The boxes of the text lines inside `root` (its ink), each with the element the text is in: the
 * meta (`skip`) and the spacers that hold its room left out.
 */
function inkOf(root: Element, skip: Element | null): { box: Box; node: Element }[] {
  const out: { box: Box; node: Element }[] = [];
  if (typeof document.createRange !== "function") return out;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let text = walker.nextNode(); text; text = walker.nextNode()) {
    const node = text.parentElement;
    if (!node || !text.textContent?.trim() || skip?.contains(node)) continue;
    if (node.closest("[data-message-spacer]")) continue;
    const range = document.createRange();
    range.selectNodeContents(text);
    if (typeof range.getClientRects !== "function") continue;
    for (const rect of range.getClientRects()) {
      if (rect.width > 1 && rect.height > 1) {
        out.push({
          box: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
          node,
        });
      }
    }
  }
  return out;
}

/** The tracked elements of a message, each with the element it stands in. */
function trackedOf(column: HTMLElement, bubble: HTMLElement) {
  const out = new Map<HTMLElement, HTMLElement>();
  const add = (element: Element, host: HTMLElement) => {
    if (!(element instanceof HTMLElement)) return;
    if (element.hasAttribute("data-morph-skip") || element.hasAttribute("data-morph-ghost")) return;
    out.set(element, host);
  };
  for (const child of bubble.children) add(child, bubble);
  for (const child of column.children) if (child !== bubble) add(child, column);
  for (const item of column.querySelectorAll("[data-morph-item]")) {
    add(item, bubble.contains(item) ? bubble : column);
  }
  // Beside the message in its row (the retry of a failed one): it follows the bubble's edge.
  for (const item of column.parentElement?.querySelectorAll(":scope > [data-morph-item]") ?? []) {
    add(item, column);
  }
  return out;
}

export function createBubbleMorph(elements: () => BubbleMorphElements): BubbleMorph {
  let snapshot: Snapshot | null = null;
  const flights = new Map<HTMLElement, Flight>();
  let clip: {
    animation: Animation;
    /** The fill reaching over both boxes for as long as the clip runs. */
    reach: Animation | undefined;
    from: [number, number, number, number];
    layout: Box;
  } | null = null;
  const fades = new Set<Animation>();
  const ghosts = new Set<HTMLElement>();
  let expectFrame = 0;
  let expectTries = 0;
  let watcher: MutationObserver | null = null;

  /** The current offset an element is drawn at by its own flight. */
  const offsetOf = (element: HTMLElement) => {
    const flight = flights.get(element);
    const first = flight?.animations[0];
    return flight && first ? flight.at(progressOf(first)) : { x: 0, y: 0 };
  };

  const bubbleVisible = (layout: Box): Box =>
    clip ? boxAt(layout, clip.from, progressOf(clip.animation)) : layout;

  const capture: BubbleMorph["capture"] = (options) => {
    const { column, bubble, row, scroller } = elements();
    if (!column || !bubble || !column.isConnected) return;
    // A capture that is still waiting for its play keeps the look from before the first change.
    if (snapshot) return;
    const bubbleLayout = boxOf(bubble);
    const items = new Map<HTMLElement, { box: Box; host: HTMLElement }>();
    for (const [element, host] of trackedOf(column, bubble)) {
      items.set(element, { box: boxOf(element), host });
    }
    snapshot = {
      bubble: bubbleVisible(bubbleLayout),
      bubbleLayout,
      column: boxOf(column),
      row: row ? boxOf(row) : null,
      items,
      anchor: options?.anchor ?? "end",
      scrollTop: row ? (scroller?.scrollTop ?? null) : null,
      around:
        row && scroller
          ? aroundOf(column.parentElement ?? row, scroller).map((element) => ({
              element,
              top: element.getBoundingClientRect().top,
            }))
          : [],
    };
  };

  const settle = () => {
    if (clip || flights.size > 0 || ghosts.size > 0) return;
    elements().row?.removeAttribute("data-morphing");
  };

  /**
   * The conversation gives way to a row that changed its height — one owner of the motion, from
   * what the commit actually moved. The row keeps its anchored edge on screen: its bottom (`end`:
   * reactions, edits — the meta and the tail stay) or its top (`start`: a transcript under the
   * player). Where the list stands in its scroller decides how the commit moved things: a list that
   * flows from the top grows downward (the row's top stays), one pushed to the end of a short pane
   * by its auto top margin grows upward (the bottom stays), one with a little slack does a share of
   * each. So nothing is assumed: the row's two edges are measured against where they were, the
   * scroller scrolls by what brings the anchored edge back (as far as it can), and everything around
   * the message — rows, a sticky date — glides from where it was seen before the commit to where it
   * now stands, once, as one block on the stroke's clock, or not at all when it ends where it was (a
   * date stuck at the top). A row out of view keeps the view still and glides nothing.
   */
  const giveWay = (before: Snapshot, row: HTMLElement) => {
    const glides: { element: HTMLElement; dy: number }[] = [];
    const host = elements().scroller;
    if (!host || !before.row) return glides;
    elements().hold?.();
    const view = boxOf(host);
    const was = before.row;
    const now = boxOf(row);
    // How the commit moved the row's edges on screen (a clamp of a shrinking end included).
    const topMoved = now.top - was.top;
    const bottomMoved = now.top + now.height - (was.top + was.height);
    const aboveView = was.top + was.height <= view.top;
    const belowView = was.top >= view.top + view.height;
    // Out of view the view stays still: what is in view moved with the row's bottom (it is below
    // the row) or with its top (above it).
    const keep = aboveView
      ? bottomMoved
      : belowView
        ? topMoved
        : before.anchor === "end"
          ? bottomMoved
          : topMoved;
    if (Math.abs(keep) >= SAME_PX) host.scrollTop += keep;
    if (aboveView || belowView) return glides;
    // Each glides from where it was seen before the commit to where it stands now: a sticky date
    // that stayed at the top, or a row the change did not move, glides nothing. A glide still on
    // its way (another message's) gives way to the new one, from where it is seen now.
    for (const { element, top } of before.around) {
      if (!element.isConnected) continue;
      for (const animation of element.getAnimations?.() ?? []) {
        if (animation.id === GIVE_WAY_ANIMATION) animation.cancel();
      }
      const dy = top - element.getBoundingClientRect().top;
      if (Math.abs(dy) >= SAME_PX) glides.push({ element, dy });
    }
    return glides;
  };

  const play: BubbleMorph["play"] = () => {
    const before = snapshot;
    snapshot = null;
    cancelAnimationFrame(expectFrame);
    expectFrame = 0;
    watcher?.disconnect();
    watcher = null;
    const { column, bubble, fill, row } = elements();
    if (!before || !column || !bubble || !column.isConnected) return;

    // The clock is global (a theme or reduced motion retunes it on the root); the curve is the
    // message's own, the standard one unless a host retunes it.
    const duration = readElementDurationMs(
      document.documentElement,
      "--prime-message-morph-duration",
    );
    const easing =
      getComputedStyle(column).getPropertyValue("--message-morph-ease").trim() ||
      motionToken("--prime-motion-easing-standard");
    const timing: KeyframeAnimationOptions = easing ? { duration, easing } : { duration };

    // ── the row's change of height, given way to before anything is read (reduced motion too) ──
    const rowDelta = row && before.row ? boxOf(row).height - before.row.height : 0;
    const glides = row && Math.abs(rowDelta) >= SAME_PX ? giveWay(before, row) : [];

    // ── the new layout, with every running offset taken out ──
    const bubbleLayout = boxOf(bubble);
    const now = trackedOf(column, bubble);
    const layout = new Map<HTMLElement, Box>();
    for (const element of now.keys()) {
      const box = boxOf(element);
      const offset = offsetOf(element);
      layout.set(element, { ...box, left: box.left - offset.x, top: box.top - offset.y });
    }
    const gone = [...before.items].filter(([element]) => !element.isConnected);
    const came = [...now.keys()].filter((element) => !before.items.has(element));

    // Nothing changed inside the message (a re-render, or the whole message moved with its row):
    // every running stroke goes on untouched.
    const columnBox = boxOf(column);
    const relative = (box: Box, base: Box) => ({
      ...box,
      left: box.left - base.left,
      top: box.top - base.top,
    });
    const moved =
      gone.length > 0 ||
      came.length > 0 ||
      Math.abs(rowDelta) >= SAME_PX ||
      !sameBox(relative(bubbleLayout, columnBox), relative(before.bubbleLayout, before.column)) ||
      [...layout].some(([element, box]) => {
        const old = before.items.get(element);
        if (!old) return false;
        const flight = flights.get(element);
        const was = flight ? flight.target : old.box;
        return !sameBox(relative(box, columnBox), relative(was, before.column));
      });
    if (!moved) return;

    // Reduced motion (or no Web Animations): the new layout simply stands.
    if (duration <= 0 || prefersReducedMotion() || typeof bubble.animate !== "function") {
      for (const [element] of gone) element.remove();
      return;
    }

    row?.setAttribute("data-morphing", "");

    // ── the bubble's visible box: one clip, both axes ──
    const from: [number, number, number, number] = [
      before.bubble.top - bubbleLayout.top,
      bubbleLayout.left + bubbleLayout.width - (before.bubble.left + before.bubble.width),
      bubbleLayout.top + bubbleLayout.height - (before.bubble.top + before.bubble.height),
      before.bubble.left - bubbleLayout.left,
    ];
    // Every animation of the stroke starts at this frame's time: one clock, none left pending a
    // frame behind the others (WebKit starts a new animation a frame late otherwise).
    const startTime = document.timeline?.currentTime ?? null;
    const animate = (
      element: Element,
      keyframes: Keyframe[],
      options: KeyframeAnimationOptions,
    ) => {
      const animation = element.animate(keyframes, options);
      if (startTime !== null) animation.startTime = startTime;
      return animation;
    };
    const clipUnchanged = clip !== null && sameBox(clip.layout, bubbleLayout);
    const newClip = !clipUnchanged && from.some((value) => Math.abs(value) >= SAME_PX);

    // ── where things are at a progress `p` of the stroke (eased, as the keyframes see it) ──
    const visibleAt = (p: number): Box => (newClip ? boxAt(bubbleLayout, from, p) : bubbleLayout);
    /**
     * The bubble's clip: its visible box from the old rectangle to the new one, both axes. It runs
     * on the main thread (no engine composites `clip-path`) while the parts' `transform` glides run
     * on the compositor: on one timeline they agree to the pixel, but WebKit can draw the two a
     * fraction of a frame apart, so a part moving with an edge can come 2–4 px nearer that edge for
     * a frame there (an engine limit; stepped or paused, the positions are exact).
     */
    const startClip = () => {
      if (!newClip) return;
      clip?.animation.cancel();
      clip?.reach?.cancel();
      // `inset()` and its radii are physical: top, right, bottom, left.
      const radius = getComputedStyle(bubble);
      const round = `round ${radius.borderTopLeftRadius} ${radius.borderTopRightRadius} ${radius.borderBottomRightRadius} ${radius.borderBottomLeftRadius}`;
      // For the stroke only (both end with it, in the same frame): the content is clipped by the
      // animated clip instead of the box, and the fill reaches over both boxes.
      const animation = animate(
        bubble,
        [0, 1].map((p) => ({
          offset: p,
          clipPath: `inset(${insetsAt(from, p)
            .map((value) => `${value}px`)
            .join(" ")} ${round})`,
          overflow: "visible",
        })),
        timing,
      );
      const reach = fill
        ? animate(
            fill,
            [0, 1].map(() => ({
              inset: from.map((value) => `${Math.min(0, value)}px`).join(" "),
            })),
            timing,
          )
        : undefined;
      const current = { animation, reach, from, layout: bubbleLayout };
      clip = current;
      animation.onfinish = animation.oncancel = () => {
        if (clip !== current) return;
        clip = null;
        settle();
      };
    };
    const movers = [...layout]
      .filter(([element]) => before.items.has(element))
      .map(([element, box]) => {
        const old = before.items.get(element)?.box ?? box;
        return { element, box, dx: old.left - box.left, dy: old.top - box.top };
      })
      .filter((mover) => !mover.element.hasAttribute("data-morph-item"));
    const at = (box: Box, dx: number, dy: number, p: number): Box => ({
      ...box,
      left: box.left + dx * (1 - p),
      top: box.top + dy * (1 - p),
    });
    const inside = (box: Box, frame: Box) =>
      box.left >= frame.left - 1 &&
      box.top >= frame.top - 1 &&
      box.left + box.width <= frame.left + frame.width + 1 &&
      box.top + box.height <= frame.top + frame.height + 1;
    const overlaps = (a: Box, b: Box) =>
      Math.min(a.left + a.width, b.left + b.width) - Math.max(a.left, b.left) > 1 &&
      Math.min(a.top + a.height, b.top + b.height) - Math.max(a.top, b.top) > 1;
    /**
     * The progresses where `box` (carried by `dx, dy`) is clipped by the bubble's moving edge, and
     * where a moving part passes over it (a part that ends over it belongs there: never counted).
     */
    const conflictsOf = (
      element: HTMLElement | null,
      inBubble: boolean,
      box: Box,
      dx = 0,
      dy = 0,
    ) => {
      const neighbours = movers.filter(
        (mover) =>
          mover.element !== element &&
          !(element && (mover.element.contains(element) || element.contains(mover.element))) &&
          !overlaps(box, mover.box),
      );
      const clipped: number[] = [];
      const crossed: number[] = [];
      for (let step = 0; step <= STEPS; step += 1) {
        const p = step / STEPS;
        const here = at(box, dx, dy, p);
        if (inBubble && !inside(here, visibleAt(p))) clipped.push(p);
        if (neighbours.some((mover) => overlaps(here, at(mover.box, mover.dx, mover.dy, p)))) {
          crossed.push(p);
        }
      }
      return { clipped, crossed };
    };
    const STEPS = 25;
    /** How near text comes to the meta before the meta dips, and the share of a cross-fade. */
    const CLEAR = 2;
    /** A meta that travels this near text on its way passes over it: it cross-fades instead. */
    const PASS_CLEAR = 6;
    const SWAP = 0.4;

    // ── the parts that came. A chip fades (and scales) in where it stands — never while the
    //    bubble's edge still cuts it, and once the parts moving away have left its place. A block
    //    the bubble discloses (a transcript) fades in over the whole stroke while the box opens
    //    over it, like a disclosure ──
    for (const element of came) {
      const box = layout.get(element) as Box;
      const chip = element.querySelector("[data-morph-pop]") !== null;
      let show = 0;
      if (chip) {
        const carrier = movers.find((mover) => mover.element.contains(element));
        const { clipped, crossed } = conflictsOf(
          element,
          bubble.contains(element),
          box,
          carrier?.dx,
          carrier?.dy,
        );
        // One step past the last conflict, and one more for the steps between the samples.
        const after = (list: number[]) => (list.length ? Math.max(...list) + 2 / STEPS : 0);
        show = Math.min(Math.max(after(clipped), after(crossed)), 0.95);
      }
      const fade = animate(
        element,
        [{ opacity: 0 }, { opacity: 0, offset: show }, { opacity: 1 }],
        {
          ...timing,
          composite: "replace",
        },
      );
      fades.add(fade);
      fade.onfinish = fade.oncancel = () => fades.delete(fade);
      const pop = element.querySelector<HTMLElement>("[data-morph-pop]");
      if (pop) {
        const scale = animate(pop, [{ transform: "scale(0.9)" }, { transform: "scale(1)" }], {
          ...timing,
          composite: "add",
        });
        fades.add(scale);
        scale.onfinish = scale.oncancel = () => fades.delete(scale);
      }
    }

    // ── the parts that went: their own node fades out where it was seen, out of flow ──
    for (const [element, { box, host }] of gone) {
      if (!host.isConnected) continue;
      for (const animation of flights.get(element)?.animations ?? []) animation.cancel();
      flights.delete(element);
      const base = host === bubble ? bubbleLayout : columnBox;
      element.setAttribute("data-morph-ghost", "");
      element.setAttribute("aria-hidden", "true");
      element.inert = true;
      Object.assign(element.style, {
        position: "absolute",
        left: `${box.left - base.left}px`,
        top: `${box.top - base.top}px`,
        width: `${box.width}px`,
        height: `${box.height}px`,
        margin: "0",
        boxSizing: "border-box",
        pointerEvents: "none",
      });
      host.appendChild(element);
      ghosts.add(element);
      // A chip is gone before the bubble's edge reaches it, and (mostly) before a moving part
      // passes over it. A disclosed block (a transcript) fades over the whole stroke while the
      // box closes over it, like a disclosure.
      let hide = 1;
      if (element.querySelector("[data-morph-pop]")) {
        const { clipped, crossed } = conflictsOf(null, host === bubble, box);
        const first = (list: number[]) => (list.length ? Math.min(...list) : 1);
        hide = Math.max(Math.min(first(clipped), Math.max(first(crossed), 0.15), 0.6), 1 / STEPS);
      }
      const fade = animate(
        element,
        [{ opacity: 1 }, { opacity: 0, offset: hide }, { opacity: 0 }],
        // Held at nothing until its node goes, whenever the end's event lands.
        { ...timing, fill: "forwards" },
      );
      fade.onfinish = fade.oncancel = () => {
        element.remove();
        ghosts.delete(element);
        settle();
      };
    }

    // ── the parts that stayed: from where they were seen to where they are ──
    const applied = new Map<HTMLElement, { x: number; y: number }>();
    const plans: { element: HTMLElement; box: Box; dx: number; dy: number }[] = [];
    const ordered = [...layout].sort(([a], [b]) => (a.contains(b) ? -1 : b.contains(a) ? 1 : 0));
    for (const [element, box] of ordered) {
      const old = before.items.get(element);
      if (!old) continue;
      const flight = flights.get(element);
      if (flight && sameBox(flight.target, box)) {
        applied.set(element, offsetOf(element));
        continue;
      }
      let dx = old.box.left - box.left;
      let dy = old.box.top - box.top;
      // A tracked ancestor already carries part of the way.
      for (const [ancestor, offset] of applied) {
        if (ancestor !== element && ancestor.contains(element)) {
          dx -= offset.x;
          dy -= offset.y;
        }
      }
      for (const animation of flight?.animations ?? []) animation.cancel();
      flights.delete(element);
      if (Math.abs(dx) < SAME_PX && Math.abs(dy) < SAME_PX) continue;
      applied.set(element, { x: dx, y: dy });
      plans.push({ element, box, dx, dy });
    }

    // ── no part travels across another: the meta and the text keep clear of each other ──
    const meta = bubble.querySelector<HTMLElement>(":scope > [data-message-meta]");
    const metaPlan = plans.find((plan) => plan.element === meta) ?? null;
    const metaFrom = meta ? before.items.get(meta)?.box : undefined;
    const metaTo = meta ? layout.get(meta) : undefined;
    /** Where the text lines of the bubble are drawn at `p` (each carried by its moving parts). */
    const ink = inkOf(bubble, meta).map(({ box, node }) => {
      const owner = plans.find((plan) => plan.element.contains(node));
      return { box, node, owner };
    });
    const near = (a: Box, b: Box, room = CLEAR) =>
      overlaps(
        {
          left: a.left - room,
          top: a.top - room,
          width: a.width + 2 * room,
          height: a.height + 2 * room,
        },
        b,
      );
    // A meta that would pass over text on its way changes place by a cross-fade instead: it fades
    // out where it was in the first part of the stroke and in where it goes in the last part.
    let metaSwap = false;
    if (meta && metaPlan && metaFrom && metaTo) {
      for (let step = 1; step < STEPS && !metaSwap; step += 1) {
        const p = step / STEPS;
        const here = at(metaTo, metaPlan.dx, metaPlan.dy, p);
        metaSwap = ink.some(({ box, owner }) =>
          near(here, owner ? at(box, owner.dx, owner.dy, p) : box, PASS_CLEAR),
        );
      }
    }
    // A meta that stays while text passes through its place dips instead: it fades out before
    // the text reaches it and back in once the text has left — at the same spot, never moving.
    let dip: [number, number] | null = null;
    if (meta && metaTo && !metaPlan) {
      const crossing: number[] = [];
      for (let step = 1; step < STEPS; step += 1) {
        const p = step / STEPS;
        if (ink.some(({ box, owner }) => owner && near(metaTo, at(box, owner.dx, owner.dy, p)))) {
          crossing.push(p);
        }
      }
      if (crossing.length > 0) {
        // Out by the step before the first crossing, in from the step after the last one.
        dip = [
          Math.max(Math.min(...crossing) - 1 / STEPS, 1 / STEPS),
          Math.min(Math.max(...crossing) + 1 / STEPS, 1 - 1 / STEPS),
        ];
      }
    }
    startClip();

    for (const plan of plans) {
      const { element, box, dx, dy } = plan;
      if (element === meta && metaSwap && metaFrom) {
        // The meta stands at its new place and fades in there; its copy fades out at the old one.
        const copy = stillCopy(element, true);
        copy.removeAttribute("data-message-meta");
        copy.setAttribute("data-morph-meta", "");
        copy.setAttribute("data-morph-ghost", "");
        Object.assign(copy.style, {
          position: "absolute",
          inset: "auto",
          left: `${metaFrom.left - bubbleLayout.left}px`,
          top: `${metaFrom.top - bubbleLayout.top}px`,
          margin: "0",
          translate: "none",
          pointerEvents: "none",
        });
        bubble.appendChild(copy);
        ghosts.add(copy);
        const out = animate(copy, [{ opacity: 1 }, { opacity: 0, offset: SWAP }, { opacity: 0 }], {
          ...timing,
          fill: "forwards",
        });
        out.onfinish = out.oncancel = () => {
          copy.remove();
          ghosts.delete(copy);
          settle();
        };
        const into = animate(
          element,
          [{ opacity: 0 }, { opacity: 0, offset: 1 - SWAP }, { opacity: 1 }],
          { ...timing, composite: "replace" },
        );
        fades.add(into);
        into.onfinish = into.oncancel = () => fades.delete(into);
        continue;
      }
      const animations = [
        animate(
          element,
          [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "translate(0px, 0px)" }],
          { ...timing, composite: "add" },
        ),
      ];
      const entry: Flight = {
        animations,
        at: (p) => ({ x: dx * (1 - p), y: dy * (1 - p) }),
        target: box,
      };
      flights.set(element, entry);
      const first = animations[0] as Animation;
      first.onfinish = first.oncancel = () => {
        if (flights.get(element) !== entry) return;
        flights.delete(element);
        settle();
      };
    }

    if (meta && dip) {
      const [gone, back] = dip;
      const fade = animate(
        meta,
        [
          { opacity: 1, offset: 0 },
          { opacity: 0, offset: gone },
          { opacity: 0, offset: back },
          { opacity: 1, offset: 1 },
        ],
        { ...timing, composite: "replace" },
      );
      fades.add(fade);
      fade.onfinish = fade.oncancel = () => fades.delete(fade);
    }

    // ── the rows that gave way glide from where they were, one block on the same clock ──
    for (const { element, dy } of glides) {
      const glide = animate(
        element,
        [{ transform: `translate(0px, ${dy}px)` }, { transform: "translate(0px, 0px)" }],
        { ...timing, composite: "add" },
      );
      glide.id = GIVE_WAY_ANIMATION;
      fades.add(glide);
      glide.onfinish = glide.oncancel = () => fades.delete(glide);
    }

    settle();
  };

  const expect: BubbleMorph["expect"] = () => {
    capture({ anchor: "start" });
    if (!snapshot) return;
    const { column } = elements();
    const changed = () => {
      const { bubble } = elements();
      return snapshot !== null && bubble !== null && !sameBox(boxOf(bubble), snapshot.bubbleLayout);
    };
    // The commit lands in a task or a microtask of its own (a press, a request that resolved): a
    // mutation observer runs right after it, before any frame can paint it. A change that keeps
    // the bubble's size is played by the next frames.
    if (column && typeof MutationObserver !== "undefined") {
      watcher?.disconnect();
      watcher = new MutationObserver(() => {
        if (changed()) play();
      });
      watcher.observe(column, {
        subtree: true,
        childList: true,
        attributes: true,
        characterData: true,
      });
    }
    expectTries = 0;
    cancelAnimationFrame(expectFrame);
    const look = () => {
      if (!snapshot) return;
      expectTries += 1;
      if (changed() || expectTries >= 3) {
        play();
        return;
      }
      expectFrame = requestAnimationFrame(look);
    };
    expectFrame = requestAnimationFrame(look);
  };

  return {
    capture,
    play,
    expect,
    dispose() {
      cancelAnimationFrame(expectFrame);
      watcher?.disconnect();
      watcher = null;
      for (const ghost of ghosts) ghost.remove();
      ghosts.clear();
    },
  };
}

type MorphSnapshotProps = { morph: BubbleMorph };

/**
 * Captures the message right before each commit of `Message.Root` (`getSnapshotBeforeUpdate` runs
 * before any DOM of the commit changes) and plays right after it, before paint.
 */
export class MorphSnapshot extends React.Component<MorphSnapshotProps> {
  getSnapshotBeforeUpdate() {
    this.props.morph.capture({ anchor: "end" });
    return null;
  }

  componentDidUpdate() {
    this.props.morph.play();
  }

  componentWillUnmount() {
    this.props.morph.dispose();
  }

  render() {
    return null;
  }
}
