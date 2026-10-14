/**
 * The shared motion harness of component tests. Tests run with `prefers-reduced-motion: reduce`
 * (`setup.ts`), so presence and swaps settle at once; a test that covers motion calls
 * `withMotion()` in its body or a `beforeEach` instead of stubbing `matchMedia` and
 * `Element.animate` by hand. Everything it installs is undone after the test (`restoreMocks` /
 * `unstubGlobals` in `vitest.config.ts`, and its own `afterEach`).
 */
import { afterEach, vi } from "vitest";

export type RecordedAnimation = {
  element: Element;
  keyframes: Keyframe[] | PropertyIndexedKeyframes | null;
  options: number | KeyframeAnimationOptions | undefined;
  /** Settles the animation: fires `finish` listeners and `onfinish`, resolves `finished`. */
  finish: () => void;
  cancelled: boolean;
  /** The animation `Element.animate` returned (`pause()` / `play()` move its `playState`). */
  animation: Animation;
};

export type MotionHarness = {
  /** Every `Element.animate` call since `withMotion()`, in order. */
  animations: RecordedAnimation[];
  /** The animations started on `element`. */
  on: (element: Element) => RecordedAnimation[];
  /** Finishes every animation still running. */
  finishAll: () => void;
};

let installed: (() => void) | null = null;

afterEach(() => {
  installed?.();
  installed = null;
});

/**
 * Motion on: `matchMedia` answers `false` to every query (no reduced motion, no coarse pointer)
 * and `Element.animate` records each call and returns a controllable animation.
 */
export function withMotion(): MotionHarness {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }));
  const animations: RecordedAnimation[] = [];
  const previous = Object.getOwnPropertyDescriptor(Element.prototype, "animate");
  function animate(
    this: Element,
    keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
    options?: number | KeyframeAnimationOptions,
  ): Animation {
    const listeners = new Set<() => void>();
    let resolve: (value: Animation) => void = () => {};
    const finished = new Promise<Animation>((done) => {
      resolve = done;
    });
    const animation = {
      onfinish: null as null | (() => void),
      oncancel: null as null | (() => void),
      playState: "running",
      currentTime: 0,
      effect: null,
      finished,
      addEventListener: (type: string, listener: () => void) => {
        if (type === "finish") listeners.add(listener);
      },
      removeEventListener: (type: string, listener: () => void) => {
        if (type === "finish") listeners.delete(listener);
      },
      cancel: () => {
        record.cancelled = true;
        animation.playState = "idle";
        animation.oncancel?.();
      },
      finish: () => record.finish(),
      play: () => {
        if (animation.playState === "paused") animation.playState = "running";
      },
      pause: () => {
        if (animation.playState === "running") animation.playState = "paused";
      },
      reverse: () => {},
      commitStyles: () => {},
      persist: () => {},
    };
    const record: RecordedAnimation = {
      element: this,
      keyframes,
      options,
      cancelled: false,
      animation: animation as unknown as Animation,
      finish: () => {
        if (animation.playState === "finished") return;
        animation.playState = "finished";
        for (const listener of listeners) listener();
        animation.onfinish?.();
        resolve(animation as unknown as Animation);
      },
    };
    animations.push(record);
    return animation as unknown as Animation;
  }
  Object.defineProperty(Element.prototype, "animate", { configurable: true, value: animate });
  installed = () => {
    if (previous) Object.defineProperty(Element.prototype, "animate", previous);
    else Reflect.deleteProperty(Element.prototype, "animate");
  };
  return {
    animations,
    on: (element) => animations.filter((animation) => animation.element === element),
    finishAll: () => {
      for (const animation of animations) if (!animation.cancelled) animation.finish();
    },
  };
}
