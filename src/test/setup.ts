import "@testing-library/jest-dom/vitest";

/*
 * jsdom has no matchMedia. Tests run with `prefers-reduced-motion: reduce`, so overlays
 * (`usePresence`) unmount synchronously on close instead of waiting for an exit animation that
 * jsdom never plays. Tests that cover motion stub matchMedia themselves (`vi.stubGlobal`).
 */
if (typeof window !== "undefined" && typeof window.matchMedia !== "function") {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    writable: true,
    value: (query: string): MediaQueryList => ({
      matches: query.includes("prefers-reduced-motion: reduce"),
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

/*
 * jsdom lacks AnimationEvent / TransitionEvent; without them React maps `onAnimationEnd` to the
 * webkit-prefixed event and `fireEvent.animationEnd` never reaches it.
 */
if (typeof window !== "undefined") {
  const w = window as unknown as Record<string, unknown>;
  if (!("AnimationEvent" in window)) w.AnimationEvent = class AnimationEvent extends Event {};
  if (!("TransitionEvent" in window)) w.TransitionEvent = class TransitionEvent extends Event {};
}
