import { act } from "@testing-library/react";

type Point = { x: number; y: number };

/** jsdom has no PointerEvent: a MouseEvent carrying the pointer fields React reads. */
function pointer(type: string, target: EventTarget, point: Point, pointerType: string) {
  const event = new MouseEvent(type, {
    bubbles: true,
    cancelable: true,
    clientX: point.x,
    clientY: point.y,
    button: 0,
  });
  Object.defineProperties(event, {
    pointerId: { value: 1 },
    isPrimary: { value: true },
    pointerType: { value: pointerType },
  });
  act(() => {
    target.dispatchEvent(event);
  });
}

/**
 * A drag from `from` to `to` in `steps` moves, starting on `target` (the moves and the release go
 * to `window`, as with a captured pointer). `timeStep` ms between moves sets the release velocity.
 */
export function swipe(
  target: Element,
  from: Point,
  to: Point,
  { steps = 5, pointerType = "touch", timeStep = 50 } = {},
) {
  const start = performance.now();
  pointer("pointerdown", target, from, pointerType);
  for (let i = 1; i <= steps; i++) {
    const point = {
      x: from.x + ((to.x - from.x) * i) / steps,
      y: from.y + ((to.y - from.y) * i) / steps,
    };
    const event = new MouseEvent("pointermove", {
      bubbles: true,
      cancelable: true,
      clientX: point.x,
      clientY: point.y,
    });
    Object.defineProperties(event, {
      pointerId: { value: 1 },
      timeStamp: { value: start + i * timeStep },
    });
    act(() => {
      window.dispatchEvent(event);
    });
  }
  pointer("pointerup", window, to, pointerType);
}

/**
 * Makes `matchMedia` report a narrow viewport (below 640px) on top of the reduced motion the test
 * setup reports. Returns the restore function.
 */
export function mockCompactViewport(): () => void {
  const original = window.matchMedia;
  window.matchMedia = (query: string) => {
    const list = original(query);
    return {
      ...list,
      media: query,
      matches: list.matches || query.includes("max-width: 639px"),
      addEventListener: () => {},
      removeEventListener: () => {},
    } as MediaQueryList;
  };
  return () => {
    window.matchMedia = original;
  };
}
