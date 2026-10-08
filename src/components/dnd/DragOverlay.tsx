import * as React from "react";
import { createPortal } from "react-dom";

import { prefersReducedMotion } from "@/hooks/usePresence";

import styles from "./Dnd.module.css";
import type { DragController, DragPreview } from "./dragSession";
import type { Point, Rect } from "./geometry";
import { layoutRect } from "./geometry";
import { motionTiming } from "./useFlipList";

function translate(point: Point, grab: Point): string {
  return `translate3d(${Math.round(point.x - grab.x)}px, ${Math.round(point.y - grab.y)}px, 0)`;
}

// A clone, not a re-render: the overlay does not know what it carries (a card, a row, a chip), and
// asking every caller to describe its item twice is how the two drift apart.
function cloneFor(preview: DragPreview): HTMLElement {
  const clone = preview.element.cloneNode(true) as HTMLElement;
  clone.style.width = `${preview.origin.width}px`;
  clone.style.height = `${preview.origin.height}px`;
  clone.style.margin = "0";
  clone.setAttribute("aria-hidden", "true");
  // A copy must not answer to the original's identity: two elements with one id or item marker make
  // every lookup (the engine's, a test's, a screen reader's) a coin toss.
  for (const node of [clone, ...clone.querySelectorAll("*")]) {
    node.removeAttribute("id");
    node.removeAttribute("data-testid");
    node.removeAttribute("data-dnd-item");
    node.removeAttribute("data-dragging");
    node.removeAttribute("data-lifted");
    node.removeAttribute("tabindex");
  }
  clone.classList.add(styles.lift);
  return clone;
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
    (host: HTMLDivElement, lifted: HTMLElement, id: string, fallback: Rect | null) => {
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
        for (const node of document.querySelectorAll<HTMLElement>("[data-dnd-item]")) {
          if (node.dataset.dndItem !== id || host.contains(node)) continue;
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
        const setDown = lifted.animate(
          [
            { transform: drawn.transform, boxShadow: drawn.boxShadow },
            { transform: "none", boxShadow: landed },
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
        grabRef.current = event.preview.grab;
        pointRef.current = event.preview.point;
        pointerKindRef.current = event.preview.pointerKind;
        // The previous landing holds its final transform (fill: forwards) until stopped.
        settle(host);
        host.replaceChildren(cloneFor(event.preview));
        host.style.transform = translate(event.preview.point, event.preview.grab);
        return;
      }
      if (event.type === "move") {
        pointRef.current = event.point;
        // One paint per frame at most: a pointer fires far more often than a display refreshes.
        frameRef.current ??= requestAnimationFrame(paint);
        return;
      }
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      const lifted = host.firstElementChild;
      if (!(lifted instanceof HTMLElement) || prefersReducedMotion()) {
        settle(host);
        return;
      }
      land(host, lifted, event.item.id, event.outcome === "cancel" ? event.origin : null);
    });
  }, [controller, mounted, land, settle]);

  React.useEffect(() => {
    if (!mounted) return;
    return controller.store.subscribe(() => {
      const host = hostRef.current;
      const state = controller.store.getSnapshot();
      if (!host || !state.item) return;
      host.dataset.canDrop = state.overId !== null && !state.canDrop ? "false" : "true";
    });
  }, [controller, mounted]);

  React.useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    },
    [],
  );

  if (!mounted) return null;
  return createPortal(
    <div ref={hostRef} className={styles.overlay} data-dnd-overlay="" aria-hidden="true" />,
    document.body,
  );
}
