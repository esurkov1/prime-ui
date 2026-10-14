import { describe, expect, it } from "vitest";

import { firstFrame } from "./mediaFrame";

describe("firstFrame", () => {
  it("asks for the first frame past the start", () => {
    expect(firstFrame("/clip.mp4")).toBe("/clip.mp4#t=0.001");
  });

  it("keeps a source that already names a fragment", () => {
    expect(firstFrame("/clip.mp4#t=3")).toBe("/clip.mp4#t=3");
  });
});
