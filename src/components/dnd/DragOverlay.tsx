import * as React from "react";
import { createPortal } from "react-dom";

import { prefersReducedMotion } from "@/hooks/usePresence";
import { cx } from "@/internal/cx";
import enterMotion from "@/internal/enterMotion.module.css";
import { motionDurationMs, motionTiming } from "@/internal/motionTiming";
import tooltipSurface from "@/internal/overlay/tooltipSurface.module.css";
import { carryRolling } from "@/internal/RollingNumber";
import { layoutRect } from "@/internal/useFlipList";

import styles from "./Dnd.module.css";
import type { DragController, DragItem, DragPreview } from "./dragSession";
import type { Point, Rect } from "./geometry";

function translate(point: Point, grab: Point): string {
  return `translate3d(${Math.round(point.x - grab.x)}px, ${Math.round(point.y - grab.y)}px, 0)`;
}

// A clone, not a re-render: the overlay does not know what it carries (a card, a row, a chip), and
// asking every caller to describe its item twice is how the two drift apart.
function isTransparent(color: string): boolean {
  return color === "" || color === "transparent" || /rgba?\([^)]*,\s*0\s*\)$/.test(color);
}

/**
 * The copy flies in empty copies (`display: contents`) of the elements its original stands in, up
 * to the nearest surface (`data-depth`) and its theme (`data-theme`): what a host gives its items — tier variables (a List row's
 * padding, radius, gap), context selectors, the surface fill — reaches the copy as it reaches the
 * original. Without them the copy flies bare and snaps into its look when the real item appears.
 */
function inHostCopy(parent: HTMLElement | null, inner: HTMLElement): HTMLElement {
  let outer = inner;
  const wrap = (node: HTMLElement) => {
    const shell = node.cloneNode(false) as HTMLElement;
    shell.style.display = "contents";
    shell.append(outer);
    outer = shell;
  };
  let node = parent;
  while (node && node !== document.body) {
    wrap(node);
    if (node.hasAttribute("data-depth")) {
      // A theme scoped above the surface (a dark panel on a light page) colours the copy too.
      const theme = node.parentElement?.closest<HTMLElement>("[data-theme]");
      if (theme && theme !== document.documentElement && theme !== document.body) wrap(theme);
      break;
    }
    node = node.parentElement;
  }
  return outer;
}

/**
 * A table row cannot fly on its own: outside its table its cells shrink to their content and lose
 * every style their table gives them. It flies in a one-row copy of its table with each column
 * fixed at the width it has now. Returns the table, which carries the lift.
 */
function inTableCopy(row: HTMLTableRowElement, copy: HTMLElement, origin: Rect): HTMLElement {
  const table = row.closest("table");
  const sheet = (table?.cloneNode(false) ?? document.createElement("table")) as HTMLElement;
  sheet.style.tableLayout = "fixed";
  sheet.style.width = `${origin.width}px`;
  sheet.style.minWidth = "0";
  sheet.style.maxWidth = "none";
  sheet.style.margin = "0";
  const columns = document.createElement("colgroup");
  for (const cell of Array.from(row.cells)) {
    const width = cell.getBoundingClientRect().width / cell.colSpan;
    for (let at = 0; at < cell.colSpan; at += 1) {
      const column = document.createElement("col");
      column.style.width = `${width}px`;
      columns.append(column);
    }
  }
  const body = (row.parentElement?.cloneNode(false) ??
    document.createElement("tbody")) as HTMLElement;
  body.append(copy);
  sheet.append(columns, body);
  return sheet;
}

function cloneFor(preview: DragPreview): HTMLElement {
  const clone = preview.element.cloneNode(true) as HTMLElement;
  clone.style.width = `${preview.origin.width}px`;
  clone.style.height = `${preview.origin.height}px`;
  clone.style.margin = "0";
  // An item without a fill of its own (a row of fields on a card) would fly as bare content over
  // the page: the copy takes the fill of the surface it was lifted from.
  const source = getComputedStyle(preview.element);
  if (isTransparent(source.backgroundColor)) {
    const layer = source.getPropertyValue("--prime-color-layer-current").trim();
    if (layer) clone.style.backgroundColor = layer;
  }
  const row = preview.element instanceof HTMLTableRowElement ? preview.element : null;
  const lifted = row ? inTableCopy(row, clone, preview.origin) : clone;
  const outer = inHostCopy(
    row ? (row.closest("table")?.parentElement ?? null) : preview.element.parentElement,
    lifted,
  );
  outer.setAttribute("aria-hidden", "true");
  // A copy must not answer to the original's identity: two elements with one id, name or item marker
  // make every lookup (the engine's, a test's, a screen reader's) a coin toss.
  for (const node of [outer, ...outer.querySelectorAll("*")]) {
    node.removeAttribute("id");
    node.removeAttribute("data-testid");
    node.removeAttribute("aria-label");
    node.removeAttribute("aria-labelledby");
    node.removeAttribute("aria-describedby");
    node.removeAttribute("data-dnd-item");
    node.removeAttribute("data-dnd-kind");
    node.removeAttribute("data-dragging");
    node.removeAttribute("data-lifted");
    node.removeAttribute("tabindex");
  }
  clone.setAttribute("data-dnd-copy", "");
  lifted.classList.add(styles.lift);
  return outer;
}

