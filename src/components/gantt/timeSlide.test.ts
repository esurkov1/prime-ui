import { describe, expect, it, vi } from "vitest";

import { sceneFor } from "./timeCore";
import { createTimeSlide } from "./timeSlide";

describe("time slide", () => {
  it("writes one transform onto every layer in the same call, and nothing it already wrote", () => {
    const onWrite = vi.fn();
    const slide = createTimeSlide(onWrite);
    const head = document.createElement("div");
    const row = document.createElement("div");
    slide.layer(head);
    const scene = sceneFor({ dayPx: 10, start: 50 }, 400, "wide", 365, 1);
    slide.reframe(scene, 50, 1);
    expect(head.style.transform).toBe("translate3d(-800px, 0, 0)");
    // A layer that mounts later takes the slide standing now.
    const release = slide.layer(row);
    expect(row.style.transform).toBe(head.style.transform);
    slide.move(52.5);
    expect(head.style.transform).toBe("translate3d(-825px, 0, 0)");
    expect(row.style.transform).toBe(head.style.transform);
    expect(slide.shift()).toBe(-825);
    expect(onWrite).toHaveBeenLastCalledWith(52.5, scene);
    // A move to where it stands writes nothing.
    onWrite.mockClear();
    slide.move(52.5);
    expect(onWrite).not.toHaveBeenCalled();
    // A released layer is no longer moved; right to left mirrors the slide.
    release?.();
    slide.reframe(scene, 51, -1);
    expect(head.style.transform).toBe("translate3d(810px, 0, 0)");
    expect(row.style.transform).toBe("translate3d(-825px, 0, 0)");
  });
});
