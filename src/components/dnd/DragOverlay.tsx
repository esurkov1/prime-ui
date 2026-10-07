import * as React from "react";
import { createPortal } from "react-dom";
import styles from "./Dnd.module.css";
import type { DragController, DragPreview } from "./dragSession";
import type { Point, Rect } from "./geometry";
import { layoutRect } from "./geometry";
import { motionAllowed, readDragMotion } from "./motion";

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
  return clone;
}

/** The piece that follows the pointer: a clone of the lifted element above every layer. Mounted once by `Dnd.Root`. */
export function DragOverlay({ controller }: { controller: DragController }) {
  const hostRef = React.useRef<HTMLDivElement | null>(null);
  const grabRef = React.useRef<Point>({ x: 0, y: 0 });
  const pointRef = React.useRef<Point>({ x: 0, y: 0 });
  const frameRef = React.useRef<number | null>(null);
  const [mounted, setMounted] = React.useState(false);

  const landingRef = React.useRef<{ element: Element; stop: () => void } | null>(null);
  const endTokenRef = React.useRef(0);

  React.useEffect(() => setMounted(true), []);

  // Ends whatever the previous drop left running: the clone's flight and the hidden destination.
  const settle = React.useCallback((host: HTMLDivElement) => {
    endTokenRef.current += 1;
    landingRef.current?.stop();
    landingRef.current = null;
    host.replaceChildren();
    host.removeAttribute("data-can-drop");
  }, []);

  // The carried clone glides to where the item now stands and sets down (lift and shadow ease off)
  // while the real element, hidden until then, is swapped in. The destination is read after the
  // owner's state has committed, so it is the item's real new place, not the pointer's.
  const land = React.useCallback(
    (host: HTMLDivElement, lifted: HTMLElement, id: string, fallback: Rect | null) => {
      const token = ++endTokenRef.current;
      const motion = readDragMotion();
      const from = host.style.transform;
      const dissolve = () => {
        const to = fallback
          ? translate({ x: fallback.left, y: fallback.top }, { x: 0, y: 0 })
          : translate(pointRef.current, grabRef.current);
        const animation = host.animate(
          [
            { transform: from, opacity: 1 },
            { transform: to, opacity: 0 },
          ],
          { duration: motion.settle, easing: motion.easing, fill: "forwards" },
        );
        landingRef.current = { element: host, stop: () => animation.cancel() };
        animation.addEventListener(
          "finish",
          () => {
            if (endTokenRef.current === token) settle(host);
          },
          { once: true },
        );
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
        if (typeof host.animate !== "function" || typeof lifted.animate !== "function") {
          settle(host);
          return;
        }
        const destination = destinationFor();
        if (!destination) {
          // The owner may not have committed yet; after that the item is simply somewhere else.
          if (retry && typeof requestAnimationFrame === "function") {
            requestAnimationFrame(() => attempt(false));
          } else {
            dissolve();
          }
          return;
        }
        const rect = layoutRect(destination);
        const to = translate({ x: rect.left, y: rect.top }, { x: 0, y: 0 });
        destination.setAttribute("data-dnd-landing", "");
        const options = {
          duration: motion.settle,
          easing: motion.easing,
          fill: "forwards",
        } as const;
        const flight = host.animate([{ transform: from }, { transform: to }], options);
        // From the clone's drawn (lifted) state to flat: no second copy of the lift numbers.
        const drawn = getComputedStyle(lifted);
        const setDown = lifted.animate(
          [
            { transform: drawn.transform, boxShadow: drawn.boxShadow },
            { transform: "none", boxShadow: "none" },
          ],
          options,
        );
        const stop = () => {
          destination.removeAttribute("data-dnd-landing");
          flight.cancel();
          setDown.cancel();
        };
        landingRef.current = { element: destination, stop };
        flight.addEventListener(
          "finish",
          () => {
            if (endTokenRef.current === token) settle(host);
          },
          { once: true },
        );
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
    // One paint per frame at most: a pointer fires far more often than a display refreshes.
    const schedule = () => {
      if (frameRef.current !== null) return;
      if (typeof requestAnimationFrame !== "function") {
        paint();
        return;
      }
      frameRef.current = requestAnimationFrame(paint);
    };
    return controller.subscribeOverlay((event) => {
      const host = hostRef.current;
      if (!host) return;
      if (event.type === "start") {
        grabRef.current = event.preview.grab;
        pointRef.current = event.preview.point;
        // The previous landing holds its final transform (fill: forwards) until cancelled.
        landingRef.current?.stop();
        landingRef.current = null;
        endTokenRef.current += 1;
        if (typeof host.getAnimations === "function") {
          for (const animation of host.getAnimations()) animation.cancel();
        }
        const motion = readDragMotion();
        host.style.setProperty("--dnd-lift-duration", `${motion.lift}ms`);
        host.style.setProperty("--dnd-easing", motion.easing);
        host.replaceChildren(cloneFor(event.preview));
        const lifted = host.firstElementChild;
        if (lifted instanceof HTMLElement && styles.lift) lifted.classList.add(styles.lift);
        host.style.transform = translate(event.preview.point, event.preview.grab);
        return;
      }
      if (event.type === "move") {
        pointRef.current = event.point;
        schedule();
        return;
      }
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      const lifted = host.firstElementChild;
      if (
        !(lifted instanceof HTMLElement) ||
        !motionAllowed() ||
        typeof host.animate !== "function"
      ) {
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
      if (frameRef.current !== null && typeof cancelAnimationFrame === "function") {
        cancelAnimationFrame(frameRef.current);
      }
    },
    [],
  );

  if (!mounted) return null;
  return createPortal(
    <div ref={hostRef} className={styles.overlay} data-dnd-overlay="" aria-hidden="true" />,
    document.body,
  );
}
