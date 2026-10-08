import { afterEach, describe, expect, it, vi } from "vitest";

import { celebrate } from "./celebrate";

describe("celebrate", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    for (const canvas of document.querySelectorAll("canvas")) canvas.remove();
  });

  it("draws nothing under reduced motion", async () => {
    // The test setup reports `prefers-reduced-motion: reduce`.
    await celebrate();
    expect(document.querySelector("canvas")).toBeNull();
  });

  it("puts a hidden, pointer-transparent canvas above the page and removes it", async () => {
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: false, media: query }));
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
      scale: vi.fn(),
      clearRect: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
      translate: vi.fn(),
      rotate: vi.fn(),
      fillRect: vi.fn(),
    } as unknown as CanvasRenderingContext2D);
    let now = 0;
    vi.spyOn(performance, "now").mockImplementation(() => now);
    const frames: FrameRequestCallback[] = [];
    vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => frames.push(cb));

    const done = celebrate({ origin: { x: 10, y: 10 } });
    const canvas = document.querySelector("canvas");
    expect(canvas).toHaveAttribute("aria-hidden", "true");
    expect(canvas?.style.pointerEvents).toBe("none");

    for (now = 0; now <= 1500; now += 100) frames.shift()?.(now);
    await done;
    expect(document.querySelector("canvas")).toBeNull();
  });
});