/** The element that lifts and sets down: the copy itself, or the table a copied row flies in. */
function liftedIn(host: HTMLElement): HTMLElement | null {
  return host.querySelector<HTMLElement>(`.${styles.lift}`);
}

/**
 * Grows or shrinks the carried copy to a new size over the base motion (the cell it would land in
 * differs: a cover carried into a row of tiles), calling `step` every frame so the host keeps the
 * held point under the pointer. Content reflows instead of stretching. Returns a stop.
 */
function resizeCopy(
  copy: HTMLElement,
  from: { width: number; height: number },
  to: { width: number; height: number },
  step: (size: { width: number; height: number }) => void,
): () => void {
  const apply = (size: { width: number; height: number }) => {
    copy.style.width = `${size.width}px`;
    copy.style.height = `${size.height}px`;
    step(size);
  };
  const duration = prefersReducedMotion() ? 0 : motionDurationMs("base");
  if (duration === 0 || typeof requestAnimationFrame !== "function") {
    apply(to);
    return () => {};
  }
  const start = performance.now();
  let frame = 0;
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / duration);
    // Ease out: most of the change at once, then it settles.
    const k = 1 - (1 - t) ** 3;
    apply({
      width: from.width + (to.width - from.width) * k,
      height: from.height + (to.height - from.height) * k,
    });
    if (t < 1) frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(frame);
}

/**
 * The carried copy keeps showing what the item shows while it is in the air: every part marked
 * `data-dnd-mirror` follows the hidden original — its rolling digits roll (`carryRolling`), other
 * content is copied.
 */
function mirrorParts(copy: HTMLElement, source: HTMLElement) {
  const own = copy.querySelectorAll<HTMLElement>("[data-dnd-mirror]");
  source.querySelectorAll<HTMLElement>("[data-dnd-mirror]").forEach((part, index) => {
    const target = own[index];
    if (!target || carryRolling(target, part) || target.innerHTML === part.innerHTML) return;
    target.innerHTML = part.innerHTML;
    // The copy shows the new content as it stands: an entrance the original plays (a word fading
    // in) would replay on every change and blink while the item is carried.
    for (const animation of target.getAnimations?.({ subtree: true }) ?? []) animation.finish();
  });
}

/**
 * A mouse drop right over the item's new place: the item is hovered the moment it appears, so it is
 * marked `data-dnd-hover` (its hover look, readable while it is still hidden) until the pointer
 * leaves it or presses anywhere. Hosts style their hover lift on `:is(:hover, [data-dnd-hover])`.
 */
function holdHoverUntilLeave(node: HTMLElement) {
  node.setAttribute("data-dnd-hover", "");
  const release = () => {
    node.removeAttribute("data-dnd-hover");
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerdown", release, true);
  };
  const onMove = (event: PointerEvent) => {
    const r = node.getBoundingClientRect();
    const inside =
      event.clientX >= r.left &&
      event.clientX <= r.right &&
      event.clientY >= r.top &&
      event.clientY <= r.bottom;
    if (!inside) release();
  };
  window.addEventListener("pointermove", onMove);
  window.addEventListener("pointerdown", release, true);
}

