import { shiftPx, type TimeScene } from "./timeCore";

/**
 * The slide of one chart's time layers (`timeCore`): the head labels, the backdrop and every row's
 * track register here as they mount, and a move along time writes the one transform onto each of
 * them in the same call — the browser composites them in the same frame, so the dates, the lines
 * and the bars never part.
 *
 * Per layer, never one inherited custom property on the chart: a custom property tells the engine
 * that every node under it may have changed (Lumen measured 92 ms of style a frame against 1.4 ms
 * for the same movement written onto the layers), and `transform` dirties only the layer it is on.
 * An unchanged value is not written at all.
 */
export type TimeSlide = {
  /** The ref callback of a layer laid out from the scene's origin. */
  layer: (node: HTMLElement | null) => (() => void) | undefined;
  /**
   * The scene React has just laid out, and where the view stands: from a layout effect, so the new
   * layout and its slide reach the screen in the same frame.
   */
  reframe: (scene: TimeScene, start: number, dir: 1 | -1) => void;
  /** The view moved along time: one transform per layer, no render. */
  move: (start: number) => void;
  /** The slide written now, px along time (negative once the view moved later). */
  shift: () => number;
};

/**
 * A slide for one chart; `onWrite` hears every write (the view's start and the scene it is in),
 * after the layers: what follows the view without a render (the today button, the edge cues, the
 * label of a bar cut by the start edge).
 */
export function createTimeSlide(onWrite: (start: number, scene: TimeScene) => void): TimeSlide {
  const layers = new Map<HTMLElement, string>();
  let scene: TimeScene | null = null;
  let start = 0;
  let dir: 1 | -1 = 1;

  const transform = () => {
    const px = scene ? shiftPx(start, scene) * dir : 0;
    return `translate3d(${px}px, 0, 0)`;
  };
  const paint = (node: HTMLElement, value: string) => {
    if (layers.get(node) === value) return;
    layers.set(node, value);
    node.style.transform = value;
  };
  const write = () => {
    const value = transform();
    for (const node of layers.keys()) paint(node, value);
    if (scene) onWrite(start, scene);
  };

  return {
    layer(node) {
      if (!node) return undefined;
      layers.set(node, "");
      paint(node, transform());
      return () => {
        layers.delete(node);
      };
    },
    reframe(next, at, direction) {
      scene = next;
      start = at;
      dir = direction;
      write();
    },
    move(at) {
      if (at === start) return;
      start = at;
      write();
    },
    shift: () => (scene ? shiftPx(start, scene) : 0),
  };
}