/** The piece that follows the pointer: a clone of the lifted element above every layer. Mounted once by `Dnd.Root`. */
export function DragOverlay({ controller }: { controller: DragController }) {
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const grabRef = React.useRef<Point>({ x: 0, y: 0 });
  const pointRef = React.useRef<Point>({ x: 0, y: 0 });
  const frameRef = React.useRef<number | null>(null);
  const pointerKindRef = React.useRef<DragPreview["pointerKind"]>("mouse");
  const [mounted, setMounted] = React.useState(false);

  /** Stops whatever the previous drop left running: the clone's flight and the hidden destination. */
  const stopLandingRef = React.useRef<(() => void) | null>(null);
  /** The copy's size and where the pointer holds it (a share of the size), for a resize in flight. */
  const sizeRef = React.useRef({ width: 0, height: 0 });
  const holdRef = React.useRef<Point>({ x: 0, y: 0 });
  /** Stops a resize in flight. */
  const resizeRef = React.useRef<(() => void) | null>(null);
  /** Stops the copy following its original (`data-dnd-mirror` parts) once the drag ends. */
  const mirrorRef = React.useRef<(() => void) | null>(null);
  const endTokenRef = React.useRef(0);

  React.useEffect(() => setMounted(true), []);

  const settle = React.useCallback((host: HTMLDivElement) => {
    endTokenRef.current += 1;
    stopLandingRef.current?.();
    stopLandingRef.current = null;
    host.replaceChildren();
    host.removeAttribute("data-can-drop");
  }, []);

  // The carried clone glides to where the item now stands and sets down (lift and shadow ease off)
  // while the real element, hidden until then, is swapped in. The destination is read after the
  // owner's state has committed, so it is the item's real new place, not the pointer's.
  const land = React.useCallback(
    (host: HTMLDivElement, lifted: HTMLElement, item: DragItem, fallback: Rect | null) => {
      const token = ++endTokenRef.current;
      const timing: KeyframeAnimationOptions = { ...motionTiming("base"), fill: "forwards" };
      const from = host.style.transform;
      const settleOnFinish = (animation: Animation) =>
        animation.addEventListener(
          "finish",
          () => {
            if (endTokenRef.current === token) settle(host);
          },
          { once: true },
        );
      const dissolve = () => {
        const to = fallback
          ? translate({ x: fallback.left, y: fallback.top }, { x: 0, y: 0 })
          : translate(pointRef.current, grabRef.current);
        const animation = host.animate(
          [
            { transform: from, opacity: 1 },
            { transform: to, opacity: 0 },
          ],
          timing,
        );
        stopLandingRef.current = () => animation.cancel();
        settleOnFinish(animation);
      };
      const destinationFor = (): HTMLElement | null => {
        // The same id may stand in another list of another kind (two boards with one data set).
        for (const node of document.querySelectorAll<HTMLElement>("[data-dnd-item]")) {
          if (node.dataset.dndItem !== item.id || node.dataset.dndKind !== item.kind) continue;
          if (host.contains(node)) continue;
          if (node.hasAttribute("data-lifted")) continue;
          const rect = layoutRect(node);
          if (rect.width > 0 && rect.height > 0) return node;
        }
        return null;
      };
      const attempt = (retry: boolean) => {
        if (endTokenRef.current !== token) return;
        // `animate` is missing in jsdom, where consumers test screens built with the kit.
        if (typeof host.animate !== "function") {
          settle(host);
          return;
        }
        const destination = destinationFor();
        if (!destination) {
          // The owner may not have committed yet; after that the item is simply somewhere else.
          if (retry) requestAnimationFrame(() => attempt(false));
          else dissolve();
          return;
        }
        const rect = layoutRect(destination);
        const to = translate({ x: rect.left, y: rect.top }, { x: 0, y: 0 });
        carryRolling(lifted, destination);
        destination.setAttribute("data-dnd-landing", "");
        // Where the pointer let go decides the look the item lands in: hovered under a mouse,
        // resting under a finger. Read with transitions off, so it is the end value, not the start.
        const box = destination.getBoundingClientRect();
        const point = pointRef.current;
        const pointerOver =
          pointerKindRef.current === "mouse" &&
          point.x >= box.left &&
          point.x <= box.right &&
          point.y >= box.top &&
          point.y <= box.bottom;
        const transition = destination.style.transition;
        destination.style.transition = "none";
        if (pointerOver) holdHoverUntilLeave(destination);
        const landed = getComputedStyle(destination).boxShadow;
        destination.style.transition = transition;
        const flight = host.animate([{ transform: from }, { transform: to }], timing);
        // From the clone's drawn (lifted) state to the item's own: no second copy of the numbers,
        // and no dip to flat before the hover lift comes back.
        const drawn = getComputedStyle(lifted);
        // A cell of another size (a grid cover and a tile): the clone takes the new size in flight.
        const resized =
          Math.abs(rect.width - lifted.offsetWidth) > 1 ||
          Math.abs(rect.height - lifted.offsetHeight) > 1;
        const fromSize = resized
          ? { width: `${lifted.offsetWidth}px`, height: `${lifted.offsetHeight}px` }
          : {};
        const toSize = resized ? { width: `${rect.width}px`, height: `${rect.height}px` } : {};
        const setDown = lifted.animate(
          [
            { transform: drawn.transform, boxShadow: drawn.boxShadow, ...fromSize },
            { transform: "none", boxShadow: landed, ...toSize },
          ],
          timing,
        );
        stopLandingRef.current = () => {
          destination.removeAttribute("data-dnd-landing");
          flight.cancel();
          setDown.cancel();
        };
        settleOnFinish(flight);
      };
      // After the commit the owner's drop handler caused, before the next paint.
      queueMicrotask(() => attempt(true));
    },
    [settle],
  );

  React.useEffect(() => {
    if (!mounted) return;
    const paint = () => {
      frameRef.current = null;
      const host = hostRef.current;
      if (host) host.style.transform = translate(pointRef.current, grabRef.current);
    };
    return controller.subscribeOverlay((event) => {
      const host = hostRef.current;
      if (!host) return;
      if (event.type === "start") {
        resizeRef.current?.();
        resizeRef.current = null;
        grabRef.current = event.preview.grab;
        // Where the finger holds the copy, as a share of its size: kept when the copy resizes.
        holdRef.current = {
          x: event.preview.grab.x / Math.max(1, event.preview.origin.width),
          y: event.preview.grab.y / Math.max(1, event.preview.origin.height),
        };
        sizeRef.current = {
          width: event.preview.origin.width,
          height: event.preview.origin.height,
        };
        pointRef.current = event.preview.point;
        pointerKindRef.current = event.preview.pointerKind;
        // The previous landing holds its final transform (fill: forwards) until stopped.
        settle(host);
        mirrorRef.current?.();
        mirrorRef.current = null;
        const copy = cloneFor(event.preview);
        host.replaceChildren(copy);
        host.style.transform = translate(event.preview.point, event.preview.grab);
        // The original is hidden but keeps rendering (its place number follows the gap).
        const source = event.preview.element;
        if (typeof MutationObserver === "function" && source.querySelector("[data-dnd-mirror]")) {
          const observer = new MutationObserver(() => mirrorParts(copy, source));
          observer.observe(source, {
            subtree: true,
            childList: true,
            characterData: true,
            attributes: true,
            attributeFilter: ["style"],
          });
          mirrorRef.current = () => observer.disconnect();
        }
        return;
      }
      if (event.type === "move") {
        pointRef.current = event.point;
        // One paint per frame at most: a pointer fires far more often than a display refreshes.
        frameRef.current ??= requestAnimationFrame(paint);
        return;
      }
      if (event.type === "resize") {
        const copy = liftedIn(host);
        if (copy) {
          resizeRef.current?.();
          resizeRef.current = resizeCopy(
            copy,
            sizeRef.current,
            { width: event.width, height: event.height },
            (size) => {
              sizeRef.current = size;
              grabRef.current = {
                x: holdRef.current.x * size.width,
                y: holdRef.current.y * size.height,
              };
              host.style.transform = translate(pointRef.current, grabRef.current);
            },
          );
        }
        return;
      }
      resizeRef.current?.();
      resizeRef.current = null;
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      mirrorRef.current?.();
      mirrorRef.current = null;
      const lifted = liftedIn(host);
      if (!(lifted instanceof HTMLElement) || prefersReducedMotion()) {
        settle(host);
        return;
      }
      land(host, lifted, event.item, event.outcome === "cancel" ? event.origin : null);
    });
  }, [controller, mounted, land, settle]);

  React.useEffect(() => {
    if (!mounted) return;
    return controller.store.subscribe(() => {
      const host = hostRef.current;
      const state = controller.store.getSnapshot();
      if (!host) return;
      const shown = host.querySelector<HTMLElement>(`:scope > .${styles.reason}`);
      if (!state.item) {
        shown?.remove();
        return;
      }
      host.dataset.canDrop = state.overId !== null && !state.canDrop ? "false" : "true";
      // Why the spot under the pointer refuses the item, under the carried copy.
      if (state.reason === null) {
        shown?.remove();
      } else if (shown) {
        shown.textContent = state.reason;
      } else {
        const reason = document.createElement("div");
        // The tooltip's chip, entering like a hint drops in under its anchor.
        reason.className = cx(tooltipSurface.chip, enterMotion.enter, styles.reason);
        reason.textContent = state.reason;
        host.append(reason);
      }
    });
  }, [controller, mounted]);

  React.useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      mirrorRef.current?.();
    },
    [],
  );

  if (!mounted) return null;
  return createPortal(
    <div ref={hostRef} className={styles.overlay} data-dnd-overlay="" aria-hidden="true" />,
    document.body,
  );
}
